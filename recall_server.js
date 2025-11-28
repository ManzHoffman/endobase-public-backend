require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const formRoutes = require('./routes/form');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://80.74.147.132',
        'https://core.frilance.ch',
        'https://gynecologie-hfr.ch'// include HTTPS if you're using SSL
    ],
})); // Adjust to your frontend domain
app.use(helmet());
app.use(express.json());

app.use('/api/mediq', formRoutes);



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
