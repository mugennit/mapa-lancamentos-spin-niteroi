"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";

/**
 * Faz o botão "voltar" do celular fechar um painel aberto, em vez de sair do
 * site. Ao abrir, empilha uma entrada no histórico (mesmo endereço); ao voltar,
 * fecha o painel. Se o painel for fechado pela interface, remove a entrada.
 */
export function useBackToClose(open: boolean, close: () => void, key: string) {
  const pushed = useRef(false);
  const closeRef = useRef(close);
  useEffect(() => { closeRef.current = close; }, [close]);

  useEffect(() => {
    if (open && !pushed.current) {
      window.history.pushState({ ...(window.history.state || {}), spinOverlay: key }, "", window.location.href);
      pushed.current = true;
    } else if (!open && pushed.current) {
      pushed.current = false;
      if (window.history.state?.spinOverlay === key) window.history.back();
    }
  }, [open, key]);

  useEffect(() => {
    const onPop = () => {
      if (pushed.current && window.history.state?.spinOverlay !== key) {
        pushed.current = false;
        closeRef.current();
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [key]);
}

/** Consulta de mídia reativa; no servidor assume `false`. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (notify) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", notify);
      return () => list.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
