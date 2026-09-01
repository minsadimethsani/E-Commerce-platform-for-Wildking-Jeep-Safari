"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white p-4">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-emerald-300 text-sm font-semibold">Redirecting to /admin...</p>
      </div>
    </div>
  );
}
