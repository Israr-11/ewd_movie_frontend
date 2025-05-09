import React, { createContext, useState, useContext, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;


interface AuthTokens {
  idToken: string;
  accessToken: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  tokens: AuthTokens | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getUserId: () => string | null;
  error: string | null;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedTokens = localStorage.getItem("auth_tokens");
    if (storedTokens) {
      try {
        const parsedTokens = JSON.parse(storedTokens) as AuthTokens;

        const payload = JSON.parse(atob(parsedTokens.idToken.split(".")[1]));
        const isExpired = Date.now() >= payload.exp * 1000;

        if (!isExpired) {
          setTokens(parsedTokens);
          setIsAuthenticated(true);
          setUserEmail(payload.email);
        } else {
          localStorage.removeItem("auth_tokens");
          localStorage.removeItem("user_id");
        }
      } catch (e) {
        localStorage.removeItem("auth_tokens");
      }
    }
  }, []);

  const register = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      const newTokens = {
        idToken: data.token,
        accessToken: data.accessToken,
      };

      localStorage.setItem("auth_tokens", JSON.stringify(newTokens));

      const payload = JSON.parse(atob(newTokens.idToken.split(".")[1]));
      const userId = payload.sub;

      localStorage.setItem("user_id", userId);

      setTokens(newTokens);
      setIsAuthenticated(true);
      setUserEmail(payload.email);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  const getUserId = () => {
    const storedTokens = localStorage.getItem("auth_tokens");
    if (!storedTokens) return null;

    try {
      const tokens = JSON.parse(storedTokens);
      const payload = JSON.parse(atob(tokens.idToken.split(".")[1]));
      return payload.sub;
    } catch (e) {
      console.error("Error extracting user ID from token", e);
      return null;
    }
  };

  const logout = async () => {
    try {
      if (tokens) {
        await fetch(`${BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("auth_tokens");
      localStorage.removeItem("user_id");
      setTokens(null);
      setIsAuthenticated(false);
      setUserEmail(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userEmail,
        tokens,
        login,
        register,
        logout,
        getUserId,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
