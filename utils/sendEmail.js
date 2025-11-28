const nodemailer = require('nodemailer');
const { Readable } = require('stream');
const { encryptBuffer } = require('./encrypt'); // path as appropriate

require('dotenv').config();


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

module.exports = async function sendMediqEmail(formData) {
    const jsonBuffer = Buffer.from(JSON.stringify(formData, null, 2));

    // 🔐 Encrypt the JSON before attaching
    let encryptedBuffer;
    try {
        encryptedBuffer = encryptBuffer(jsonBuffer);
    } catch (err) {
        console.error("❌ Failed to encrypt data:", err);
        return; // or throw, depending on how you want to handle this
    }

    const mailOptions = {
        from: `"RECALL" <${process.env.EMAIL_USER}>`,
        to: [process.env.EMAIL_TO, process.env.EMAIL_TO_ADM],
        cc: process.env.EMAIL_TO_CC,
        subject: `RECALL: Nouveau formulaire de ${formData.patientCode}`,
        html: `
      <h2>🩺 Formulaire RECALL reçu</h2>
      <p>Code patiente :${formData.patientCode}.Le fichier joint est chiffré (AES-256-GCM). Utilisez l’outil interne de déchiffrement.</p>
    `,
        attachments: [
            {
                filename: `mediq-${formData.patientCode}-${Date.now()}.json.enc`,
                content: encryptedBuffer,
                contentType: 'application/octet-stream'
            }
        ]
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent. Response from SMTP:");
        console.log(info);
    } catch (error) {
        console.error("❌ Failed to send email:", error);
    }
};
