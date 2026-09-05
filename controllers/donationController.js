const Donation = require("../models/donationModel");
const Donor = require("../models/donorModel");
const Mradi = require("../models/mradiModel");

const {
tengenezaReceipt
} = require("../services/receiptService");

const {
sendDonationReceiptEmail
} = require("../services/emailService");

const {
sendDonationThankYouSMS
} = require("../services/smsService");

// ===============================
// CREATE DONATION
// ===============================

const createDonation = async (req, res) => {
try {

    const {
        projectId,
        donorId,
        donorName,
        phoneNumber,
        amount,
        paymentMethod,
        transactionReference,
        email
    } = req.body;

    // Check required information
    if (
        !projectId ||
        !donorId ||
        !donorName ||
        !phoneNumber ||
        !amount ||
        !paymentMethod
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Tafadhali jaza taarifa zote muhimu za mchango"
        });
    }

    // Check project
    const project =
        await Mradi.findById(projectId);

    if (!project) {
        return res.status(404).json({
            success: false,
            message:
                "Mradi haujapatikana"
        });
    }

    // Check donor
    const donor =
        await Donor.findById(donorId);

    if (!donor) {
        return res.status(404).json({
            success: false,
            message:
                "Mchangiaji hakupatikana"
        });
    }

    // Create donation
    const donation =
        await Donation.create({
            projectId,
            donorId,
            donorName,
            phoneNumber,
            email,
            amount,
            paymentMethod,
            transactionReference
        });

    res.status(201).json({
        success: true,
        message:
            "Mchango umepokelewa na unasubiri uthibitisho wa malipo",
        data: donation
    });

} catch (error) {

    res.status(500).json({
        success: false,
        message: error.message
    });

}

};

// ===============================
// GET ALL DONATIONS
// ===============================

const getAllDonations = async (req, res) => {
try {

    const donations =
        await Donation.find()
            .populate("projectId", "kichwa")
            .populate(
                "donorId",
                "fullName phoneNumber"
            )
            .sort({
                createdAt: -1
            });

    res.status(200).json({
        success: true,
        count: donations.length,
        data: donations
    });

} catch (error) {

    res.status(500).json({
        success: false,
        message: error.message
    });

}

};

// ===============================
// GET DONATION BY ID
// ===============================

const getDonationById = async (req, res) => {
try {

    const donation =
        await Donation.findById(req.params.id)
            .populate(
                "projectId",
                "kichwa"
            )
            .populate(
                "donorId",
                "fullName phoneNumber"
            );

    if (!donation) {
        return res.status(404).json({
            success: false,
            message:
                "Mchango haujapatikana"
        });
    }

    res.status(200).json({
        success: true,
        data: donation
    });

} catch (error) {

    res.status(500).json({
        success: false,
        message: error.message
    });

}

};

// ===============================
// GET DONOR DONATION HISTORY
// ===============================

const getDonorDonationHistory = async (req, res) => {
try {

    const donations =
        await Donation.find({
            donorId:
                req.params.donorId
        })
            .populate(
                "projectId",
                "kichwa"
            )
            .sort({
                createdAt: -1
            });

    res.status(200).json({
        success: true,
        count: donations.length,
        data: donations
    });

} catch (error) {

    res.status(500).json({
        success: false,
        message: error.message
    });

}

};

// ===============================
// GET DONOR DONATION SUMMARY
// ===============================

