const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken"); 
require("dotenv").config();

// ==========================================
// IMPORTS ZA ROUTES ZAKO ZA AWALI
// ==========================================
const testRoutes = require("./routes/testRoutes");
const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoutes");
const adminRoutes = require("./routes/adminRoutes");
const mradiRoutes = require("./routes/mradiRoutes");
const donationRoutes = require("./routes/donationRoutes");
const donorRoutes = require("./routes/donorRoutes");
const dailyContentRoutes = require("./routes/dailyContentRoutes");
const quranRoutes = require("./routes/quranRoutes");
const quranSurahRoutes = require("./routes/quranSurahRoutes");
const quranDownloadRoutes = require("./routes/quranDownloadRoutes");

// Database & Models
const connectDB = require("./config/database");
const Payment = require("./models/paymentModel");
const Mradi = require("./models/mradiModel");
const User = require("./models/userModel"); 

const app = express();
const server = http.createServer(app);

const JWT_SECRET = process.env.JWT_SECRET || "Raudhwat_Al_Atfal_Super_Secret_Key_2026";

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use("/receipts", express.static(path.join(__dirname, "receipts")));

// ==========================================
// DEFAULT MAADMIN SEEDER
// ==========================================
async function seedDefaultMaadmin() {
    try {
        const defaultAdmins = [
            { name: "Amiri Mkuu", email: "amiri@miradi.org", password: "amiri123", phone: "0710000001", role: "AMIRI" },
            { name: "Amirati", email: "amirati@miradi.org", password: "amirati123", phone: "0710000002", role: "AMIRATI" },
            { name: "Katibu", email: "katibu.admin@miradi.org", password: "katibu123", phone: "0710000003", role: "KATIBU_ADMIN" },
            { name: "Katibati", email: "katibati@miradi.org", password: "katibati123", phone: "0710000004", role: "KATIBATI" },
            { name: "Mwekahazina", email: "mwekahazina.admin@miradi.org", password: "mwekahazina123", phone: "0710000005", role: "MWEKAHAZINA_ADMIN" },
            { name: "Amiri Habari", email: "habari@miradi.org", password: "habari123", phone: "0710000006", role: "AMIRI_HABARI" }
        ];

        for (let admin of defaultAdmins) {
            const existingAdmin = await User.findOne({ role: admin.role });
            if (!existingAdmin) {
                await User.create(admin);
                console.log(`[SEED] Admin rasmi ameongezwa: ${admin.role} (${admin.email})`);
            } else {
                existingAdmin.email = admin.email;
                existingAdmin.password = admin.password;
                existingAdmin.name = admin.name;
                await existingAdmin.save();
            }
        }
    } catch (err) {
        console.error("Admin Seed Error:", err.message);
    }
}

// ==========================================
// JWT SECURITY MIDDLEWARES
// ==========================================
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "⛔ Access Denied: Huna idhini ya kuingia (Token Inakosekana)" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: "⛔ Token Siyo Sahihi au Imepita Wakati (Expired)" });
    }
};

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `⛔ Mamlaka Duni: Cheo chako (${req.user ? req.user.role : 'Guest'}) hakiruhusiwi kufanya kitendo hiki!` 
            });
        }
        next();
    };
};

// ==========================================
// SETUP ZA ROUTES ZAKO ZA AWALI
// ==========================================
app.use("/api/test", testRoutes);
app.use("/api/users", userRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/miradi", mradiRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/daily-content", dailyContentRoutes);
app.use("/api/quran", quranRoutes);
app.use("/api/quran-surahs", quranSurahRoutes);
app.use("/api/quran-download", quranDownloadRoutes);

