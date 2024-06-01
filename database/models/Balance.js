const { model, Schema, Types } = require("mongoose")

module.exports = model("User", new Schema(
    {
        userId: { type: String, required: true, unique: true },
        balance: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now }
    }
))