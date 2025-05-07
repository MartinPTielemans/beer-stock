"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the display page by default
    router.push("/display");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Beer Stock</h1>
        <p className="text-gray-600">Redirecting to price display...</p>
      </div>
    </div>
  );
}
