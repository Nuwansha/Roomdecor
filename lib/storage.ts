import { Design } from "./types";

const KEY = "room_designer_designs_v1";
const AUTH_KEY = "room_designer_auth_v1";

export function loadDesigns(): Design[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Design[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveDesigns(designs: Design[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(designs));
}

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_KEY) === "1";
}

export function setAuthed(v: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, v ? "1" : "0");
}
