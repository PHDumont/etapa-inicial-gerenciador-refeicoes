import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router";
import { ClerkProvider } from "@clerk/react";

const PUBLIC_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLIC_KEY) {
  throw new Error("VITE_CLERK_PUBLISHABLE_KEY is not set");
}

function RootLayout() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      publishableKey={PUBLIC_KEY}
      afterSignOutUrl="/"
    >
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </ClerkProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <RootLayout />
    </BrowserRouter>
  </StrictMode>,
);
