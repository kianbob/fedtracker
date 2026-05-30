import { Metadata } from "next"
import Breadcrumb from "@/components/Breadcrumb"
import VendorsClient from "./VendorsClient"
import fs from 'fs'
import path from 'path'

export const metadata: Metadata = {
  title: "Federal Contractors Hit by DOGE Cuts",
  description: "Complete directory of federal contractors affected by DOGE efficiency initiatives. See contract terminations, savings claimed, and agencies involved.",
  alternates: { canonical: "https://openfeds.com/doge/vendors" },
  openGraph: {
    title: "Federal Contractors Hit by DOGE",
    description: "Complete directory of federal contractors affected by DOGE efficiency initiatives.",
    type: "website",
  },
}

export default function VendorsPage() {
  const data = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'vendor-index.json'), 'utf-8')
  )

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "DOGE", href: "/doge" },
    { label: "Vendors", href: "/doge/vendors" }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="mt-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif mb-4">
              Federal Contractors Hit by DOGE
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive analysis of federal contractors affected by Department of Government Efficiency reforms. 
              Track contract terminations, claimed savings, and agency involvement.
            </p>
          </div>

          <VendorsClient data={data} />
        </div>
      </div>
    </div>
  )
}