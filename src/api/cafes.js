// src/api/cafes.js
import axios from 'axios';

export const getCafes = async () => {
    const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
    const response = await axios.get(`${baseUrl}/cafes/GetCafes`);
    // console.log(response.data);
    return response.data;
 };
  