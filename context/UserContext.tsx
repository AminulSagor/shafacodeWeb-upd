"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type User = {
  username: string;
  email: string;
  password: string;
  role: string;
  position: string;
  userEmail?: string;
  otp?: string;
};

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
  setOtp?: (otp: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<User>({ username: "", email: "", role: "", password: "",userEmail: "", position: "", otp: "" });


  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
}
