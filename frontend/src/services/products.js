import { getAuthToken } from './auth';

const API_URL = 'http://localhost:8000';

export const getProducts = async () => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/products`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Non autorisé');
      }
      throw new Error('Erreur lors de la récupération des produits');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    throw error;
  }
}; 