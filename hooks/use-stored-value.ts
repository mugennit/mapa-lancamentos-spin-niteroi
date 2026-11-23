"use client";
import { useCallback, useSyncExternalStore } from "react";

// Valor guardado no navegador (localStorage), lido sem setState em efeito.
// Se o navegador bloquear o armazenamento, o valor vale só nesta sessão.
const memory = new Map<string, string>();
const listeners = new Set<() => void>();

function read(key: string): string | null {
  if (memory.has(key)) return memory.get(key)!;
  try { return window.localStorage.getItem(key); } catch { return null; }
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  window.addEventListener("storage", notify);
  return () => { listeners.delete(notify); window.removeEventListener("storage", notify); };
}

/** Retorna o valor atual e uma função de gravação, que informa se persistiu no navegador. */
export function useStoredValue(key: string): [string | null, (value: string) => boolean] {
  const value = useSyncExternalStore(subscribe, () => read(key), () => null);
  const write = useCallback((next: string) => {
    memory.set(key, next);
    let persisted = true;
    try { window.localStorage.setItem(key, next); } catch { persisted = false; }
    listeners.forEach((notify) => notify());
    return persisted;
  }, [key]);
  return [value, write];
}
