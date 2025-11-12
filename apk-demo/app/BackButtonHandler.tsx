"use client";
import { useEffect } from "react";
import { App } from "@capacitor/app";
import type { PluginListenerHandle } from "@capacitor/core";

export default function BackButtonHandler() {
  useEffect(() => {
    let handle: PluginListenerHandle | undefined;
    App.addListener("backButton", (event: any) => {
      if (event?.canGoBack) {
        window.history.back();
      } else {
        // At the root: prevent exit (no action). Optionally: App.minimizeApp();
      }
    }).then((h) => {
      handle = h;
    });
    return () => {
      handle?.remove();
    };
  }, []);
  return null;
}
