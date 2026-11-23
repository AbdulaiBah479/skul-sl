"use client";
import { useEffect, useState } from "react";
import Icon from "./Icon";

// Two small, dismissible helpers: an "offline" notice, and an "install the app" button where the browser supports it.
interface InstallEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function StatusBanners() {
  const [online, setOnline] = useState(true);
  const [install, setInstall] = useState<InstallEvent | null>(null);

  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    let dismissed = false;
    try { dismissed = localStorage.getItem("skul-install-dismissed") === "1"; } catch {}
    const onPrompt = (e: Event) => {
      e.preventDefault();
      if (!dismissed) setInstall(e as InstallEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    const onInstalled = () => setInstall(null);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  return (
    <>
      {!online && (
        <div role="status" className="no-print fixed inset-x-0 top-[3.7rem] z-20 mx-auto flex max-w-3xl items-center gap-2 bg-warn px-4 py-2 text-sm font-semibold text-bg">
          <Icon name="offline" size={18} /> You are offline. Lessons you opened before still work.
        </div>
      )}
      {install && (
        <div className="no-print fixed inset-x-3 bottom-[4.6rem] z-30 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-line bg-card p-3 shadow-[var(--shadow-lift)] sm:bottom-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand text-brand-ink"><Icon name="download" /></span>
          <p className="min-w-0 flex-1 text-sm"><strong>Install Skul SL</strong><br /><span className="text-muted">Open it like an app, even offline.</span></p>
          <button className="btn !min-h-10 !px-3 text-sm" onClick={async () => { await install.prompt(); setInstall(null); }}>Install</button>
          <button
            className="grid h-10 w-10 place-items-center rounded-xl text-muted"
            aria-label="Not now"
            onClick={() => { setInstall(null); try { localStorage.setItem("skul-install-dismissed", "1"); } catch {} }}
          >
            <Icon name="close" size={18} />
          </button>
        </div>
      )}
    </>
  );
}
