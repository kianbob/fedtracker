import type { Metadata } from "next";
import { Suspense } from "react";
import { LookupClient } from "./LookupClient";

export const metadata: Metadata = {
  title: "What Happened to My Agency? — OpenFeds",
  description:
    "Look up any federal agency to see how it was affected by 2025 workforce changes. Risk scores, separations, RIFs, and more.",
};

export default function LookupPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">Loading...</div>}>
      <LookupClient />
    </Suspense>
  );
}