const getDonorDonationSummary = async (req, res) => {
try {

    const donations =
        await Donation.find({
            donorId:
                req.params.donorId
        })
            .populate(
                "projectId",
                "kichwa"
            )
            .sort({
                createdAt: -1
            });

    const confirmedDonations =
        donations.filter(
            donation =>
                donation.paymentStatus ===
                "confirmed"
        );

    const pendingDonations =
        donations.filter(
            donation =>
                donation.paymentStatus ===
                "pending"
        );

    const totalDonated =
        confirmedDonations.reduce(
            (total, donation) =>
                total + donation.amount,
            0
        );

    const projectIds = [
        ...new Set(
            confirmedDonations
                .map(
                    donation =>
                        donation.projectId?._id
                            ?.toString()
                )
                .filter(Boolean)
        )
    ];

    res.status(200).json({
        success: true,

        data: {
            totalDonated,

            totalDonations:
                donations.length,

            confirmedDonations:
                confirmedDonations.length,

            pendingDonations:
                pendingDonations.length,

            projectsSupported:
                projectIds.length,

            donationHistory:
                donations
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
// CONFIRM DONATION
// ===============================

const confirmDonation = async (req, res) => {
try {

    const donation =
        await Donation.findById(
            req.params.id
        );

    if (!donation) {
        return res.status(404).json({
            success: false,
            message:
                "Mchango haujapatikana"
        });
    }

    // Prevent duplicate confirmation
    if (
        donation.paymentStatus ===
        "confirmed"
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Mchango huu tayari umethibitishwa"
        });
    }

    // Find project
    const project =
        await Mradi.findById(
            donation.projectId
        );

    if (!project) {
        return res.status(404).json({
            success: false,
            message:
                "Mradi wa mchango huu haujapatikana"
        });
    }

    // =================================
    // CONFIRM PAYMENT
    // =================================

    donation.paymentStatus =
        "confirmed";

    donation.confirmedAt =
        new Date();

    // =================================
    // UPDATE PROJECT AMOUNT
    // =================================

    project.kiasiKilichopatikana =
        (project.kiasiKilichopatikana || 0) +
        donation.amount;

    await project.save();

    // =================================
    // GENERATE RECEIPT
    // =================================

    const receiptNumber =
        `RAA-${Date.now()}`;

    const receipt =
        await tengenezaReceipt({

            receiptNumber,

            donorName:
                donation.donorName,

            phoneNumber:
                donation.phoneNumber,

            projectName:
                project.kichwa,

            amount:
                donation.amount,

            paymentMethod:
                donation.paymentMethod,

            transactionReference:
                donation.transactionReference,

            paymentDate:
                new Date().toLocaleString()
        });

    // =================================
    // SAVE RECEIPT INFORMATION
    // =================================

    donation.receiptNumber =
        receiptNumber;

    donation.receiptUrl =
        `/receipts/${receipt.fileName}`;

    await donation.save();

    // =================================
    // EMAIL
    // =================================

    let emailResult = null;

    if (donation.email) {

        try {

            emailResult =
                await sendDonationReceiptEmail({

                    email:
                        donation.email,

                    donorName:
                        donation.donorName,

                    projectName:
                        project.kichwa,

                    amount:
                        donation.amount,

                    receiptNumber:
                        donation.receiptNumber,

                    receiptPath:
                        receipt.filePath
                });

        } catch (emailError) {

            console.error(
                "Email failed:",
                emailError.message
            );

        }
    }

    // =================================
    // SMS
    // =================================

    let smsResult = null;

    if (donation.phoneNumber) {

        try {

            smsResult =
                await sendDonationThankYouSMS({

                    phoneNumber:
                        donation.phoneNumber,

                    donorName:
                        donation.donorName,

                    projectName:
                        project.kichwa,

                    amount:
                        donation.amount,

                    receiptNumber:
                        donation.receiptNumber
                });

        } catch (smsError) {

            console.error(
                "SMS failed:",
                smsError.message
            );

        }
    }

    // =================================
    // RESPONSE
    // =================================

    res.status(200).json({

        success: true,

        message:
            "Mchango umethibitishwa, mradi umesasishwa na receipt imetengenezwa",

        data: {

            donation,

            project: {

                id:
                    project._id,

                kichwa:
                    project.kichwa,

                lengoLaMchango:
                    project.lengoLaMchango,

                kiasiKilichopatikana:
                    project.kiasiKilichopatikana
            },

            notifications: {

                email:
                    emailResult,

                sms:
                    smsResult
            }
        }
    });

} catch (error) {

    console.error(
        "Confirm Donation Error:",
        error
    );

    res.status(500).json({
        success: false,
        message: error.message
    });

}

};

// ===============================
// EXPORT
// ===============================

module.exports = {

createDonation,

getAllDonations,

getDonationById,

getDonorDonationHistory,

getDonorDonationSummary,

confirmDonation

};