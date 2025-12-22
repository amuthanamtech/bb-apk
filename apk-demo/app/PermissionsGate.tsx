"use client";
import { useEffect, useState } from "react";
import { Camera } from "@capacitor/camera";
import { Geolocation } from "@capacitor/geolocation";
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

  const registerFCMToken = async () => {
    // Completely isolate FCM registration to prevent app crashes
    try {
      console.log("📱 [SAFE] Starting isolated FCM registration...");

      // Only run in Capacitor environment
      if (typeof window === 'undefined' || !(window as any).Capacitor) {
        console.log("📱 [SAFE] Not in Capacitor, skipping FCM");
        return;
      }

      // Delay execution to ensure app is fully loaded
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log("📱 [SAFE] Capacitor detected, initializing FCM...");

      // Import and initialize Firebase safely
      try {
        const { PushNotifications } = await import("@capacitor/push-notifications");
        const { getMessaging, getToken } = await import("firebase/messaging");
        const { VAPID_KEY } = await import("./firebase");

        console.log("📱 [SAFE] Firebase modules loaded");

        // Request permissions
        const permResult = await PushNotifications.requestPermissions();
        console.log("📱 [SAFE] Permission result:", permResult);

        if (permResult.receive !== "granted") {
          console.log("📱 [SAFE] Permission denied, skipping FCM");
          return;
        }

        console.log("📱 [SAFE] Permission granted, registering...");

        // Register for notifications
        await PushNotifications.register();
        console.log("📱 [SAFE] Push notifications registered");

        // Set up listeners
        PushNotifications.addListener("registration", async (token) => {
          try {
            console.log("📱 ===== CAPACITOR FCM TOKEN =====");
            console.log("📱 Mobile FCM Token:", token.value);

            // Get Firebase token
            const messaging = getMessaging();
            const firebaseToken = await getToken(messaging, {
              vapidKey: VAPID_KEY
            });

            if (firebaseToken) {
              console.log("📱 ===== FIREBASE FCM TOKEN =====");
              console.log("📱 Firebase FCM Token:", firebaseToken);
              console.log("📱 ===== TOKENS SUCCESSFULLY OBTAINED =====");
            } else {
              console.log("📱 [SAFE] Firebase token was null");
            }
          } catch (innerError) {
            console.error("📱 [SAFE] Error in token processing:", innerError);
          }
        });

        PushNotifications.addListener("registrationError", (error) => {
          console.error("📱 [SAFE] Registration error:", error);
        });

        console.log("📱 [SAFE] FCM setup completed successfully");

        // Update global FCM status
        if (typeof window !== 'undefined') {
          (window as any).updateFcmStatus = (status: string) => {
            console.log("📱 FCM Status Update:", status);
          };
        }

      } catch (importError) {
        console.error("📱 [SAFE] Error importing Firebase modules:", importError);
        // Update status on error
        if (typeof window !== 'undefined') {
          (window as any).updateFcmStatus?.("❌ FCM Import Failed");
        }
      }

    } catch (outerError) {
      console.error("📱 [SAFE] FCM registration failed:", outerError);
    }
  };

  const requestAll = async () => {
    setError("");
    setStep("requesting");
    try {
      // Camera
      try { await Camera.requestPermissions(); } catch (_) {}
      // Location
      try { await Geolocation.requestPermissions(); } catch (_) {}
      // Filesystem/Media (where applicable)
      try {
        // Filesystem has requestPermissions on Android; ignore if not supported
        // @ts-ignore
        if (Filesystem.requestPermissions) {
          // @ts-ignore
          await Filesystem.requestPermissions();
        }
      } catch (_) {}
      // Register FCM token (with delay to prevent startup crashes)
      setTimeout(async () => {
        try {
          await registerFCMToken();
        } catch (error) {
          console.error("📱 FCM registration failed:", error);
        }
      }, 1000);
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
