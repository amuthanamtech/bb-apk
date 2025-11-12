"use client";
import { useEffect, useState } from "react";
import { Camera } from "@capacitor/camera";
import { Geolocation } from "@capacitor/geolocation";
import { PushNotifications } from "@capacitor/push-notifications";
import { Filesystem } from "@capacitor/filesystem";

type Step = "idle" | "prompt" | "requesting" | "done" | "denied";

export default function PermissionsGate() {
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    try {
      const checked = typeof window !== "undefined" && localStorage.getItem("permChecked");
      if (!checked) setStep("prompt");
    } catch (_) {
      // ignore
    }
  }, []);

  const markDone = () => {
    try {
      localStorage.setItem("permChecked", "1");
    } catch (_) {}
    setStep("done");
  };

  const requestAll = async () => {
    setError("");
    setStep("requesting");
    try {
      // Camera
      try { await Camera.requestPermissions(); } catch (_) {}
      // Location
      try { await Geolocation.requestPermissions(); } catch (_) {}
      // Notifications (Android 13+ runtime)
      try {
        const perm = await PushNotifications.checkPermissions();
        if (perm.receive !== "granted") {
          await PushNotifications.requestPermissions();
        }
      } catch (_) {}
      // Filesystem/Media (where applicable)
      try {
        // Filesystem has requestPermissions on Android; ignore if not supported
        // @ts-ignore
        if (Filesystem.requestPermissions) {
          // @ts-ignore
          await Filesystem.requestPermissions();
        }
      } catch (_) {}
      markDone();
    } catch (e: any) {
      setError(e?.message || "Permission request failed");
      setStep("denied");
    }
  };

  if (step === "idle" || step === "done") return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white w-[90%] max-w-md rounded-xl p-5 shadow-xl">
        <h2 className="text-lg font-semibold mb-2">Permissions required</h2>
        <p className="text-sm text-gray-600 mb-4">
          To give you the best experience, allow access to Camera, Location, Notifications, and Files. You can change this anytime in Settings.
        </p>
        {error ? (
          <div className="text-red-600 text-sm mb-3">{error}</div>
        ) : null}
        <div className="flex gap-3 justify-end">
          {step === "prompt" && (
            <>
              <button className="px-4 py-2 rounded-md border" onClick={markDone}>Not now</button>
              <button className="px-4 py-2 rounded-md bg-black text-white" onClick={requestAll}>Allow now</button>
            </>
          )}
          {step === "requesting" && (
            <button className="px-4 py-2 rounded-md bg-black text-white opacity-80" disabled>Requesting…</button>
          )}
          {step === "denied" && (
            <>
              <button className="px-4 py-2 rounded-md border" onClick={requestAll}>Retry</button>
              <button className="px-4 py-2 rounded-md" onClick={markDone}>Continue</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