// ==========================================
// HELPER FUNCTION: PROGRESS BAR BROADCAST
// ==========================================
async function updateAndBroadcastMradi(mradiId) {
    try {
        if (!mradiId) return;

        const objectId = typeof mradiId === "string" ? new mongoose.Types.ObjectId(mradiId) : mradiId;

        const balanceResult = await Payment.aggregate([
            { $match: { mradi_id: objectId, status: "SUCCESS" } },
            {
                $group: {
                    _id: null,
                    totalIncome: {
                        $sum: { $cond: [{ $eq: ["$type", "INCOME"] }, "$amount", 0] }
                    },
                    totalExpense: {
                        $sum: { $cond: [{ $eq: ["$type", "EXPENSE"] }, "$amount", 0] }
                    }
                }
            },
            {
                $project: {
                    netBalance: { $subtract: ["$totalIncome", "$totalExpense"] }
                }
            }
        ]);

        const netBalance = balanceResult.length > 0 ? Math.max(0, balanceResult[0].netBalance) : 0;

        const mradiInfo = await Mradi.findById(mradiId);
        const targetAmount = mradiInfo ? mradiInfo.target_amount : 10000000;
        const percentage = Math.max(0, Math.min(100, ((netBalance / targetAmount) * 100).toFixed(2)));

        io.emit("payment-updated", {
            mradiId: mradiId,
            newTotalRaw: netBalance,
            newTotalFormatted: netBalance.toLocaleString() + " TZS",
            targetAmountFormatted: targetAmount.toLocaleString() + " TZS",
            percentage: percentage
        });
    } catch (error) {
        console.error("Error in updateAndBroadcastMradi:", error);
    }
}

async function findMradiByRef(userInput) {
    if (!userInput) return null;
    const cleanInput = userInput.trim();
    const regexMatch = new RegExp(`^${cleanInput}$`, "i");

    return await Mradi.findOne({
        is_active: true,
        $or: [
            { code: cleanInput.toUpperCase() },
            { name: regexMatch },
            { aliases: cleanInput.toUpperCase() },
            { aliases: regexMatch }
        ]
    });
}

// ==========================================
// AUTHENTICATION ROUTE (LOGIN)
// ==========================================
app.post("/api/auth/login", async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const user = await User.findOne({ role });
        
        if (!user || user.email !== email || user.password !== password) {
            return res.status(401).json({ 
                success: false, 
                message: "⛔ Imekataliwa: Email, Password au Cheo ulichochagua siyo sahihi!" 
            });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role, name: user.name },
            JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
});

// ==========================================
// REGISTRATION ROUTE (AMIRI / AMIRATI KUSAJILI ADMIN)
// ==========================================
app.post("/api/admin/register", verifyToken, authorizeRoles("AMIRI", "AMIRATI"), async (req, res) => {
    const { name, email, password, phone, role } = req.body;

    const allowedRoles = ["AMIRI", "AMIRATI", "KATIBU_ADMIN", "KATIBATI", "MWEKAHAZINA_ADMIN", "AMIRI_HABARI"];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ success: false, message: "⛔ Cheo ulichochagua siyo sahihi kwa upande wa maadmin!" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "⛔ Email hii tayari imesajiliwa!" });
        }

        const newAdmin = await User.create({ name, email, password, phone, role });

        res.status(201).json({
            success: true,
            message: `Account ya ${role} imetengenezwa kwa mafanikio!`,
            data: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email, role: newAdmin.role }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
});

// ==========================================
// CHANGE PASSWORD ROUTE
// ==========================================
app.put("/api/auth/change-password", verifyToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "⛔ Mtumiaji hakupatikana!" });
        }

        if (user.password !== oldPassword) {
            return res.status(400).json({ success: false, message: "⛔ Neno la siri la zamani siyo sahihi!" });
        }

        user.password = newPassword;
        await user.save();

        res.json({ 
            success: true, 
            message: "✅ Neno la siri limebadilishwa kwa mafanikio!" 
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
});

