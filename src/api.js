const API_URL = 'http://localhost:9001';

const getToken = () => sessionStorage.getItem('token');

export const apiFetch = async (endpoint, options = {}) => {
    const token = getToken();
    
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        },
    });

    // Si el token ha expirado o no es válido, mandamos al login
    if (response.status === 401 || response.status === 403) {
        sessionStorage.clear();
        window.location.href = '/';
    }

    return response;
};