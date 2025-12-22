"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [fcmStatus, setFcmStatus] = useState("Initializing FCM...");
  const [fcmTokens, setFcmTokens] = useState({});

  useEffect(() => {
    // Register FCM tokens after component mounts
    const registerFCM = async () => {
      try {
        console.log("📱 Starting FCM registration...");

        // Check if we're in Capacitor environment
        if (typeof window === 'undefined' || !window.Capacitor) {
          console.log("📱 Not in Capacitor environment");
          setFcmStatus("Not in Capacitor environment");
          return;
        }

        console.log("📱 Capacitor environment detected");

        // Delay to ensure app is fully loaded
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log("📱 Delay completed, loading FCM modules...");

        // Dynamically import FCM modules
        const { PushNotifications } = await import("@capacitor/push-notifications");
        const { getMessaging, getToken } = await import("firebase/messaging");
        const { VAPID_KEY } = await import("./firebase");

        console.log("📱 FCM modules loaded successfully");

        // Request permissions
        const permResult = await PushNotifications.requestPermissions();
        console.log("📱 Permission result:", permResult);

        if (permResult.receive !== "granted") {
          console.log("📱 Permission denied");
          setFcmStatus("Permission denied - please allow notifications");
          return;
        }

        console.log("📱 Permission granted, registering for push notifications...");
        setFcmStatus("Registering for push notifications...");

        // Register for push notifications
        await PushNotifications.register();
        console.log("📱 Push notifications registered");

        // Set up listeners
        PushNotifications.addListener("registration", async (token) => {
          console.log("📱 ===== CAPACITOR FCM TOKEN RECEIVED =====");
          console.log("📱 Capacitor Token:", token.value);

          setFcmTokens(prev => ({ ...prev, capacitor: token.value }));
          setFcmStatus("Capacitor token received, getting Firebase token...");

          try {
            // Get Firebase token
            const messaging = getMessaging();
            console.log("📱 Getting Firebase token...");

            const firebaseToken = await getToken(messaging, {
              vapidKey: VAPID_KEY
            });

            if (firebaseToken) {
              console.log("📱 ===== FIREBASE FCM TOKEN RECEIVED =====");
              console.log("📱 Firebase Token:", firebaseToken);

              setFcmTokens(prev => ({ ...prev, firebase: firebaseToken }));
              setFcmStatus("✅ FCM tokens successfully obtained!");
            } else {
              console.log("📱 Firebase token was null");
              setFcmStatus("Capacitor token received, Firebase token failed");
            }
          } catch (firebaseError) {
            console.error("📱 Firebase token error:", firebaseError);
            setFcmStatus("Capacitor token received, Firebase token error");
          }
        });

        PushNotifications.addListener("registrationError", (error) => {
          console.error("📱 Registration error:", error);
          setFcmStatus("❌ FCM registration failed: " + JSON.stringify(error));
        });

        console.log("📱 FCM setup completed");

      } catch (error) {
        console.error("📱 FCM setup error:", error);
        setFcmStatus("❌ FCM setup failed: " + error.message);
      }
    };

    registerFCM();
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-white flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Best Bazaar</h1>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="text-green-800 font-medium">✅ Application Running Successfully!</div>
          <div className="text-green-600 text-sm mt-1">No auto-stopping</div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="text-blue-800 font-medium mb-2">📱 FCM Status</div>
          <div className="text-blue-600 text-sm">{fcmStatus}</div>

          {fcmTokens.capacitor && (
            <div className="mt-3 p-2 bg-blue-100 rounded text-xs">
              <div className="font-medium text-blue-800">Capacitor Token:</div>
              <div className="text-blue-600 break-all">{fcmTokens.capacitor}</div>
            </div>
          )}

          {fcmTokens.firebase && (
            <div className="mt-2 p-2 bg-green-100 rounded text-xs">
              <div className="font-medium text-green-800">Firebase Token:</div>
              <div className="text-green-600 break-all">{fcmTokens.firebase}</div>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <p className="font-medium mb-1">📋 Check Android Studio Logcat for:</p>
          <ul className="text-left space-y-1">
            <li>• 📱 Starting FCM registration...</li>
            <li>• 📱 ===== CAPACITOR FCM TOKEN =====</li>
            <li>• 📱 ===== FIREBASE FCM TOKEN =====</li>
          </ul>
        </div>
      </div>
    </div>
  );
}