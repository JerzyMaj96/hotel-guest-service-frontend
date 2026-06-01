import { useState } from "react";
import { api, authStore } from "../api/client";

export const useAuth = () => {
  const [isAuthed, setAuthed] = useState(Boolean(authStore.token));

  const onLogin = async (
    email: string,
    password: string,
    register?: { firstName: string; lastName: string },
  ) => {
    if (register) await api.register({ ...register, email, password });
    authStore.token = await api.login(email, password);
    setAuthed(true);
  };

  const onLogout = () => {
    authStore.token = null;
    setAuthed(false);
  };

  return { isAuthed, onLogin, onLogout };
};
