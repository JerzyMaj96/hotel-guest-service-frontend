import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Auth } from "./features/Auth";
import { IssueForm } from "./features/IssueForm";
import { IssueList } from "./pages/IssueList";
import { IssueDetailsPage } from "./pages/IssueDetailsPage";
import { Layout } from "./components/Layout";
import { useAuth } from "./hooks/useAuth";
import { useIssues } from "./hooks/useIssues";
import { useNotifications } from "./hooks/useNotifications";
import type { Issue } from "./types/domain";
import "./styles.css";

export default function App() {
  const { isAuthed, role, onLogin, onLogout } = useAuth();
  const { notifications, notify, markAllRead } = useNotifications();
  const {
    issues,
    onCreated: issueCreated,
    onStatusChange: issueStatusChanged,
  } = useIssues(isAuthed, role);
  const navigate = useNavigate();

  const handleLogin = async (
    email: string,
    password: string,
    register?: { firstName: string; lastName: string },
  ) => {
    await onLogin(email, password, register);
    notify({
      type: "success",
      title: "Zalogowano",
      message: "Sesja użytkownika została rozpoczęta.",
    });
  };

  const onCreated = (issue: Issue) => {
    issueCreated(issue);
    notify({
      type: "success",
      title: "Zgłoszenie zostało wysłane",
      message: `Twoje zgłoszenie nr ${issue.id} zostało zapisane.`,
      issueId: issue.id,
    });
    navigate(`/issues/${issue.id}`);
  };

  const onStatusChange = (issue: Issue) => {
    issueStatusChanged(issue);
    notify({
      type: issue.status === "CLOSED" ? "success" : "info",
      title: "Status zgłoszenia został zmieniony",
      message: `Zgłoszenie nr ${issue.id}: ${issue.status}.`,
      issueId: issue.id,
    });
  };

  if (!isAuthed) return <Auth onLogin={handleLogin} />;
  const staff = role !== "GUEST";

  return (
    <Layout
      role={role}
      technical={staff}
      onLogout={onLogout}
      notifications={notifications}
      onMarkAllRead={markAllRead}
    >
      <Routes>
        <Route
          path="/"
          element={
            <IssueList
              issues={issues}
              role={role}
              onSelect={(i) => navigate(`/issues/${i.id}`)}
              onNew={() => navigate("/new")}
            />
          }
        />
        <Route
          path="/new"
          element={
            role === "GUEST" ? (
              <IssueForm onCreated={onCreated} onCancel={() => navigate("/")} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/issues/:id"
          element={
            <IssueDetailsPage
              issues={issues}
              staff={staff}
              onBack={() => navigate("/")}
              onStatusChange={onStatusChange}
            />
          }
        />
      </Routes>
    </Layout>
  );
}
