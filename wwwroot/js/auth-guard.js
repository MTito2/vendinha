import api from './api/api.js'; 

async function checkAuth() {
    try {
        await api.get('/auth/me'); 
        document.body.classList.remove("protected-page");
        
    } catch (error) {
        if (error.response && error.response.status === 401) {
            window.location.replace('/pages/admin/login.html'); 
        }
    }
}

checkAuth();