const API_URL = 'http://localhost:8000';

export const productService = {
    getAllProducts: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/products`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des produits');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    getProductById: async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/products/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Produit non trouvé');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}; 