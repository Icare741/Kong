const express = require('express');
const cors = require('cors');
const amqp = require('amqplib');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration RabbitMQ
const RABBITMQ_URL = 'amqp://admin:admin@rabbitmq:5672';
const USER_CREATED_QUEUE = 'user_created';

// Middleware
app.use(cors());
app.use(express.json());

// Consommation des messages RabbitMQ
async function consumeUserCreated() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        
        await channel.assertQueue(USER_CREATED_QUEUE);
        
        console.log('En attente de messages...');
        
        channel.consume(USER_CREATED_QUEUE, (message) => {
            if (message) {
                const content = JSON.parse(message.content.toString());
                console.log('Nouvel utilisateur créé:', content);
                
                // Ici, vous pouvez ajouter la logique pour créer un panier
                // ou effectuer d'autres actions nécessaires
                
                channel.ack(message);
            }
        });
    } catch (error) {
        console.error('Erreur de connexion à RabbitMQ:', error);
    }
}

// Routes
app.get('/products', (req, res) => {
    res.json([
        { id: 1, name: 'Produit 1', price: 10 },
        { id: 2, name: 'Produit 2', price: 20 },
        { id: 3, name: 'Produit 3', price: 30 }
    ]);
});

// Démarrer la consommation des messages
consumeUserCreated();

app.listen(PORT, () => {
    console.log(`Service des produits démarré sur le port ${PORT}`);
}); 