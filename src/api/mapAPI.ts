import axios from 'axios';

export const endpoints = {
    layer : "/layers",
    node : "/nodes/LOCATION_INFO",
    query : "/query",
}

export const AuthAPI = axios.create({
    baseURL: 'https://hcmlis-auth.vietbando.vn/oauth/token',
})
export default axios.create({
    baseURL: 'http://10.225.0.248/vdms_mvc/api/v1',
    headers : {
        "Authorization" : `Bearer ${localStorage.getItem("access_token")}`
    }
})

export const  API_TOKEN = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA"