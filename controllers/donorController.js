const Donor = require("../models/donorModel");
const Donation = require("../models/donationModel");
const Mradi = require("../models/mradiModel");

// ==========================================
// CREATE DONOR
// ==========================================

const createDonor = async (req, res) => {
try {

    const {
        fullName,
        phoneNumber,
        email,
        password,
        country,
        donorType,
        isAnonymous
    } = req.body;

    // Hapa tunahakikisha taarifa muhimu zimejazwa
    if (
        !fullName ||
        !phoneNumber ||
        !email ||
        !password
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Tafadhali jaza taarifa zote muhimu za mchangiaji"
        });
    }

    // Hapa tunaangalia kama email tayari ipo
    const existingEmail =
        await Donor.findOne({ email });

    if (existingEmail) {
        return res.status(409).json({
            success: false,
            message:
                "Email hii tayari imesajiliwa"
        });
    }

    // Hapa tunaangalia kama namba tayari ipo
    const existingPhone =
        await Donor.findOne({
            phoneNumber
        });

    if (existingPhone) {
        return res.status(409).json({
            success: false,
            message:
                "Mchangiaji mwenye namba hii tayari yupo"
        });
    }

    // Hapa tunatengeneza donor mpya
    const donor =
        await Donor.create({
            fullName,
            phoneNumber,
            email,
            password,
            country,
            donorType,
            isAnonymous
        });

    // Usirudishe password kwenye response
    const donorData =
        donor.toObject();

    delete donorData.password;

    res.status(201).json({
        success: true,
        message:
            "Mchangiaji ameongezwa kikamilifu",
        data: donorData
    });

} catch (error) {

    res.status(500).json({
        success: false,
        message: error.message
    });

}

};

// ==========================================
// GET ALL DONORS
// ==========================================

const getAllDonors = async (req, res) => {
try {

    const donors =
        await Donor.find()
            .select("-password")
            .sort({
                createdAt: -1
            });

    res.status(200).json({
        success: true,
        count: donors.length,
        data: donors
    });

} catch (error) {

    res.status(500).json({
        success: false,
        message: error.message
    });

}

};

// ==========================================
// GET DONOR PROFILE
// ==========================================

const getDonorById = async (req, res) => {
try {

    const donor =
        await Donor.findById(
            req.params.id
        ).select("-password");

    if (!donor) {
        return res.status(404).json({
            success: false,
            message:
                "Mchangiaji hakupatikana"
        });
    }

    res.status(200).json({
        success: true,
        data: donor
    });

} catch (error) {

    res.status(500).json({
        success: false,
        message: error.message
    });

}

};

// ==========================================
// UPDATE DONOR
// ==========================================

const updateDonor = async (req, res) => {
try {

    const updateData = {
        ...req.body
    };

    // Password haitakiwi kubadilishwa
    // kupitia endpoint hii bila validation
    delete updateData.password;
    delete updateData.role;

    const donor =
        await Donor.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

    if (!donor) {
        return res.status(404).json({
            success: false,
            message:
                "Mchangiaji hakupatikana"
        });
    }

    res.status(200).json({
        success: true,
        message:
            "Taarifa za mchangiaji zimebadilishwa",
        data: donor
    });

} catch (error) {

    res.status(500).json({
        success: false,
        message: error.message
    });

}

};

// ==========================================
// DEACTIVATE DONOR
// ==========================================

const deactivateDonor = async (req, res) => {
try {

    const donor =
        await Donor.findByIdAndUpdate(
            req.params.id,
            {
                isActive: false
            },
            {
                new: true
            }
        ).select("-password");

    if (!donor) {
        return res.status(404).json({
            success: false,
            message:
                "Mchangiaji hakupatikana"
        });
    }

    res.status(200).json({
        success: true,
        message:
            "Akaunti ya mchangiaji imezimwa",
        data: donor
    });

} catch (error) {

    res.status(500).json({
        success: false,
        message: error.message
    });

}

};

