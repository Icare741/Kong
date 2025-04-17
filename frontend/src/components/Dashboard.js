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
    Grid,
    CircularProgress,
    TablePagination,
    Card,
    CardContent
} from '@mui/material';

const Dashboard = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [searchedProduct, setSearchedProduct] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await productService.getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error('Erreur lors du chargement des produits:', error);
                if (error.message.includes('Aucun token trouvé')) {
                    navigate('/login');
                } else {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [navigate]);

    const handleSearch = async () => {
        if (!searchId) return;

        setSearchLoading(true);
        setError('');
        setSearchedProduct(null);

        try {
            const product = await productService.getProductById(searchId);
            setSearchedProduct(product);
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            if (error.message.includes('Aucun token trouvé')) {
                navigate('/login');
            } else {
                setError(error.message);
            }
        } finally {
            setSearchLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (loading) {
        return (
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

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

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

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
                                    disabled={searchLoading}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleSearch}
                                    disabled={searchLoading}
                                >
                                    {searchLoading ? <CircularProgress size={24} /> : 'Rechercher'}
                                </Button>
                            </Box>
                            {searchedProduct && (
                                <Box sx={{ mt: 2 }}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Produit trouvé
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle1">
                                                        <strong>ID:</strong> {searchedProduct.id}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle1">
                                                        <strong>Nom:</strong> {searchedProduct.name}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle1">
                                                        <strong>Description:</strong> {searchedProduct.description}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle1">
                                                        <strong>Prix:</strong> {searchedProduct.price} €
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Box>
                            )}
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Liste des produits
                            </Typography>
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
                                        {products
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((product) => (
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
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={products.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Produits par page"
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Dashboard; 