const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const crypto = require('crypto');
const axios = require('axios');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const MATRIX_SERVER_URL = process.env.MATRIX_SERVER_URL;
const SHARED_SECRET = process.env.MATRIX_SHARED_SECRET;

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        // Generiere HMAC
        const mac = crypto.createHmac('sha1', SHARED_SECRET)
            .update(`${username}\0${password}\0notadmin`)
            .digest('hex');

        // API-Aufruf an Synapse
        const response = await axios.post(`${MATRIX_SERVER_URL}/_synapse/admin/v1/register`, {
            username: username,
            password: password,
            admin: false,
            mac: mac
        });

        res.status(200).json({ message: 'User registered successfully!', matrix_id: response.data.user_id });
    } catch (error) {
        res.status(500).json({ error: error.response?.data?.error || 'Registration failed.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
