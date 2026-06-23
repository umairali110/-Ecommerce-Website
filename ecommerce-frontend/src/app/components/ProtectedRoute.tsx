"use client";

import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!token && !storedToken) {
      router.push("/login");
    }
    setReady(true);
  }, [token, router]);

  const effectiveToken =
    token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);

  if (!ready || !effectiveToken) {
    return <h2>Checking auth...</h2>;
  }

  return <>{children}</>;
}