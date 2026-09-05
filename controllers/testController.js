const Test = require("../models/testModel");
// POST - Create Test
const createTest = async (req, res) => {
  try {
    const test = await Test.create({
      name: "Bashiri",
      message: "MongoDB is working 🚀"
    });

    res.status(201).json({
  "success": true,
  "data": tests  
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
// GET - Get all Tests
const getTests = async (req, res) => {
  try {
    const tests = await Test.find();
    res.status(200).json({
      success: true,
      data: tests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Toa nje zote mbili kwa pamoja
module.exports = {
  createTest,
  getTests,
  getAllAdmins
};