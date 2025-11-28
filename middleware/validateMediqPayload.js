module.exports = function (req, res, next) {
    const { patientCode, answers, responses, q25 } = req.body;

    if (!patientCode || typeof patientCode !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing patientCode' });
    }

    if (!answers || typeof answers !== 'object') {
        return res.status(400).json({ error: 'Invalid answers' });
    }
    /*
        if (!responses || typeof responses !== 'object') {
            return res.status(400).json({ error: 'Invalid responses' });
        }
    
        if (!q25 || typeof q25 !== 'object') {
            return res.status(400).json({ error: 'Invalid q25' });
        }*/

    next();
};
