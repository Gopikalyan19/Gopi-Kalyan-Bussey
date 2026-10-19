"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import MenuOverlay from "./MenuOverlay";
import Toast from "./Toast";

type Dialog = { kind: "menu" };

type UIContextValue = {
  menuOpen: boolean;
  openMenu: () => void;
  close: (restoreFocus?: boolean) => void;
  showToast: (msg: string) => void;
  copyText: (text: string) => Promise<void>;
};

const UIContext = createContext<UIContextValue | null>(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}

export default function UIProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [toast, setToast] = useState({ msg: "", visible: false });
  const lastFocus = useRef<HTMLElement | null>(null);
  const restore = useRef(true);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const open = useCallback((d: Dialog) => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    restore.current = true;
    setDialog(d);
  }, []);

  const close = useCallback((restoreFocus = true) => {
    restore.current = restoreFocus;
    setDialog(null);
  }, []);

  // Lock page scroll while a dialog is open; return focus to the trigger afterwards.
  useEffect(() => {
    if (dialog) {
      document.documentElement.style.overflow = "hidden";
      return;
    }
    document.documentElement.style.overflow = "";
    if (restore.current && lastFocus.current?.isConnected) lastFocus.current.focus({ preventScroll: true });
    lastFocus.current = null;
  }, [dialog]);

  const showToast = useCallback((msg: string) => {
    setToast({ msg, visible: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  }, []);

  const copyText = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const t = document.createElement("textarea");
        t.value = text;
        t.style.position = "fixed";
        t.style.opacity = "0";
        document.body.appendChild(t);
        t.select();
        document.execCommand("copy");
        t.remove();
      }
      showToast("Email copied: " + text);
    },
    [showToast],
  );

  const value = useMemo<UIContextValue>(
    () => ({
      menuOpen: dialog?.kind === "menu",
      openMenu: () => open({ kind: "menu" }),
      close,
      showToast,
      copyText,
    }),
    [dialog, open, close, showToast, copyText],
  );

  return (
    <UIContext.Provider value={value}>
      {children}
      {dialog?.kind === "menu" && <MenuOverlay />}
      <Toast message={toast.msg} visible={toast.visible} />
    </UIContext.Provider>
  );
}
