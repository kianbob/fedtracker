import SalaryCompare from "@/components/SalaryCompare";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Your Salary to Federal Employees",
  description: "Compare your salary to federal employees by agency, occupation, and GS grade. See where you stand against 2.07 million federal workers.",
  alternates: { canonical: "/salary-compare" },
};


const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I compare my salary to federal employees?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Enter your annual salary in our comparison tool to see how you rank against 2.07 million federal workers by percentile, agency, and occupation."
      }
    },
    {
      "@type": "Question",
      "name": "What is the median federal employee salary?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The median federal salary is approximately $95,000, meaning half of all federal employees earn more and half earn less. This varies significantly by location and grade."
      }
    },
    {
      "@type": "Question",
      "name": "Do federal employees get paid more than private sector?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "On average, federal employees earn comparable or slightly higher base pay for similar roles, plus benefits worth 30-40% of salary including FERS pension, TSP matching, and FEHB health insurance."
      }
    }
  ]
};
export default function SalaryComparePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <SalaryCompare />
    </>);
}
