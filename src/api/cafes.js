import axios from 'axios';

export const getCafes = async () => {
    const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
    const response = await axios.get(`${baseUrl}/cafes/GetCafes`);
    // console.log(response.data);
    return response.data;
 };
 
 export const createCafe = async (cafeData) => {
    const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
    const response = await axios.post(`${baseUrl}/cafes/CreateCafe`, cafeData);
    console.log(response.data);
    return response.data;
 };

 export const updateCafe = async (cafeData) => {
    const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
    const response = await axios.put(`${baseUrl}/cafes/UpdateCafe`, cafeData);
    console.log(response.data);
    return response.data;
 };

 export const deleteCafe = async (cafeId) => {
    const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
    try {
      const response = await axios.delete(`${baseUrl}/cafes/DeleteCafe/${cafeId}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting cafe:", error);
      throw error; // Re-throw the error if needed for further handling
    }
  };