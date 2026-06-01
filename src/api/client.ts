import type { Issue, IssueCreateRequest, IssueStatus } from "../types/domain";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
const TOKEN_KEY = "hgss.jwt";

export const authStore = {
  get token() {
    return sessionStorage.getItem(TOKEN_KEY);
  },
  set token(value: string | null) {
    value
      ? sessionStorage.setItem(TOKEN_KEY, value)
      : sessionStorage.removeItem(TOKEN_KEY);
  },
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && !(init.body instanceof FormData))
    headers.set("Content-Type", "application/json");
  if (authStore.token)
    headers.set("Authorization", `Bearer ${authStore.token}`);
  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!response.ok)
    throw new Error((await response.text()) || `HTTP ${response.status}`);
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}

export const api = {
  login: (email: string, password: string) =>
    request<string>("/hgss/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) =>
    request("/hgss/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  userIssues: () => request<Issue[]>("/hgss/api/issues/user-prof"),
  techIssues: () => request<Issue[]>("/hgss/api/issues/tech-prof"),
  createIssue: (issue: IssueCreateRequest, photo?: File | null) => {
    const form = new FormData();
    form.append(
      "issue",
      new Blob([JSON.stringify(issue)], { type: "application/json" }),
    );
    if (photo) form.append("photo", photo);
    return request<Issue>("/hgss/api/issues", { method: "POST", body: form });
  },
  updateStatus: (issueId: number, issueStatus: IssueStatus) =>
    request<void>(
      `/hgss/api/issues/${issueId}/status?issueStatus=${issueStatus}`,
      { method: "PATCH" },
    ),
};
