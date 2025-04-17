import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/products';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Alert,
} from '@mui/material';

const Products = ({ onLogout }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      setError('');
    } catch (error) {
      if (error.message === 'Non autorisé') {
        setError('Session expirée. Veuillez vous reconnecter.');
        onLogout();
      } else {
        setError('Erreur lors du chargement des produits');
      }
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Nos Produits
      </Typography>
      
      <Button
        variant="outlined"
        color="primary"
        onClick={onLogout}
        sx={{ mb: 3 }}
      >
        Se déconnecter
      </Button>

      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card>
              {product.image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
              )}
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  {product.price} €
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Products; 