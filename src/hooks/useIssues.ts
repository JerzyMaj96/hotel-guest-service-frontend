import { useEffect, useState } from "react";
import { AppRole, Issue } from "../types/domain";
import { api } from "../api/client";

export const useIssues = (isAuthed: boolean, role: AppRole) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const load = async () => {
    if (!isAuthed) return;
    try {
      setIssues(
        role === "GUEST" ? await api.userIssues() : await api.techIssues(),
      );
    } catch (error) {
      setError(error as Error);
    }
  };

  useEffect(() => {
    load();
  }, [isAuthed, role]);

  const onCreated = (issue: Issue) => {
    setIssues((prev) => [issue, ...prev]);
  };

  const onStatusChange = (issue: Issue) => {
    setIssues((prev) => prev.map((i) => (i.id === issue.id ? issue : i)));
  };

  return { issues, onCreated, onStatusChange, error };
};
