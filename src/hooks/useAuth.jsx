import { createContext, useContext, useState, useCallback } from "react";
import { USERS } from "../data/users";

const AuthCtx = createContext();

export function useAuth() {
  return useContext(AuthCtx);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback((username, password) => {
    const found = USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      setUser(found);
      return { success: true, user: found };
    }
    return { success: false, error: "Username atau password salah" };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthCtx.Provider>
  );
}
