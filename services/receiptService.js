const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// ==========================================
// GENERATE DONATION RECEIPT
// ==========================================

const tengenezaReceipt = async ({
    receiptNumber,
    donorName,
    phoneNumber,
    projectName,
    amount,
    paymentMethod,
    transactionReference,
    paymentDate
}) => {

    return new Promise((resolve, reject) => {

        try {

            // ==================================
            // RECEIPTS FOLDER
            // ==================================

            const receiptsFolder = path.join(
                __dirname,
                "../receipts"
            );

            // Tengeneza folder kama haipo
            if (!fs.existsSync(receiptsFolder)) {

                fs.mkdirSync(
                    receiptsFolder,
                    {
                        recursive: true
                    }
                );
            }

            // ==================================
            // FILE NAME
            // ==================================

            const fileName =
                `${receiptNumber}.pdf`;

            const filePath =
                path.join(
                    receiptsFolder,
                    fileName
                );

            // ==================================
            // CREATE PDF
            // ==================================

            const doc = new PDFDocument({
                size: "A4",
                margin: 50
            });

            const stream =
                fs.createWriteStream(
                    filePath
                );

            doc.pipe(stream);

            // ==================================
            // HEADER
            // ==================================

            doc
                .fontSize(24)
                .font("Helvetica-Bold")
                .text(
                    "RAUDHWAT AL ATFAL",
                    {
                        align: "center"
                    }
                );

            doc
                .moveDown(0.5)
                .fontSize(16)
                .font("Helvetica-Bold")
                .text(
                    "DONATION RECEIPT",
                    {
                        align: "center"
                    }
                );

            doc.moveDown(1);

            // ==================================
            // RECEIPT DETAILS
            // ==================================

            doc
                .fontSize(11)
                .font("Helvetica")
                .text(
                    `Receipt Number: ${receiptNumber}`
                );

            doc.text(
                `Payment Date: ${paymentDate}`
            );

            doc.moveDown(1);

            // ==================================
            // DONOR DETAILS
            // ==================================

            doc
                .fontSize(14)
                .font("Helvetica-Bold")
                .text(
                    "DONOR INFORMATION"
                );

            doc.moveDown(0.5);

            doc
                .fontSize(11)
                .font("Helvetica")
                .text(
                    `Name: ${donorName}`
                );

            doc.text(
                `Phone: ${phoneNumber}`
            );

            doc.moveDown(1);

            // ==================================
            // DONATION DETAILS
            // ==================================

            doc
                .fontSize(14)
                .font("Helvetica-Bold")
                .text(
                    "DONATION INFORMATION"
                );

            doc.moveDown(0.5);

            doc
                .fontSize(11)
                .font("Helvetica")
                .text(
                    `Project: ${projectName}`
                );

            doc.text(
                `Amount: TZS ${Number(
                    amount
                ).toLocaleString()}`
            );

            doc.text(
                `Payment Method: ${paymentMethod}`
            );

            doc.text(
                `Transaction Reference: ${
                    transactionReference || "N/A"
                }`
            );

            doc.text(
                "Payment Status: CONFIRMED"
            );

            doc.moveDown(1.5);

            // ==================================
            // THANK YOU
            // ==================================

            doc
                .fontSize(14)
                .font("Helvetica-Bold")
                .text(
                    "THANK YOU"
                );

            doc.moveDown(0.5);

            doc
                .fontSize(11)
                .font("Helvetica")
                .text(
                    "Tunakupongeza na kukushukuru kwa dhati kwa kuwa sehemu ya juhudi za kuwasaidia watoto wetu. Mchango wako ni sehemu ya matumaini, furaha na mustakabali bora."
                );

            doc.moveDown(1);

            // ==================================
            // DUA
            // ==================================

            doc
                .fontSize(14)
                .font("Helvetica-Bold")
                .text(
                    "DUA"
                );

            doc.moveDown(0.5);

            doc
                .fontSize(11)
                .font("Helvetica")
                .text(
                    "Allah akulipe kheri, akubariki katika riziki yako, akuzidishie kheri na akubali mchango wako kuwa sadaqah yenye baraka. Aamiin."
                );

            doc.moveDown(2);

            // ==================================
            // FOOTER
            // ==================================

            doc
                .fontSize(9)
                .font("Helvetica")
                .text(
                    "Raudhwat Al Atfal - Mbeya",
                    {
                        align: "center"
                    }
                );

            doc
                .moveDown(0.3)
                .text(
                    "Donation Management System",
                    {
                        align: "center"
                    }
                );

            // ==================================
            // FINISH PDF
            // ==================================

            doc.end();

            // ==================================
            // WHEN PDF IS READY
            // ==================================

            stream.on(
                "finish",
                () => {

                    resolve({

                        success: true,

                        fileName,

                        filePath

                    });

                }
            );

            stream.on(
                "error",
                (error) => {

                    reject(error);

                }
            );

        } catch (error) {

            reject(error);

        }

    });
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    tengenezaReceipt
};