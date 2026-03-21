import { Metadata } from "next"
import Breadcrumb from "@/components/Breadcrumb"
import PaymentsClient from "./PaymentsClient"
import fs from 'fs'
import path from 'path'

export const metadata: Metadata = {
  title: "Federal Payments Under Review by DOGE | OpenFeds",
  description: "$9.2 billion in federal payments under DOGE review. Analyze payment patterns, agency spending, keyword analysis, and flagged transactions.",
  alternates: { canonical: "https://openfeds.com/doge/payments" },
  openGraph: {
    title: "$9.2 Billion in Federal Payments Under Review",
    description: "Comprehensive analysis of federal payments under DOGE review. Track spending patterns and efficiency improvements.",
    type: "website",
  },
}

export default function PaymentsPage() {
  const data = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'doge-payments-analytics.json'), 'utf-8')
  )

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "DOGE", href: "/doge" },
    { label: "Payments", href: "/doge/payments" }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="mt-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif mb-4">
              $9.2 Billion in Federal Payments Under Review
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive analysis of federal payments identified for Department of Government Efficiency review. 
              Track spending patterns, agency breakdowns, and efficiency opportunities across 107,497 transactions.
            </p>
          </div>

          <PaymentsClient data={data} />
        </div>
      </div>
    </div>
  )
}