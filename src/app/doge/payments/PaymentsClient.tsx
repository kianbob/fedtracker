'use client'

import { useState, useMemo } from "react"
import { StatCard } from "@/components/StatCard"
import { SimpleBarChart, SimplePieChart } from "@/components/Charts"
import { formatNumber } from "@/lib/format"

interface PaymentSummary {
  totalPayments: number
  totalAmount: number
  avgPayment: number
}

interface AgencyPayment {
  agency: string
  count: number
  total: number
}

interface TopRecipient {
  org: string
  count: number
  total: number
}

interface AmountBucket {
  label: string
  count: number
  total: number
}

interface KeywordAnalysis {
  keyword: string
  count: number
  totalAmount: number
}

interface FlaggedPayment {
  amount: number
  agency: string
  org: string
  description: string
  date: string
}

interface PaymentsData {
  summary: PaymentSummary
  byAgency: AgencyPayment[]
  topRecipients: TopRecipient[]
  amountBuckets: AmountBucket[]
  keywordAnalysis: KeywordAnalysis[]
  flaggedPayments: FlaggedPayment[]
}

interface PaymentsClientProps {
  data: PaymentsData
}

export default function PaymentsClient({ data }: PaymentsClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAgency, setSelectedAgency] = useState<string>("")

  // Filter flagged payments
  const filteredFlaggedPayments = useMemo(() => {
    let filtered = data.flaggedPayments.filter(payment => {
      const matchesSearch = searchQuery === "" || 
        payment.org.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.agency.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesAgency = selectedAgency === "" || payment.agency === selectedAgency

      return matchesSearch && matchesAgency
    })

    return filtered
  }, [data.flaggedPayments, searchQuery, selectedAgency])

  // Prepare chart data
  const agencyChartData = useMemo(() => {
    return data.byAgency.slice(0, 15).map(item => ({
      name: item.agency.length > 30 ? item.agency.substring(0, 30) + "..." : item.agency,
      value: item.total / 1000000 // Convert to millions
    }))
  }, [data.byAgency])

  const amountDistributionData = useMemo(() => {
    return data.amountBuckets.map(bucket => ({
      name: bucket.label,
      value: bucket.count
    }))
  }, [data.amountBuckets])

  const keywordChartData = useMemo(() => {
    return data.keywordAnalysis.slice(0, 10).map(item => ({
      name: item.keyword.charAt(0).toUpperCase() + item.keyword.slice(1),
      value: item.count
    }))
  }, [data.keywordAnalysis])

  const topRecipientsChartData = useMemo(() => {
    return data.topRecipients.slice(0, 10).map(item => ({
      name: item.org.length > 25 ? item.org.substring(0, 25) + "..." : item.org,
      value: item.total / 1000000 // Convert to millions
    }))
  }, [data.topRecipients])

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          value={formatNumber(data.summary.totalPayments)}
          sub="Under DOGE review"
        />
        <StatCard
          value={`$${formatNumber(data.summary.totalAmount / 1000000)}M`}
          sub="Being analyzed"
        />
        <StatCard
          value={`$${formatNumber(data.summary.avgPayment)}`}
          sub="Per transaction"
        />
      </div>

      {/* Agency Breakdown Chart */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Agency Breakdown (Top 15)</h3>
        <div className="h-96">
          <SimpleBarChart
            data={agencyChartData}
            nameKey="name"
            dataKey="value"
            color="#6366f1"
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Amount Distribution */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Size Distribution</h3>
          <div className="h-80">
            <SimplePieChart
              data={amountDistributionData}
              dataKey="value"
              nameKey="name"
            />
          </div>
        </div>

        {/* Top Recipients */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Recipients ($ Millions)</h3>
          <div className="h-80">
            <SimpleBarChart
              data={topRecipientsChartData}
              nameKey="name"
              dataKey="value"
              color="#059669"
            />
          </div>
        </div>
      </div>

      {/* Keyword Analysis */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">What Payments Mention (Top Keywords)</h3>
        <div className="h-96">
          <SimpleBarChart
            data={keywordChartData}
            nameKey="name"
            dataKey="value"
            color="#dc2626"
          />
        </div>
      </div>

      {/* Flagged Payments Table */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Flagged/Interesting Payments</h3>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search payments
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by organization, description, or agency..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="agency" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by agency
              </label>
              <select
                id="agency"
                value={selectedAgency}
                onChange={(e) => setSelectedAgency(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All agencies</option>
                {data.byAgency.slice(0, 20).map((agency) => (
                  <option key={agency.agency} value={agency.agency}>
                    {agency.agency}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Showing {filteredFlaggedPayments.length} of {data.flaggedPayments.length} flagged payments
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFlaggedPayments.slice(0, 50).map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${formatNumber(payment.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="truncate max-w-xs">
                      {payment.agency}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="truncate max-w-xs">
                      {payment.org}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="truncate max-w-md">
                      {payment.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredFlaggedPayments.length > 50 && (
            <div className="px-6 py-4 bg-gray-50 text-sm text-gray-600 text-center">
              Showing first 50 results. Use search and filters to narrow results.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}