export type IssueType = "TECHNICAL" | "RECEPTION";
export type IssueStatus = "NEW" | "OPEN" | "CLOSED";
export type PreferredTimeOption =
  | "AS_SOON_AS_POSSIBLE"
  | "WHEN_NOT_IN_ROOM"
  | "NO_URGENCY";
export type AppRole = "GUEST" | "TECHNICIAN" | "RECEPTIONIST" | "MANAGER";

export interface Issue {
  id: number;
  type: IssueType;
  title: string;
  photoUrl?: string | null;
  status: IssueStatus;
  creationDate: string;
  roomNumber: number;
  description?: string;
  preferredTimeOption?: PreferredTimeOption;
  preferredDate?: string;
  preferredTime?: string;
}

export interface IssueCreateRequest {
  type: IssueType;
  title: string;
  description: string;
  roomNumber: number;
  photoPath?: string;
  preferredTimeOption: PreferredTimeOption;
  preferredDate?: string;
  preferredTime?: string;
}

export interface Notification {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
  issueId?: number;
  createdAt: string;
  read: boolean;
}
