import { Metadata } from "next"
import { notFound } from "next/navigation"
import Breadcrumb from "@/components/Breadcrumb"
import RecipientDetailClient from "./RecipientDetailClient"
import fs from 'fs'
import path from 'path'

interface RecipientData {
  slug: string
  name: string
  totalValue: number
  totalSavings: number
  agencies: string[]
  grants: Array<{
    agency: string
    value: number
    savings: number
    description: string
    date: string
    link?: string
  }>
}

interface RecipientIndexItem {
  slug: string
  name: string
  grantCount: number
  totalValue: number
  totalSavings: number
  agencyCount: number
  agencies: string[]
}

export async function generateStaticParams() {
  const recipientIndex: RecipientIndexItem[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'recipient-index.json'), 'utf-8')
  )
  
  // Generate static params for top 500 recipients
  return recipientIndex.slice(0, 500).map((recipient) => ({
    slug: recipient.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const recipientData: RecipientData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'recipients', `${slug}.json`), 'utf-8')
    )

    return {
      title: `${recipientData.name} - DOGE Grant Analysis | OpenFeds`,
      description: `Complete analysis of ${recipientData.name}'s federal grants terminated by DOGE. $${Math.round(recipientData.totalSavings / 1000000)}M in claimed savings across ${recipientData.grants.length} grants.`,
      alternates: { canonical: `/doge/recipients/${slug}` },
      openGraph: {
        title: `${recipientData.name} - DOGE Impact Analysis`,
        description: `$${Math.round(recipientData.totalSavings / 1000000)}M in claimed savings from ${recipientData.grants.length} terminated grants.`,
        type: "website",
      },
    }
  } catch {
    return {
      title: "Recipient Not Found | OpenFeds",
      description: "The requested grant recipient could not be found.",
    }
  }
}

export default async function RecipientDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  let recipientData: RecipientData
  
  try {
    recipientData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'recipients', `${slug}.json`), 'utf-8')
    )
  } catch {
    notFound()
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "DOGE", href: "/doge" },
    { label: "Recipients", href: "/doge/recipients" },
    { label: recipientData.name, href: `/doge/recipients/${slug}` }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="mt-8">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif mb-4">
              {recipientData.name}
            </h1>
            <div className="text-lg text-gray-600 space-y-2">
              <p>
                <span className="font-semibold text-green-600">
                  ${Math.round(recipientData.totalSavings / 1000000)}M
                </span> in claimed savings from{" "}
                <span className="font-semibold">
                  {recipientData.grants.length} terminated grants
                </span>
              </p>
              <p>
                Total grant value: <span className="font-semibold">
                  ${Math.round(recipientData.totalValue / 1000000)}M
                </span>
              </p>
              <p>
                Agencies involved: <span className="font-semibold">
                  {recipientData.agencies.join(", ")}
                </span>
              </p>
            </div>
          </div>

          <RecipientDetailClient data={recipientData} />
        </div>
      </div>
    </div>
  )
}