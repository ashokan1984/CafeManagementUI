import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CafesPage from "./pages/CafesPage";
import EmployeesPage from "./pages/EmployeesPage";
import CafeForm from "./components/CafeForm";
import EmployeeForm from "./components/EmployeeForm";

const router = createBrowserRouter([
  { path: "/", element: <CafesPage /> },
  { path: "/employees/:cafeId", element: <EmployeesPage /> },
  { path: "/cafes/add", element: <CafeForm /> },
  { path: "/cafes/edit/:id", element: <CafeForm /> },
  { path: "/employees/add/:cafeId", element: <EmployeeForm /> },
  { path: "/employees/edit/:cafeId/:employeeId", element: <EmployeeForm /> },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
