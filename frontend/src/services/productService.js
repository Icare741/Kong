const API_URL = 'http://localhost:8000';

export const productService = {
    getAllProducts: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Aucun token trouvé');
            }

            const response = await fetch(`${API_URL}/products`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || 
                    `Erreur ${response.status}: ${response.statusText}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur getAllProducts:', error);
            throw error;
        }
    },

    getProductById: async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Aucun token trouvé');
            }

            const response = await fetch(`${API_URL}/products/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || 
                    `Erreur ${response.status}: ${response.statusText}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur getProductById:', error);
            throw error;
        }
    }
}; 