// ==========================================
// SECURED APPROVAL ROUTES
// ==========================================
app.post("/api/withdraw/initiate", verifyToken, authorizeRoles("KATIBU_ADMIN"), async (req, res) => {
    const { mradi_id, amount, reason } = req.body;

    try {
        const newPaymentRequest = await Payment.create({
            reference_id: `REQ-${Date.now()}`,
            mradi_id,
            amount: parseFloat(amount),
            reason,
            type: "EXPENSE",
            status: "INITIATED", 
            initiated_by: req.user.userId,
            provider: "SYSTEM_APPROVAL"
        });

        io.emit("approval-status-changed", { message: "Ombi Jipya limeanzishwa na Katibu" });

        res.json({ success: true, message: "Ombi limetumwa kwa Mwekahazina kwa ajili ya Uhakiki!", data: newPaymentRequest });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post("/api/withdraw/verify", verifyToken, authorizeRoles("MWEKAHAZINA_ADMIN"), async (req, res) => {
    const { request_id, action } = req.body; 

    try {
        const payment = await Payment.findById(request_id);
        if (!payment) return res.status(404).json({ success: false, message: "Ombi halikupatikana" });

        if (action === "APPROVE") {
            payment.status = "VERIFIED";
            payment.verified_by = req.user.userId;
            await payment.save();

            io.emit("approval-status-changed", { message: "Ombi limehakikiwa na Mwekahazina" });
            return res.json({ success: true, message: "Ombi limehakikiwa! Limetumwa kwa Amiri kwa Idhini ya Mwisho." });
        } else {
            payment.status = "REJECTED_BY_TREASURER";
            await payment.save();
            return res.json({ success: true, message: "Ombi limekataliwa na Mwekahazina." });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post("/api/withdraw/approve", verifyToken, authorizeRoles("AMIRI", "AMIRATI"), async (req, res) => {
    const { request_id, action } = req.body;

    try {
        const payment = await Payment.findById(request_id);
        if (!payment) return res.status(404).json({ success: false, message: "Ombi halikupatikana" });

        if (payment.status !== "VERIFIED") {
            return res.status(400).json({ success: false, message: "Ombi hili halijahakikiwa na Mwekahazina bado!" });
        }

        if (action === "APPROVE") {
            payment.status = "SUCCESS"; 
            payment.approved_by = req.user.userId;
            await payment.save();

            await updateAndBroadcastMradi(payment.mradi_id);

            return res.json({ success: true, message: "Ombi LIMEIDHINISHWA rasmi! Salio la Mradi limepunguzwa." });
        } else {
            payment.status = "REJECTED_BY_CHAIRMAN";
            await payment.save();
            return res.json({ success: true, message: "Ombi limekataliwa na Amiri." });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get("/api/withdraw/list/:role", verifyToken, async (req, res) => {
    const { role } = req.params;

    try {
        let filter = {};
        if (role === "MWEKAHAZINA_ADMIN") filter = { status: "INITIATED" };
        if (role === "AMIRI" || role === "AMIRATI") filter = { status: "VERIFIED" };

        const pendingList = await Payment.find(filter)
            .populate("mradi_id", "name code")
            .populate("initiated_by", "name email");

        res.json({ success: true, data: pendingList });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ==========================================
// AZAMPAY & VODACOM ROUTES
// ==========================================
app.post("/api/azampay/checkout", async (req, res) => {
    const { phone_number, amount, student_id, provider, mradi_id } = req.body;
    const referenceId = `INV-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;

    try {
        await Payment.create({
            reference_id: referenceId,
            student_id: student_id || "GUEST",
            mradi_id: mradi_id,
            amount: parseFloat(amount),
            phone: phone_number,
            type: "INCOME",
            status: "PENDING",
            provider: "AZAMPAY"
        });

        const tokenRes = await axios.post(
            "https://authenticator.azampay.co.tz/AppIdentity/api/v1/Merchant/token",
            {
                appName: process.env.AZAMPAY_APP_NAME,
                clientId: process.env.AZAMPAY_CLIENT_ID,
                clientSecret: process.env.AZAMPAY_CLIENT_SECRET
            }
        );

        const bearerToken = tokenRes.data.data.accessToken;

        await axios.post(
            "https://checkout.azampay.co.tz/azampay/momo/checkout",
            {
                accountNumber: phone_number,
                amount: amount.toString(),
                currency: "TZS",
                externalId: referenceId,
                provider: provider
            },
            {
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                    "X-API-Key": process.env.AZAMPAY_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({ success: true, message: "Ombi la malipo limetumwa kwenye simu ya mteja", referenceId });
    } catch (error) {
        res.status(500).json({ success: false, message: "Imefeli kutuma ombi la malipo", error: error.response?.data || error.message });
    }
});

app.post("/api/azampay/callback", async (req, res) => {
    const data = req.body;
    if (data && data.transactionstatus === "success") {
        try {
            const updatedPayment = await Payment.findOneAndUpdate(
                { reference_id: data.utilityref },
                { status: "SUCCESS" },
                { new: true }
            );

            if (updatedPayment) {
                await updateAndBroadcastMradi(updatedPayment.mradi_id);
            }
            return res.status(200).json({ message: "Income Callback Processed" });
        } catch (err) {
            return res.status(500).send("Database Processing Error");
        }
    }
    res.status(200).json({ message: "Received" });
});

app.post("/api/voda/validation", async (req, res) => {
    const data = req.body;
    const userProvidedRef = data.BillRefNumber || data.AccountReference || "";

    try {
        const mradi = await findMradiByRef(userProvidedRef);
        if (!mradi) {
            return res.status(200).json({ ResultCode: "C2B00012", ResultDesc: "Andika jina sahihi la mradi" });
        }
        return res.status(200).json({ ResultCode: "0", ResultDesc: "Accepted" });
    } catch (error) {
        return res.status(200).json({ ResultCode: "C2B00012", ResultDesc: "Andika jina sahihi la mradi" });
    }
});

app.post("/api/voda/callback", async (req, res) => {
    const data = req.body; 

    try {
        const transType = data.TransactionType || data.CommandID;
        const transAmount = parseFloat(data.TransAmount || data.Amount || 0);
        const referenceId = data.TransID || data.MpesaReceiptNumber || `VODA-${Date.now()}`;
        const userProvidedRef = data.BillRefNumber || data.AccountReference || "";

        const mradi = await findMradiByRef(userProvidedRef);
        if (!mradi) {
            return res.status(400).json({ ResultCode: "C2B00012", ResultDesc: "Andika jina sahihi la mradi" });
        }

        let paymentType = "INCOME";
        if (transType === "Withdrawal" || transType === "BusinessPayment" || data.Type === "EXPENSE") {
            paymentType = "EXPENSE";
        }

        const newPayment = await Payment.create({
            reference_id: referenceId,
            mradi_id: mradi._id,
            amount: transAmount,
            phone: data.MSISDN || data.Msisdn || "MPESA_MENU",
            type: paymentType,
            status: "SUCCESS",
            provider: "VODACOM_MENU"
        });

        await updateAndBroadcastMradi(newPayment.mradi_id);

        return res.status(200).json({ ResultCode: "0", ResultDesc: "Service processing completed successfully" });
    } catch (error) {
        return res.status(500).json({ ResultCode: "1", ResultDesc: "Internal Processing Error" });
    }
});

io.on("connection", (socket) => {
    console.log("⚡ Client mpya amejiunga kwenye Real-time Notification System");
});

// ==========================================
// STATIC PAGES / HTML ROUTES
// ==========================================
app.get("/login.html", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "public", "login.html"));
});

app.get("/register-leader.html", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "public", "register-leader.html"));
});

app.get("/dashboard-viongozi.html", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "public", "dashboard-viongozi.html"));
});
app.get("/change-password.html", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "public", "change-password.html"));
});
// Default Home Route
app.get("/", (req, res) => {
    res.json({ message: "Backend is running successfully 🚀" });
});

connectDB().then(() => {
    seedDefaultMaadmin();
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});