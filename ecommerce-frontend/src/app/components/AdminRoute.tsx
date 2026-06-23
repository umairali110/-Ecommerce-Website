"use client";

import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token && !storedToken) {
      router.push("/login");
      return;
    }

    let effectiveUser = user;
    if (!effectiveUser && storedUser) {
      try {
        effectiveUser = JSON.parse(storedUser);
      } catch {
        router.push("/login");
        return;
      }
    }

    if (!effectiveUser || effectiveUser.role !== "admin") {
      router.push("/");
      return;
    }

    setAuthorized(true);
  }, [user, token, router]);

  if (!authorized) {
    return <h2>Checking auth...</h2>;
  }

  return <>{children}</>;
}