// ==========================================
// GET DONOR DASHBOARD
// ==========================================

const getDonorDashboard = async (req, res) => {
try {

    const donorId =
        req.params.id;

    // ==================================
    // DONOR PROFILE
    // ==================================

    const donor =
        await Donor.findById(
            donorId
        ).select("-password");

    if (!donor) {
        return res.status(404).json({
            success: false,
            message:
                "Mchangiaji hakupatikana"
        });
    }


    // ==================================
    // DONATION HISTORY
    // ==================================

    const donations =
        await Donation.find({
            donorId
        })
            .populate(
                "projectId",
                "kichwa maelezo lengoLaMchango kiasiKilichopatikana picha hali"
            )
            .sort({
                createdAt: -1
            });


    // ==================================
    // CONFIRMED DONATIONS
    // ==================================

    const confirmedDonations =
        donations.filter(
            donation =>
                donation.paymentStatus ===
                "confirmed"
        );


    // ==================================
    // PENDING DONATIONS
    // ==================================

    const pendingDonations =
        donations.filter(
            donation =>
                donation.paymentStatus ===
                "pending"
        );


    // ==================================
    // TOTAL DONATED
    // ==================================

    const totalDonated =
        confirmedDonations.reduce(
            (total, donation) =>
                total +
                Number(donation.amount || 0),
            0
        );


    // ==================================
    // PROJECTS SUPPORTED
    // ==================================

    const supportedProjectIds = [
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


    // ==================================
    // ALL PROJECTS + PROGRESS
    // ==================================

    const projects =
        await Mradi.find()
            .sort({
                mpangilio: 1,
                createdAt: -1
            });


    const projectsWithProgress =
        projects.map(project => {

            const goal =
                Number(
                    project.lengoLaMchango || 0
                );

            const raised =
                Number(
                    project.kiasiKilichopatikana || 0
                );

            const rawProgress =
                goal > 0
                    ? (raised / goal) * 100
                    : 0;

            const progress =
                Math.min(
                    Math.round(
                        rawProgress * 100
                    ) / 100,
                    100
                );

            const remaining =
                Math.max(
                    goal - raised,
                    0
                );

            const donorDonations =
                confirmedDonations.filter(
                    donation =>
                        donation.projectId?._id
                            ?.toString() ===
                        project._id.toString()
                );

            const donorContribution =
                donorDonations.reduce(
                    (total, donation) =>
                        total +
                        Number(
                            donation.amount || 0
                        ),
                    0
                );

            return {

                id:
                    project._id,

                kichwa:
                    project.kichwa,

                maelezo:
                    project.maelezo,

                picha:
                    project.picha,

                hali:
                    project.hali,

                lengoLaMchango:
                    goal,

                kiasiKilichopatikana:
                    raised,

                kiasiKilichobaki:
                    remaining,

                asilimiaYaMaendeleo:
                    progress,

                mchangoWaDonor:
                    donorContribution,

                donorAmewahiKuchangia:
                    donorContribution > 0
            };
        });


    // ==================================
    // RESPONSE
    // ==================================

    res.status(200).json({

        success: true,

        data: {

            // Donor profile
            profile: donor,

            // Dashboard summary
            summary: {

                totalDonated,

                totalDonations:
                    donations.length,

                confirmedDonations:
                    confirmedDonations.length,

                pendingDonations:
                    pendingDonations.length,

                projectsSupported:
                    supportedProjectIds.length
            },

            // Donation history
            donationHistory:
                donations,

            // All projects + progress
            projects:
                projectsWithProgress
        }
    });

} catch (error) {

    console.error(
        "Donor Dashboard Error:",
        error
    );

    res.status(500).json({
        success: false,
        message: error.message
    });

}

};

// ==========================================
// EXPORT
// ==========================================

module.exports = {

createDonor,

getAllDonors,

getDonorById,

updateDonor,

deactivateDonor,

getDonorDashboard

};