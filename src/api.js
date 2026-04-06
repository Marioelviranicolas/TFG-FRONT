// src/api.js
const API_URL = 'http://localhost:9001';

const getToken = () => sessionStorage.getItem('token');

export const apiFetch = async (endpoint, options = {}) => {
    const token = getToken();
    const { skipRedirect, ...fetchOptions } = options;

    const headers = {};
    if (!(fetchOptions.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }
    Object.assign(headers, fetchOptions.headers);

    // SOLO añadir Authorization si el token existe
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    // Si el token ha expirado o no es válido, mandamos al login
    // skipRedirect evita este comportamiento para llamadas donde un 401/403 es esperado
    if (!skipRedirect && (response.status === 401 || response.status === 403)) {
        sessionStorage.clear();
        window.location.href = '/';
    }

    return response;
};