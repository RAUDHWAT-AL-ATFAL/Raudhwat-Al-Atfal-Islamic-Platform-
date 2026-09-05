const express = require("express");
const testRoutes = require("./routes/testRoutes");
const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoutes");
const adminRoutes = require("./routes/adminRoutes");
const mradiRoutes = require("./routes/mradiRoutes");
const donationRoutes = require("./routes/donationRoutes");
const donorRoutes = require("./routes/donorRoutes");
const dailyContentRoutes =
    require("./routes/dailyContentRoutes");
    const quranRoutes =
    require("./routes/quranRoutes");
    const quranSurahRoutes =
    require("./routes/quranSurahRoutes");
    const quranDownloadRoutes =
    require("./routes/quranDownloadRoutes");
const path = require("path");
const connectDB = require("./config/database");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/test", testRoutes);
app.use("/api/users", userRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/miradi", mradiRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/donors", donorRoutes);
app.use(
    "/api/daily-content",
    dailyContentRoutes
);
app.use(
    "/api/quran",
    quranRoutes
);
app.use(
    "/api/quran-surahs",
    quranSurahRoutes
);
app.use(
    "/api/quran-download",
    quranDownloadRoutes
);
// ==========================================
// SERVE DONATION RECEIPTS
// ==========================================

app.use(
    "/receipts",
    express.static(
        path.join(__dirname, "receipts")
    )
);

app.get("/", (req, res) => {
    res.json({
        message: "Backend is running successfully 🚀"
    });
});

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "API is working successfully 🚀"
    });
});
connectDB();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});