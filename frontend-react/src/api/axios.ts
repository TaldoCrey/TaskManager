import axios from 'axios';

const baseAPIurl = import.meta.env.VITE_API_URL;

console.log("Connecting at: ", import.meta.env);

const api = axios.create({
    baseURL: baseAPIurl
});

export default api;