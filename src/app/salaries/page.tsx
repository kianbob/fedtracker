import { SalariesClient } from "./SalariesClient";
import salaryStats from "../../../public/data/salary-stats.json";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Federal Employee Salaries by Agency & Grade",
  description: "Federal salary data for 2M+ employees. See pay by GS grade, agency & occupation. Average salary: $106K across 128 agencies.",
  openGraph: {
    title: "Federal Salary Data - OpenFeds",
    description: "Pay distribution, highest-paid agencies and occupations, and GS grade breakdowns for federal employees.",
  },
  alternates: { canonical: "/salaries" },
};


const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the average federal government salary?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The average federal salary is approximately $106,000 per year across 2M+ employees. However, pay varies widely by GS grade, agency, and location."
      }
    },
    {
      "@type": "Question",
      "name": "Which federal agency pays the highest salaries?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Securities and Exchange Commission (SEC) and Federal Reserve agencies typically have the highest average salaries, often exceeding $190,000."
      }
    },
    {
      "@type": "Question",
      "name": "How does the GS pay scale work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The General Schedule (GS) has 15 grades with 10 steps each. GS-1 starts around $24,000 while GS-15 step 10 can exceed $191,000 with locality pay adjustments."
      }
    },
    {
      "@type": "Question",
      "name": "Are federal employees overpaid compared to the private sector?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It depends on the role. Federal workers in administrative and support roles earn 30-57% more than private sector equivalents, while STEM and tech roles pay 18-30% less than industry."
      }
    }
  ]
};
export default function SalariesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <SalariesClient data={salaryStats} />
    </>);
}
