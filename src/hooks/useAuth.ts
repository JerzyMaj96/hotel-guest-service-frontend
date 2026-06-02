import { useState } from "react";
import { api, authStore } from "../api/client";
import type { AppRole } from "../types/domain";

const getRoleFromToken = (token: string): AppRole => {
  const payload = JSON.parse(atob(token.split(".")[1]));
  const role = payload.role as string;
  return role.replace("ROLE_", "") as AppRole;
};

export const useAuth = () => {
  const [isAuthed, setAuthed] = useState(Boolean(authStore.token));
  const [role, setRole] = useState<AppRole>(() =>
    authStore.token ? getRoleFromToken(authStore.token) : "GUEST",
  );

  const onLogin = async (
    email: string,
    password: string,
    register?: { firstName: string; lastName: string },
  ) => {
    if (register) await api.register({ ...register, email, password });
    authStore.token = await api.login(email, password);
    setRole(getRoleFromToken(authStore.token!));
    setAuthed(true);
  };

  const onLogout = () => {
    authStore.token = null;
    setAuthed(false);
  };

  return { isAuthed, role, onLogin, onLogout };
};
