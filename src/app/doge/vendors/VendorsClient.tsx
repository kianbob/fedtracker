'use client'

import { useState, useMemo } from "react"
import Link from "next/link"
import { StatCard } from "@/components/StatCard"
import { formatNumber } from "@/lib/format"

interface Vendor {
  slug: string
  name: string
  contractCount: number
  totalValue: number
  totalSavings: number
  agencyCount: number
  agencies: string[]
}

interface VendorsClientProps {
  data: Vendor[]
}

export default function VendorsClient({ data }: VendorsClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<keyof Vendor>("totalSavings")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const totalVendors = data.length
    const totalSavings = data.reduce((sum, vendor) => sum + vendor.totalSavings, 0)
    const avgSavings = totalSavings / totalVendors
    
    return { totalVendors, totalSavings, avgSavings }
  }, [data])

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(vendor =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.agencies.some(agency => 
        agency.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )

    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'desc' 
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue)
      }
      
      return sortDirection === 'desc' 
        ? (bValue as number) - (aValue as number)
        : (aValue as number) - (bValue as number)
    })

    return filtered
  }, [data, searchQuery, sortField, sortDirection])

  const handleSort = (field: keyof Vendor) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "desc" ? "asc" : "desc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const getSortIcon = (field: keyof Vendor) => {
    if (sortField !== field) return "↕️"
    return sortDirection === "desc" ? "↓" : "↑"
  }

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Vendors"
          value={formatNumber(summaryStats.totalVendors)}
          sub="Affected by DOGE"
        />
        <StatCard
          label="Total Claimed Savings"
          value={`$${formatNumber(summaryStats.totalSavings / 1000000)}M`}
          sub="From contract terminations"
        />
        <StatCard
          label="Average Savings per Vendor"
          value={`$${formatNumber(summaryStats.avgSavings / 1000000)}M`}
          sub="Efficiency impact"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search vendors or agencies
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by vendor name or agency..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Showing {filteredAndSortedData.length} of {data.length} vendors
        </p>
      </div>

      {/* Vendors Table */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  Vendor Name {getSortIcon('name')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('contractCount')}
                >
                  Contracts Terminated {getSortIcon('contractCount')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('totalValue')}
                >
                  Total Value {getSortIcon('totalValue')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('totalSavings')}
                >
                  Claimed Savings {getSortIcon('totalSavings')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agencies
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedData.map((vendor) => (
                <tr key={vendor.slug} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      href={`/doge/vendors/${vendor.slug}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      {vendor.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(vendor.contractCount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${formatNumber(vendor.totalValue / 1000000)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ${formatNumber(vendor.totalSavings / 1000000)}M
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {vendor.agencies.slice(0, 3).map((agency, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                        >
                          {agency}
                        </span>
                      ))}
                      {vendor.agencies.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{vendor.agencies.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}