const Mradi = require("../models/mradiModel");

// ===============================
// KUONGEZA MRADI
// ===============================
const ongezaMradi = async (req, res) => {
    try {
        const {
            kichwa,
            maelezo,
            hadithi,
            nukuu,
            lengoLaMchango,
            kianzioChaMchango,
            ujumbeWaMchango,
            tareheYaKuanza,
            tareheYaKumalizika,
            tareheYaTukio,
            hali,
            picha,
            mpangilio
        } = req.body;

        if (
            !kichwa ||
            !maelezo ||
            !lengoLaMchango ||
            !tareheYaKuanza ||
            !tareheYaKumalizika
        ) {
            return res.status(400).json({
                success: false,
                message: "Tafadhali jaza taarifa zote muhimu za mradi"
            });
        }

        const mradi = await Mradi.create({
            kichwa,
            maelezo,
            hadithi,
            nukuu,
            lengoLaMchango,
            kianzioChaMchango,
            ujumbeWaMchango,
            tareheYaKuanza,
            tareheYaKumalizika,
            tareheYaTukio,
            hali: hali || "unaendelea sasa",
            picha,
            mpangilio
        });

        res.status(201).json({
            success: true,
            message: "Mradi umeongezwa kikamilifu",
            data: mradi
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ===============================
// KUONA MIRADI YOTE
// ===============================
const pataMiradiYote = async (req, res) => {
    try {
        const miradi = await Mradi.find()
            .sort({ mpangilio: 1, createdAt: -1 });

        const data = miradi.map((item) => {
            const lengo = item.lengoLaMchango || 0;
            const kiasi = item.kiasiKilichopatikana || 0;

            let asilimia = 0;

            if (lengo > 0) {
                asilimia = (kiasi / lengo) * 100;
            }

            return {
                ...item.toObject(),

                asilimiaYaMaendeleo: Math.min(
                    Math.round(asilimia * 100) / 100,
                    100
                ),

                asilimiaHalisi:
                    Math.round(asilimia * 100) / 100,

                kiasiKilichobaki: Math.max(
                    lengo - kiasi,
                    0
                )
            };
        });

        res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ===============================
// KUONA MRADI MMOJA
// ===============================
const pataMradiKwaId = async (req, res) => {
    try {
        const mradi = await Mradi.findById(req.params.id);

        if (!mradi) {
            return res.status(404).json({
                success: false,
                message: "Mradi haujapatikana"
            });
        }

        const lengo = mradi.lengoLaMchango || 0;
        const kiasi = mradi.kiasiKilichopatikana || 0;

        let asilimia = 0;

        if (lengo > 0) {
            asilimia = (kiasi / lengo) * 100;
        }

        res.status(200).json({
            success: true,
            data: {
                ...mradi.toObject(),

                asilimiaYaMaendeleo: Math.min(
                    Math.round(asilimia * 100) / 100,
                    100
                ),

                asilimiaHalisi:
                    Math.round(asilimia * 100) / 100,

                kiasiKilichobaki: Math.max(
                    lengo - kiasi,
                    0
                )
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
// EXPORT
// ===============================
module.exports = {
    ongezaMradi,
    pataMiradiYote,
    pataMradiKwaId
};