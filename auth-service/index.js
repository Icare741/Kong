const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const amqp = require('amqplib');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration de la base de données
const pool = new Pool({
    host: process.env.DB_HOST || 'auth-db',
    user: process.env.DB_USER || 'auth',
    password: process.env.DB_PASSWORD || 'authpass',
    database: process.env.DB_NAME || 'auth',
    port: 5432
});

// Configuration RabbitMQ
let channel;
const RABBITMQ_URL = 'amqp://admin:admin@rabbitmq:5672';
const USER_CREATED_QUEUE = 'user_created';

// Initialisation de RabbitMQ
async function initRabbitMQ() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue(USER_CREATED_QUEUE);
        console.log('Connecté à RabbitMQ');
    } catch (error) {
        console.error('Erreur de connexion à RabbitMQ:', error);
    }
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/auth/register', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Vérifier si l'utilisateur existe déjà
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }
        
        // Créer le nouvel utilisateur
        const result = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, password]
        );
        
        const newUser = result.rows[0];
        
        // Publier un message RabbitMQ
        if (channel) {
            await channel.sendToQueue(
                USER_CREATED_QUEUE,
                Buffer.from(JSON.stringify({
                    userId: newUser.id,
                    email: newUser.email,
                    timestamp: new Date().toISOString()
                }))
            );
        }
        
        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: newUser
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
});

app.post('/auth/login', async (req, res) => {
    console.log('Tentative de connexion:', req.body);
    const { email, password } = req.body;
    
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND password = $2',
            [email, password]
        );
        
        if (result.rows.length === 0) {
            console.log('Identifiants invalides pour:', email);
            return res.status(401).json({ message: 'Identifiants invalides' });
        }
        
        const user = result.rows[0];
        const token = jwt.sign(
            { 
                iss: 'JLbR2F67dntj0dx1SH0CVG2VX5CIlc04',
                sub: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        console.log('Connexion réussie pour:', email);
        res.json({ token });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
});

app.post('/auth/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ valid: true, user: decoded });
    } catch (error) {
        res.status(401).json({ message: 'Token invalide' });
    }
});

// Initialiser RabbitMQ au démarrage
initRabbitMQ();

app.listen(PORT, () => {
    console.log(`Serveur d'authentification démarré sur le port ${PORT}`);
}); 