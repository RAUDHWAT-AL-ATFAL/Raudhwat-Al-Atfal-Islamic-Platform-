const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            required: true,
            enum: [
                "user", 
                "admin", 
                "AMIRI", 
                "AMIRATI", 
                "KATIBU_ADMIN", 
                "KATIBATI", 
                "MWEKAHAZINA_ADMIN", 
                "AMIRI_HABARI",
                "KATIBU", 
                "MWEKAHAZINA", 
                "MWENYEKITI"
            ],
            default: "user"
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;