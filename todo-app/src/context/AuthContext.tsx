import { useState, type ReactNode } from "react";
import {
  AuthContext,
  SESSION_KEY,
  readCurrentUser,
  readUsers,
  writeUsers,
  type User,
} from "./authContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => readCurrentUser());

  function register(username: string, email: string, password: string) {
    const users = readUsers();

    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, message: "Username is already taken." };
    }
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "Email is already registered." };
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      email,
      password,
    };

    writeUsers([...users, newUser]);
    localStorage.setItem(SESSION_KEY, newUser.id);
    setUser(newUser);
    return { success: true, message: "Registration successful!" };
  }

  function login(identifier: string, password: string) {
    const users = readUsers();
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === identifier.toLowerCase() ||
        u.username.toLowerCase() === identifier.toLowerCase(),
    );

    if (!found || found.password !== password) {
      return { success: false, message: "Invalid credentials." };
    }

    localStorage.setItem(SESSION_KEY, found.id);
    setUser(found);
    return { success: true, message: "Signed in successfully!" };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  function resetPassword(email: string, newPassword: string) {
    const users = readUsers();
    const index = users.findIndex(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    if (index === -1) {
      return { success: false, message: "No account found with that email." };
    }

    const updated = [...users];
    updated[index] = { ...updated[index], password: newPassword };
    writeUsers(updated);

    if (user?.id === updated[index].id) {
      setUser(updated[index]);
    }
    return { success: true, message: "Password has been reset." };
  }

  function updateProfile(updates: Partial<Pick<User, "username" | "email">>) {
    if (!user) return { success: false, message: "Not signed in." };

    const users = readUsers();

    if (
      updates.username &&
      users.some(
        (u) =>
          u.id !== user.id &&
          u.username.toLowerCase() === updates.username!.toLowerCase(),
      )
    ) {
      return { success: false, message: "Username is already taken." };
    }
    if (
      updates.email &&
      users.some(
        (u) =>
          u.id !== user.id &&
          u.email.toLowerCase() === updates.email!.toLowerCase(),
      )
    ) {
      return { success: false, message: "Email is already in use." };
    }

    const updated = { ...user, ...updates };
    writeUsers(users.map((u) => (u.id === user.id ? updated : u)));
    setUser(updated);
    return { success: true, message: "Profile updated." };
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
