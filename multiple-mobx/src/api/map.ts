import axios from 'axios';

export let endpoints = {
    layer : "/layers",
    node : "/node",
    query : "/query",
}

export let AuthAPI = axios.create({
    baseURL: 'https://hcmlis-auth.vietbando.vn/oauth/token',
})
export default axios.create({
    baseURL: 'http://10.225.0.246/vdms_mvc/api/v1',
    headers : {
        "Authorization" : `Bearer ${localStorage.getItem("access_token")}`
    }
})