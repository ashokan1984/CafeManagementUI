// src/api/cafes.js
import axios from 'axios';

export const getEmployeesByCafeId = async (cafeId) => {
    const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
    const response = await axios.get(`${baseUrl}/Employees/GetEmployeesByCafeId?cafeId=${cafeId}`);
    console.log(response.data);
    return response.data;
 };

 export const saveEmployee = async () => {
   
 };
  