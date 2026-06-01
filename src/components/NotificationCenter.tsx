import { Bell, CheckCircle, Info, XCircle } from "lucide-react";
import type { Notification } from "../types/domain";

type Props = { notifications: Notification[]; onMarkAllRead: () => void };
const icon = {
  success: CheckCircle,
  info: Info,
  warning: Bell,
  error: XCircle,
};

export function NotificationCenter({ notifications, onMarkAllRead }: Props) {
  const unread = notifications.filter((n) => !n.read).length;
  return (
    <details className="notifications">
      <summary>
        <Bell size={18} />
        {unread > 0 && <span>{unread}</span>}
      </summary>
      <div className="notification-popover">
        <div className="notification-head">
          <b>Powiadomienia</b>
          <button onClick={onMarkAllRead}>Oznacz jako przeczytane</button>
        </div>
        {notifications.length === 0 ? (
          <p>Brak powiadomień.</p>
        ) : (
          notifications.map((n) => {
            const Icon = icon[n.type];
            return (
              <article key={n.id} className={n.read ? "read" : ""}>
                <Icon size={18} />
                <div>
                  <strong>{n.title}</strong>
                  <p>{n.message}</p>
                  <small>{new Date(n.createdAt).toLocaleString("pl-PL")}</small>
                </div>
              </article>
            );
          })
        )}
      </div>
    </details>
  );
}
