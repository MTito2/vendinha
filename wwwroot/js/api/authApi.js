import api from './api.js';

/**
 * Faz o login do usuário
 * @param {Object} credentials 
 */
export async function loginUser(credentials) {
    try {
        const response = await api.post('/auth/login', credentials);

        return response.data;
    } catch (error) {
        console.error("Erro ao fazer login:", error);

        throw error; 
    }
}

/**
 * Cadastra um novo funcionário
 * @param {Object} userData
 */
export async function registerUser(userData) {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        throw error;
    }
}

export async function editUser(userId, userData) {
    try {
        const response = await api.patch(`/auth/users/${userId}`, userData);

    } catch (error) {
        console.error("Erro ao editar usuário:", error);
        throw error;
    }
}

export async function logoutUser() {
    try {
        const response = await api.post('/auth/logout');
        return response.data;
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
        throw error;
    }
}

export async function getUsers() {
    try {
        const response = await api.get('/auth/users');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        throw error;
    }
}
