import type {
  IssueStatus,
  IssueType,
  PreferredTimeOption,
} from "../types/domain";
export const typeLabel: Record<IssueType, string> = {
  TECHNICAL: "Techniczne",
  RECEPTION: "Recepcja",
};
export const statusLabel: Record<IssueStatus, string> = {
  NEW: "Nowe",
  OPEN: "W trakcie",
  CLOSED: "Zrealizowane",
};
export const preferredLabel: Record<PreferredTimeOption, string> = {
  AS_SOON_AS_POSSIBLE: "Jak najszybciej",
  WHEN_NOT_IN_ROOM: "Gdy nie będzie mnie w pokoju",
  NO_URGENCY: "Tylko informacyjnie",
};
