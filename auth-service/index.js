const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Pour l'exemple, nous utilisons des valeurs en dur
    if (username === 'admin' && password === 'password') {
        const token = jwt.sign(
            { 
                iss: 'JLbR2F67dntj0dx1SH0CVG2VX5CIlc04'  // La "key" de notre credential JWT dans Kong
            },
            process.env.JWT_SECRET || 'votre_secret_jwt',
            { expiresIn: '1h' }
        );
        return res.json({ token });
    }
    
    res.status(401).json({ message: 'Identifiants invalides' });
});

app.post('/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt');
        res.json({ valid: true, user: decoded });
    } catch (error) {
        res.status(401).json({ message: 'Token invalide' });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur d'authentification démarré sur le port ${PORT}`);
}); 