"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [fcmStatus, setFcmStatus] = useState<string>("Initializing FCM...");
  const [fcmTokens, setFcmTokens] = useState<{capacitor?: string, firebase?: string}>({});
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // Register FCM tokens after component mounts
    const registerFCM = async () => {
      try {
        console.log("📱 Starting FCM registration...");

        // Check if we're in Capacitor environment
        if (typeof window === 'undefined' || !(window as any).Capacitor) {
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
        setFcmStatus("❌ FCM setup failed: " + (error as Error).message);
      }
    };

    registerFCM();
  }, []);

  // Track scroll position for demo
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate demo content for scrolling
  const generateItems = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
      <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {i + 1}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Item #{i + 1}</h3>
              <p className="text-gray-600 text-sm">This is a demo item to test smooth scrolling</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">₹{(i + 1) * 100}</div>
            <div className="text-xs text-gray-500">In Stock</div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Category A</span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">New</span>
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Popular</span>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Best Bazaar</h1>
            <div className="text-sm text-gray-600">
              Scroll: {Math.round(scrollPosition)}px
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            🚀 Optimized for smooth scrolling on Android
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="pt-20 pb-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Welcome to Best Bazaar</h2>
            <p className="text-blue-100 mb-4">
              Experience smooth, native-like scrolling on your Android device!
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">⚡</div>
                <div className="text-sm">Fast</div>
              </div>
              <div>
                <div className="text-2xl font-bold">📱</div>
                <div className="text-sm">Native</div>
              </div>
              <div>
                <div className="text-2xl font-bold">🎯</div>
                <div className="text-sm">Smooth</div>
              </div>
            </div>
          </div>

          {/* FCM Status Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
            <div className="text-lg font-semibold mb-3 text-gray-900">📱 FCM Status</div>
            <div className="text-sm text-gray-700 mb-3">{fcmStatus}</div>

            {fcmTokens.capacitor && (
              <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-200">
                <div className="font-medium text-blue-900 text-sm">Capacitor Token:</div>
                <div className="text-blue-800 text-xs font-mono break-all mt-1">{fcmTokens.capacitor}</div>
              </div>
            )}

            {fcmTokens.firebase && (
              <div className="mb-3 p-3 bg-green-50 rounded border border-green-200">
                <div className="font-medium text-green-900 text-sm">Firebase Token:</div>
                <div className="text-green-800 text-xs font-mono break-all mt-1">{fcmTokens.firebase}</div>
              </div>
            )}

            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              <div className="font-medium mb-1">📋 Check Android Logcat for:</div>
              <ul className="text-left space-y-1">
                <li>• 📱 Starting FCM registration...</li>
                <li>• 📱 ===== CAPACITOR FCM TOKEN =====</li>
                <li>• 📱 ===== FIREBASE FCM TOKEN =====</li>
              </ul>
            </div>
          </div>

          {/* Scroll Performance Demo */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">⚡ Scroll Performance Demo</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div>• <strong>GPU Acceleration:</strong> All elements use hardware acceleration</div>
              <div>• <strong>Passive Listeners:</strong> No scroll-blocking JavaScript</div>
              <div>• <strong>Throttled Events:</strong> Scroll handlers optimized for 60fps</div>
              <div>• <strong>Effect Disabling:</strong> Heavy effects disabled during scroll</div>
              <div>• <strong>Touch Optimization:</strong> Native momentum scrolling enabled</div>
            </div>
          </div>

          {/* Demo Items List */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">🛒 Demo Products</h3>
            <div className="space-y-4">
              {generateItems(50)}
            </div>
          </div>

          {/* Nested Scroll Container Demo */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">📜 Nested Scroll Demo</h3>
            <div className="h-64 overflow-y-auto border border-gray-100 rounded p-3 bg-gray-50">
              <div className="space-y-3">
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={i} className="bg-white p-3 rounded border">
                    <div className="font-medium">Nested Item {i + 1}</div>
                    <div className="text-sm text-gray-600">This container has its own scrolling</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-2 text-yellow-800">💡 Performance Tips</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Use <code className="bg-yellow-100 px-1 rounded">transform: translate3d()</code> for animations</li>
              <li>• Add <code className="bg-yellow-100 px-1 rounded">passive: true</code> to scroll listeners</li>
              <li>• Avoid <code className="bg-yellow-100 px-1 rounded">position: fixed</code> inside scrollable areas</li>
              <li>• Use <code className="bg-yellow-100 px-1 rounded">will-change</code> sparingly</li>
              <li>• Test on real devices, not just emulators</li>
            </ul>
          </div>

          {/* Footer */}
          <div className="text-center py-8 text-gray-500">
            <div className="text-lg font-semibold mb-2">🎉 End of Content</div>
            <div className="text-sm">
              If you can scroll smoothly to here, the optimizations are working!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
