import { Attempt } from "../types";

const KEY = "svt_noyau_app_v1";

type Store = {
  teacher: { pin: string };
  attempts: Attempt[];
};

function defaultStore(): Store {
  return { teacher: { pin: "1234" }, attempts: [] };
}

export function loadStore(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultStore();
    const parsed = JSON.parse(raw) as Store;
    if (!parsed?.teacher?.pin) return defaultStore();
    if (!Array.isArray(parsed.attempts)) return defaultStore();
    return parsed;
  } catch {
    return defaultStore();
  }
}

export function saveStore(store: Store) {
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function getTeacherPin(): string {
  return loadStore().teacher.pin;
}

export function setTeacherPin(pin: string) {
  const s = loadStore();
  s.teacher.pin = pin;
  saveStore(s);
}

export function addAttempt(a: Attempt) {
  const s = loadStore();
  s.attempts.unshift(a);
  saveStore(s);
}

export function updateAttempt(a: Attempt) {
  const s = loadStore();
  const idx = s.attempts.findIndex(x => x.id === a.id);
  if (idx >= 0) s.attempts[idx] = a;
  else s.attempts.unshift(a);
  saveStore(s);
}

export function listAttempts(): Attempt[] {
  return loadStore().attempts;
}

export function clearAttempts() {
  const s = loadStore();
  s.attempts = [];
  saveStore(s);
}
