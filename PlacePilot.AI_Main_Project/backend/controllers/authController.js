const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isDatabaseConnected } = require("../config/db");
const store = require("../data/inMemoryStore");

const TOKEN_TTL = "7d";

const sanitizeUser = (user) => ({
    id: user._id ? user._id.toString() : user.id,
    name: user.name,
    email: user.email,
});

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ msg: "Name, email and password are required." });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const usingDb = isDatabaseConnected();

        const existingUser = usingDb
            ? await User.findOne({ email: normalizedEmail })
            : store.findUserByEmail(normalizedEmail);

        if (existingUser) {
            return res.status(409).json({ msg: "Email already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = usingDb
            ? await User.create({ name, email: normalizedEmail, password: hashedPassword })
            : store.createUser({ name, email: normalizedEmail, password: hashedPassword });

        const token = jwt.sign({ id: user._id ? user._id.toString() : user.id }, process.env.JWT_SECRET, { expiresIn: TOKEN_TTL });

        return res.status(201).json({
            token,
            user: sanitizeUser(user),
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ msg: "Email already registered." });
        }

        return res.status(500).json({ msg: "Unable to sign up right now." });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required." });
        }

        const normalizedEmail = String(email).trim().toLowerCase();

        const user = isDatabaseConnected()
            ? await User.findOne({ email: normalizedEmail })
            : store.findUserByEmail(normalizedEmail);

        if (!user) return res.status(400).json({ msg: "User not found." });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ msg: "Wrong password." });

        const token = jwt.sign({ id: user._id ? user._id.toString() : user.id }, process.env.JWT_SECRET, { expiresIn: TOKEN_TTL });

        return res.json({
            token,
            user: sanitizeUser(user),
        });
    } catch (error) {
        return res.status(500).json({ msg: "Unable to login right now." });
    }
};
