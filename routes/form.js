const express = require('express');
const router = express.Router();
const validateMediqPayload = require('../middleware/validateMediqPayload');
const sendMediqEmail = require('../utils/sendEmail'); // ⬅️ Import the email function

router.post('/', validateMediqPayload, async (req, res) => {
    const formData = req.body;

    try {
        // Send email with formData as .json attachment
        await sendMediqEmail(formData);

        return res.status(200).json({ message: 'Data received and email sent successfully.' });
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return res.status(500).json({ error: 'Server error while sending email.' });
    }
});

module.exports = router;
