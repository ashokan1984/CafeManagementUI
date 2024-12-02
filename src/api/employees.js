import axios from 'axios';

export const getEmployeesByCafeId = async (cafeId) => {
    const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
    const response = await axios.get(`${baseUrl}/Employees/GetEmployeesByCafeId?cafeId=${cafeId}`);
    console.log(response.data);
    return response.data;
 };


 export const createEmployee = async (employeeData) => {
    const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
    const response = await axios.post(`${baseUrl}/Employees/CreateEmployee`, employeeData);
    console.log(response.data);
    return response.data;
 };

 export const updateEmployee = async (employeeData) => {
    const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
    const response = await axios.put(`${baseUrl}/Employees/UpdateEmployee`, employeeData);
    console.log(response.data);
    return response.data;
 };

 export const deleteEmployee = async (employeeId) => {
    const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
    try {
      const response = await axios.delete(`${baseUrl}/Employees/DeleteEmployee/${employeeId}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting cafe:", error);
      throw error; // Re-throw the error if needed for further handling
    }
  };
  