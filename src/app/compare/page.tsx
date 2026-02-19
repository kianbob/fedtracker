import { Suspense } from "react";
import { CompareClient } from "./CompareClient";

export const metadata = {
  title: "Compare Federal Agencies — Side-by-Side Analysis — OpenFeds",
  description: "Compare two federal agencies side-by-side on employees, salaries, risk scores, RIF counts, and more.",
};

export default function ComparePage() {
  return (
    <Suspense>
      <CompareClient />
    </Suspense>
  );
}
