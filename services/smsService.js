// ==========================================
// SMS SERVICE
// ==========================================

const sendDonationThankYouSMS = async ({
    phoneNumber,
    donorName,
    projectName,
    amount,
    receiptNumber
}) => {

    const message = `
Assalaamu Alaikum ${donorName}.

Tunashukuru kwa mchango wako wa TZS ${Number(amount).toLocaleString()} kwa mradi wa ${projectName}.

Mchango wako ni sehemu ya matumaini na furaha ya watoto wetu.

Allah akulipe kheri, akubariki katika riziki yako na akubali mchango wako kuwa sadaqah yenye baraka.

Receipt: ${receiptNumber}

Raudhwat Al Atfal - Mbeya
`;

    /*
     * SMS PROVIDER WILL BE CONNECTED HERE.
     *
     * Do NOT put API keys directly in this file.
     */

    console.log("SMS READY");
    console.log("Recipient:", phoneNumber);
    console.log("Message:", message);

    return {
        success: true,
        phoneNumber,
        message
    };
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    sendDonationThankYouSMS
};