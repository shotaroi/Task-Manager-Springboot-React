import type { TaskStatus } from "./api/tasks";

export type StatusFilter = TaskStatus | "ALL";
export type SortOrder = "NONE" | "DUE_ASC" | "DUE_DESC";