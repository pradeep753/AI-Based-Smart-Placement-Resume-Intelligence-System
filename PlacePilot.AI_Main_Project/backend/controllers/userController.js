const User = require("../models/User");
const { isDatabaseConnected } = require("../config/db");
const store = require("../data/inMemoryStore");

const sanitizeUser = (user) => ({
    id: user._id ? user._id.toString() : user.id,
    name: user.name,
    email: user.email,
});

exports.getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = isDatabaseConnected()
            ? await User.findById(userId).select("-password")
            : store.findUserById(userId);

        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }

        return res.json({ user: sanitizeUser(user) });
    } catch (error) {
        return res.status(500).json({ msg: "Unable to fetch profile." });
    }
};

exports.updateCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email } = req.body;

        if (!name && !email) {
            return res.status(400).json({ msg: "Provide at least one field to update." });
        }

        const updates = {};

        if (typeof name === "string" && name.trim()) {
            updates.name = name.trim();
        }

        if (typeof email === "string" && email.trim()) {
            updates.email = email.trim().toLowerCase();
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ msg: "No valid updates were provided." });
        }

        if (isDatabaseConnected()) {
            if (updates.email) {
                const existing = await User.findOne({ email: updates.email });
                if (existing && existing._id.toString() !== userId) {
                    return res.status(409).json({ msg: "Email already in use." });
                }
            }

            const updatedUser = await User.findByIdAndUpdate(userId, updates, {
                new: true,
                runValidators: true,
            }).select("-password");

            if (!updatedUser) {
                return res.status(404).json({ msg: "User not found." });
            }

            return res.json({ user: sanitizeUser(updatedUser) });
        }

        if (updates.email) {
            const existing = store.findUserByEmail(updates.email);
            if (existing && existing.id !== userId) {
                return res.status(409).json({ msg: "Email already in use." });
            }
        }

        const updatedUser = store.updateUser(userId, updates);

        if (!updatedUser) {
            return res.status(404).json({ msg: "User not found." });
        }

        return res.json({ user: sanitizeUser(updatedUser) });
    } catch (error) {
        return res.status(500).json({ msg: "Unable to update profile." });
    }
};
