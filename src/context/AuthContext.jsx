// [EJERCICIO 3] Firebase Auth + estado global
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
      }),
    []
  );
  const login = (email, pass) => signInWithEmailAndPassword(auth, email, pass);
  const register = (email, pass) =>
    createUserWithEmailAndPassword(auth, email, pass);
  const logout = () => signOut(auth);

  return (
    <AuthCtx.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthCtx.Provider>
  );
}
