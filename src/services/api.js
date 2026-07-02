import axios from "axios";

export const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

export const fetcher = ([url, params]) =>
    axios.get(url, { params }).then(res => res.data);