import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://www.punyaethnic.com/api/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Configure interceptors if needed
api.interceptors.request.use((config) => {
    // We will add logic here to append UserType and UserId to requests if needed
    return config;
});

api.interceptors.response.use((response) => {
    // Replace hardcoded localhost image URLs with the production URL
    if (response.data) {
        let dataString = JSON.stringify(response.data);
        const imageBase = import.meta.env.VITE_IMAGE_BASE_URL || 'http://www.punyaethnic.com/';
        // Replace both http and https localhost URLs
        dataString = dataString.replace(/https?:\/\/localhost:44330\//g, imageBase);
        response.data = JSON.parse(dataString);
    }
    return response;
});

export default api;
