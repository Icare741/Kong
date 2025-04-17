const API_URL = 'http://localhost:8000';

export const authService = {
    register: async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de l\'inscription');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    login: async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de la connexion');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            return data;
        } catch (error) {
            throw error;
        }
    },

    verifyToken: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;

            const response = await fetch(`${API_URL}/auth/verify`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                localStorage.removeItem('token');
                return null;
            }

            return await response.json();
        } catch (error) {
            localStorage.removeItem('token');
            return null;
        }
    }
}; 