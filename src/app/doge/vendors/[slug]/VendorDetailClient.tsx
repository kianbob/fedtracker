'use client'

import { useState, useMemo } from "react"
import { StatCard } from "@/components/StatCard"
import { formatNumber } from "@/lib/format"

interface Contract {
  piid: string
  agency: string
  value: number
  savings: number
  description: string
  date: string
  fpdsStatus: string
}

interface VendorData {
  slug: string
  name: string
  totalValue: number
  totalSavings: number
  agencies: string[]
  contracts: Contract[]
}

interface VendorDetailClientProps {
  data: VendorData
}

export default function VendorDetailClient({ data }: VendorDetailClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<keyof Contract>("savings")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Filter and sort contracts
  const filteredAndSortedContracts = useMemo(() => {
    let filtered = data.contracts.filter(contract =>
      contract.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.piid.toLowerCase().includes(searchQuery.toLowerCase())
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
  }, [data.contracts, searchQuery, sortField, sortDirection])

  const handleSort = (field: keyof Contract) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "desc" ? "asc" : "desc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const getSortIcon = (field: keyof Contract) => {
    if (sortField !== field) return "↕️"
    return sortDirection === "desc" ? "↓" : "↑"
  }

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Contracts"
          value={formatNumber(data.contracts.length)}
          sub="Terminated by DOGE"
        />
        <StatCard
          label="Total Contract Value"
          value={`$${formatNumber(data.totalValue / 1000000)}M`}
          sub="Originally awarded"
        />
        <StatCard
          label="Total Claimed Savings"
          value={`$${formatNumber(data.totalSavings / 1000000)}M`}
          sub="From terminations"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search contracts
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by description, agency, or contract ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Showing {filteredAndSortedContracts.length} of {data.contracts.length} contracts
        </p>
      </div>

      {/* Contracts Table */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Terminated Contracts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract ID
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('agency')}
                >
                  Agency {getSortIcon('agency')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('value')}
                >
                  Contract Value {getSortIcon('value')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('savings')}
                >
                  Claimed Savings {getSortIcon('savings')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('date')}
                >
                  Date {getSortIcon('date')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedContracts.map((contract) => (
                <tr key={contract.piid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {contract.piid}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.agency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${formatNumber(contract.value / 1000000)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ${formatNumber(contract.savings / 1000000)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contract.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {contract.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      contract.fpdsStatus === 'Terminated' 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {contract.fpdsStatus}
                    </span>
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