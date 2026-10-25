const mongoose = require("mongoose");

const isPlaceholderUri = (uri) => {
    if (!uri) return true;

    const normalized = uri.trim().toLowerCase();
    const placeholders = [
        "your_mongodb_url",
        "your_mongodb_uri",
        "mongodb_uri",
        "your_mongo_uri",
        "mongodb_connection_string",
    ];

    return placeholders.includes(normalized);
};

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (isPlaceholderUri(mongoUri)) {
        console.warn("MongoDB URI is missing or placeholder. Running with in-memory fallback.");
        return false;
    }

    try {
        await mongoose.connect(mongoUri);
        console.log("MongoDB Connected");
        return true;
    } catch (error) {
        console.error("MongoDB connection failed. Running with in-memory fallback.");
        console.error(error.message);
        return false;
    }
};

const isDatabaseConnected = () => mongoose.connection.readyState === 1;

module.exports = { connectDB, isDatabaseConnected };
