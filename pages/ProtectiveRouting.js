import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS

export const ProtectiveRouting = () => {
    const isLoggedin=JSON.parse(localStorage.getItem("Loggedin"))

    useEffect(() => {
        if (isLoggedin !== "true") {
          // Show a toast notification if not logged in
          toast.info("Login is Required", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000 // Auto-close after 3 seconds
          });
        }
      }, [isLoggedin]);

  return isLoggedin ==="true"?<Outlet></Outlet>:<Navigate to="/"/>;
        
  
}
