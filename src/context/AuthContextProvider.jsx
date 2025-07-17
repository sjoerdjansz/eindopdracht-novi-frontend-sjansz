import React, { createContext, useEffect, useState } from "react";
import { API_ENDPOINTS } from "../api/api.js";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { checkTokenValidity } from "../utils/checkTokenValidity.js";

export const AuthContext = createContext(null);

function AuthContextProvider({ children }) {
  // state waarin de context data wordt geplaatst
  const [authUser, setAuthUser] = useState({ user: null, status: "pending" });

  // check if token is still present and valid so the user stays authenticated & logged in
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const { exp, userId, email } = jwtDecode(token);

        if (checkTokenValidity(exp)) {
          setAuthUser({
            user: {
              email: email,
              expiration: exp,
              userId: userId,
            },
            status: "done",
          });
        } else {
          logout();
        }
      } catch (error) {
        console.log("Error in catch from auth useEffect", error);
        logout();
      }
    } else {
      setAuthUser({ user: null, status: "done" });
    }
  }, []);

  const login = async (userDetails) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.login}`,
        { email: userDetails.email, password: userDetails.loginPassword },
        {
          headers: {
            "novi-education-project-id": import.meta.env.VITE_API_KEY,
            "Content-Type": "application/json",
          },
        },
      );

      const { exp, userId, email } = jwtDecode(response.data.token);

      localStorage.setItem("token", response.data.token);
      setAuthUser({
        user: {
          email: email,
          expiration: exp,
          userId: userId,
        },
        status: "done",
      });

      return { success: true };
    } catch (error) {
      console.error(error);

      let errorMessage = "Something went wrong. Try again.";
      if (error.response?.status === 401) {
        errorMessage = "Invalid login details.";
      }
      return { success: false, errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthUser({ user: null, status: "done" });
  };

  const authContextObject = {
    authUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextObject}>
      {authUser.status === "pending" ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
