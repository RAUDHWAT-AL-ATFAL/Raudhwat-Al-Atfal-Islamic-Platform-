const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin
        const admin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin"
        });

        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: "admin" })
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: admins.length,
            data: admins
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// ===============================
// UPDATE ADMIN
// ===============================
const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        const admin = await User.findOne({
            _id: id,
            role: "admin"
        });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        if (name) {
            admin.name = name;
        }

        if (email) {
            admin.email = email;
        }

        if (password) {
            admin.password = await bcrypt.hash(password, 10);
        }

        await admin.save();

        res.status(200).json({
            success: true,
            message: "Admin updated successfully",
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// ===============================
// DEACTIVATE ADMIN
// ===============================
const deactivateAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const admin = await User.findOne({
            _id: id,
            role: "admin"
        });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        admin.isActive = false;

        await admin.save();

        res.status(200).json({
            success: true,
            message: "Admin deactivated successfully",
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                isActive: admin.isActive
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {
    createAdmin,
    getAllAdmins,
    updateAdmin,
    deactivateAdmin
};