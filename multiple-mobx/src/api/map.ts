import axios, { AxiosResponse } from "axios";

axios.defaults.baseURL = "http://10.225.0.246/vdms_mvc/api/v1"
axios.defaults.headers.common = {'Authorization' : `Bearer EpkzsOgTxs5CdyHELFLf-SbzE-ElM-qRQEfjuXJYFiqxleb-TN8FefZ2V71mRXzli5jFY8dUEfbmccFFYI_EhX4oG3NvnQvSA75T26VWWBU6wg1comLmWTcLu30Rhqg1PgrSUvmPAwDs1dIdCinc8jX02J3yXoRZjNvNdHr38_xaxV8c-6a8dHuZzEH9NxZYj8IdRkkEvhNoWnMLE9N-etgCU9FOIGCJjB467zHlSYsqQwzL9hLtgsP9mhkRRoZYe9EP22c03uMeMXssjSmoRu0ZuZiAyI3mwBkxsE0ZHEhPioSlCPdh9xUoHfzvGnLerqSwkVoY63lUMRP-JG9v7C6AYXZNYLWmwvLx9PuHHr0YLln6kNPfrLNYmScUQ0SxPkypSW2pGaq7l8PK9x0lZJoCYP2X9B7Pcf5mr5aUVj4B2lnSOMJwl54C524Ro-ndDk9Ht7I40CLlg63biXw3prNLxI8`}
const responseBody = (response: AxiosResponse) => response.data;
const sleep = (ms: number) => (response: AxiosResponse) =>
    new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));


export const requests = {
    get: (url: string) =>
        axios
            .get(url).then(sleep(1000))
            .then(responseBody),
    post: (url: string, body: {}) =>
        axios
            .post(url, body).then(sleep(1000))
            .then(responseBody),
    put: (url: string, body: {}) =>
        axios
            .put(url, body).then(sleep(1000))
            .then(responseBody),
    del: (url: string) =>
        axios
            .delete(url).then(sleep(1000))
            .then(responseBody),
};

export const url = {
    layer: "/layers",
    node : "/nodes",
    query : 'query',
}

