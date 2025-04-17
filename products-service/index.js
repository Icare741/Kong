const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes protégées qui nécessiteront un JWT valide
app.get('/products', (req, res) => {
    res.json([
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 },
        { id: 3, name: 'Product 3', price: 300 }
    ]);
});

app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    res.json({ id, name: `Product ${id}`, price: id * 100 });
});

app.listen(PORT, () => {
    console.log(`Products service démarré sur le port ${PORT}`);
}); 