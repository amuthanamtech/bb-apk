"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

type NetStatus = "checking" | "online" | "offline";

export default function Home() {
  const [status, setStatus] = useState<NetStatus>("checking");
  const checkingRef = useRef(false);

  const siteUrl = useMemo(() => "https://bestbazaar.in/", []);

  // More reliable reachability probe using fetch with no-cors + timeout.
  const probe = () =>
    new Promise<boolean>((resolve) => {
      const controller = new AbortController();
      const timer = setTimeout(() => {
        controller.abort();
        resolve(false);
      }, 4000);
      // Any resolved response (opaque allowed) indicates the host is reachable
      fetch("https://bestbazaar.in/", {
        method: "GET",
        mode: "no-cors",
        cache: "no-store",
        signal: controller.signal,
      })
        .then(() => {
          clearTimeout(timer);
          resolve(true);
        })
        .catch(() => {
          clearTimeout(timer);
          resolve(false);
        });
    });

  const checkConnectivity = async () => {
    if (checkingRef.current) return;
    checkingRef.current = true;
    try {
      // First, use navigator.onLine as a quick hint, then verify with probe
      const hint = typeof navigator !== "undefined" && (navigator as any).onLine !== undefined
        ? navigator.onLine
        : true;
      if (!hint) {
        setStatus("offline");
        return;
      }
      const ok = await probe();
      setStatus(ok ? "online" : "offline");
    } finally {
      checkingRef.current = false;
    }
  };

  useEffect(() => {
    // Initial check
    checkConnectivity();
    // Listen to browser online/offline and re-check
    const toOnline = () => checkConnectivity();
    const toOffline = () => setStatus("offline");
    window.addEventListener("online", toOnline);
    window.addEventListener("offline", toOffline);
    return () => {
      window.removeEventListener("online", toOnline);
      window.removeEventListener("offline", toOffline);
    };
  }, []);

  // Periodic auto-retry while offline
  useEffect(() => {
    if (status !== "offline") return;
    const id = setInterval(() => {
      checkConnectivity();
    }, 10000);
    return () => clearInterval(id);
  }, [status]);

  const handleRetry = () => {
    setStatus("checking");
    checkConnectivity();
  };

  const OfflineScreen = (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center py-12 gap-6 px-4 text-center">
        <div className="text-2xl font-semibold">
          {"You're offline"}
        </div>
        <p className="text-gray-600 max-w-sm">
          Please check your internet connection. We’ll load the latest content when you’re back online.
        </p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 rounded-md bg-black text-white hover:opacity-90"
        >
          Retry
        </button>
      </div>
      <Footer />
    </>
  );

  if (status === "checking") {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="animate-pulse text-gray-700">Loading…</div>
      </div>
    );
  }
  if (status !== "online") return OfflineScreen;

  // Only render the iframe once we have confirmed reachability to avoid native error page.
  return (
    <div className="fixed inset-0 w-full h-full">
      <iframe
        title="Best Bazaar"
        src={siteUrl}
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}