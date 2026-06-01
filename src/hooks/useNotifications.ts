import { useState } from "react";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    JSON.parse(localStorage.getItem("hgss.notifications") ?? "[]"),
  );

  const persistNotifications = (items: Notification[]) => {
    setNotifications(items);
    localStorage.setItem("hgss.notifications", JSON.stringify(items));
  };

  const notify = (n: Omit<Notification, "id" | "createdAt" | "read">) =>
    persistNotifications(
      [
        {
          ...n,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...notifications,
      ].slice(0, 12),
    );

    return { notifications, notify };
};
