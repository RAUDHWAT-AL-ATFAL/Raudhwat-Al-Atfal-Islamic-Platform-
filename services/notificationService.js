// ==========================================
// NOTIFICATION SERVICE
// ==========================================

// ------------------------------------------
// SEND THANK YOU SMS
// ------------------------------------------

const sendThankYouSMS = async ({
    phoneNumber,
    donorName,
    projectName,
    amount,
    receiptNumber
}) => {

    // Kwa sasa tunaandaa message.
    // SMS provider tutaunganisha baadaye.

    const message = `
Assalaamu Alaikum ${donorName}.

Tunashukuru kwa mchango wako wa TZS ${Number(amount).toLocaleString()} kwa mradi wa ${projectName}.

Mchango wako ni sehemu ya matumaini na furaha ya watoto wetu.

Allah akulipe kheri, akubariki katika riziki yako na akubali mchango wako kuwa sadaqah yenye baraka.

Receipt: ${receiptNumber}

Raudhwat Al Atfal - Mbeya
`;

    console.log("SMS READY:");
    console.log("To:", phoneNumber);
    console.log(message);

    return {
        success: true,
        type: "sms",
        message
    };
};


// ------------------------------------------
// SEND THANK YOU EMAIL
// ------------------------------------------

const sendThankYouEmail = async ({
    email,
    donorName,
    projectName,
    amount,
    receiptNumber,
    receiptPath
}) => {

    // Email provider tutaunganisha baadaye.

    const subject =
        "Shukrani kwa Mchango Wako - Raudhwat Al Atfal";

    const message = `
Assalaamu Alaikum ${donorName},

Tunapenda kukushukuru kwa dhati kwa mchango wako wa TZS ${Number(amount).toLocaleString()} kwa mradi wa ${projectName}.

Mchango wako ni sehemu muhimu ya juhudi za kuwasaidia watoto wetu kupata mahitaji muhimu na kujenga mustakabali bora.

Allah akulipe kheri, akubariki katika riziki yako, akuzidishie kheri na akubali mchango wako kuwa sadaqah yenye baraka.

Aamiin.

Receipt Number:
${receiptNumber}

Raudhwat Al Atfal - Mbeya
`;

    console.log("EMAIL READY:");
    console.log("To:", email);
    console.log("Subject:", subject);
    console.log(message);
    console.log("Attachment:", receiptPath);

    return {
        success: true,
        type: "email",
        subject,
        message,
        receiptPath
    };
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    sendThankYouSMS,
    sendThankYouEmail
};