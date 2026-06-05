"use client";

import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import AppView from "@/components/AppView";

export default function Home() {
  const [showApp, setShowApp] = useState(false);

  return (
    <>
      {!showApp ? (
        <LandingPage onGoToApp={() => setShowApp(true)} />
      ) : (
        <AppView onBack={() => setShowApp(false)} />
      )}
    </>
  );
}
