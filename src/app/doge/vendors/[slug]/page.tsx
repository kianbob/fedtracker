import { Metadata } from "next"
import { notFound } from "next/navigation"
import Breadcrumb from "@/components/Breadcrumb"
import VendorDetailClient from "./VendorDetailClient"
import fs from 'fs'
import path from 'path'

interface VendorData {
  slug: string
  name: string
  totalValue: number
  totalSavings: number
  agencies: string[]
  contracts: Array<{
    piid: string
    agency: string
    value: number
    savings: number
    description: string
    date: string
    fpdsStatus: string
  }>
}

interface VendorIndexItem {
  slug: string
  name: string
  contractCount: number
  totalValue: number
  totalSavings: number
  agencyCount: number
  agencies: string[]
}

export async function generateStaticParams() {
  const vendorIndex: VendorIndexItem[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'vendor-index.json'), 'utf-8')
  )
  
  // Generate static params for top 500 vendors
  return vendorIndex.slice(0, 500).map((vendor) => ({
    slug: vendor.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const vendorData: VendorData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'vendors', `${slug}.json`), 'utf-8')
    )

    return {
      title: `${vendorData.name} - DOGE Contract Analysis | OpenFeds`,
      description: `Complete analysis of ${vendorData.name}'s federal contracts terminated by DOGE. $${Math.round(vendorData.totalSavings / 1000000)}M in claimed savings across ${vendorData.contracts.length} contracts.`,
      alternates: { canonical: `/doge/vendors/${slug}` },
      openGraph: {
        title: `${vendorData.name} - DOGE Impact Analysis`,
        description: `$${Math.round(vendorData.totalSavings / 1000000)}M in claimed savings from ${vendorData.contracts.length} terminated contracts.`,
        type: "website",
      },
    }
  } catch {
    return {
      title: "Vendor Not Found | OpenFeds",
      description: "The requested vendor could not be found.",
    }
  }
}

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  let vendorData: VendorData
  
  try {
    vendorData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'vendors', `${slug}.json`), 'utf-8')
    )
  } catch {
    notFound()
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "DOGE", href: "/doge" },
    { label: "Vendors", href: "/doge/vendors" },
    { label: vendorData.name, href: `/doge/vendors/${slug}` }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="mt-8">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif mb-4">
              {vendorData.name}
            </h1>
            <div className="text-lg text-gray-600 space-y-2">
              <p>
                <span className="font-semibold text-green-600">
                  ${Math.round(vendorData.totalSavings / 1000000)}M
                </span> in claimed savings from{" "}
                <span className="font-semibold">
                  {vendorData.contracts.length} terminated contracts
                </span>
              </p>
              <p>
                Total contract value: <span className="font-semibold">
                  ${Math.round(vendorData.totalValue / 1000000)}M
                </span>
              </p>
              <p>
                Agencies involved: <span className="font-semibold">
                  {vendorData.agencies.join(", ")}
                </span>
              </p>
            </div>
          </div>

          <VendorDetailClient data={vendorData} />
        </div>
      </div>
    </div>
  )
}