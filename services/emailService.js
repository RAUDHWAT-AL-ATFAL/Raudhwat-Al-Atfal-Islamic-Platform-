const nodemailer = require("nodemailer");

// ==========================================
// EMAIL TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});


// ==========================================
// SEND DONATION RECEIPT EMAIL
// ==========================================

const sendDonationReceiptEmail = async ({
    email,
    donorName,
    projectName,
    amount,
    receiptNumber,
    receiptPath
}) => {

    const mailOptions = {
        from: `"Raudhwat Al Atfal" <${process.env.EMAIL_USER}>`,

        to: email,

        subject:
            "Shukrani kwa Mchango Wako - Raudhwat Al Atfal",

        text: `
Assalaamu Alaikum ${donorName},

Tunapenda kukushukuru kwa dhati kwa mchango wako wa TZS ${Number(amount).toLocaleString()} kwa mradi wa ${projectName}.

Mchango wako ni sehemu ya matumaini, furaha na mustakabali bora wa watoto wetu.

Allah akulipe kheri, akubariki katika riziki yako, akuzidishie kheri na akubali mchango wako kuwa sadaqah yenye baraka.

Aamiin.

Receipt Number:
${receiptNumber}

Asante kwa kuwa sehemu ya safari hii ya kuwasaidia watoto.

Raudhwat Al Atfal - Mbeya
        `,

        attachments: [
            {
                filename: `${receiptNumber}.pdf`,
                path: receiptPath
            }
        ]
    };

    const info = await transporter.sendMail(mailOptions);

    return {
        success: true,
        messageId: info.messageId
    };
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    sendDonationReceiptEmail
};