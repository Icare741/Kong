import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Alert,
    Grid
} from '@mui/material';

const Dashboard = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [searchedProduct, setSearchedProduct] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getAllProducts();
                setProducts(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchProducts();
    }, []);

    const handleSearch = async () => {
        if (!searchId) return;

        setLoading(true);
        setError('');
        setSearchedProduct(null);

        try {
            const product = await productService.getProductById(searchId);
            setSearchedProduct(product);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1">
                        Tableau de bord
                    </Typography>
                    <Button variant="contained" color="error" onClick={handleLogout}>
                        Déconnexion
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Rechercher un produit par ID
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="ID du produit"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleSearch}
                                    disabled={loading}
                                >
                                    Rechercher
                                </Button>
                            </Box>
                            {searchedProduct && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle1">
                                        Produit trouvé :
                                    </Typography>
                                    <pre>{JSON.stringify(searchedProduct, null, 2)}</pre>
                                </Box>
                            )}
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Liste des produits
                            </Typography>
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Nom</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Prix</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {products.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>{product.id}</TableCell>
                                                <TableCell>{product.name}</TableCell>
                                                <TableCell>{product.description}</TableCell>
                                                <TableCell>{product.price} €</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Dashboard; 