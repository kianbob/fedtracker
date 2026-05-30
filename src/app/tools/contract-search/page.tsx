import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import { ContractSearchClient } from './ContractSearchClient';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'DOGE Contract Search & Analysis Tool',
  description: 'Search and analyze DOGE contract savings claims. Filter by agency, contractor, and savings amount. Export results and verify FPDS data.',
  keywords: ['DOGE contracts', 'federal contracts', 'contract search', 'government spending', 'contractor lookup'],
  alternates: { canonical: '/tools/contract-search' },
};

export default function ContractSearchPage() {
  const contractsData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'doge-contracts-analytics.json'), 'utf-8')
  );
  
  const vendorData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'vendor-index.json'), 'utf-8')
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb 
          items={[
            { href: '/', label: 'Home' },
            { href: '/tools', label: 'Tools' },
            { label: 'DOGE Contract Search' }
          ]} 
        />
        
        <div className="mt-8 mb-8">
          <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white mb-4">
            DOGE Contract Search
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
            Search through DOGE's contract savings claims. Filter by contractor, agency, 
            and savings amount. Verify claims against FPDS data and export results for analysis.
          </p>
        </div>

        <ContractSearchClient 
          contracts={contractsData.topContracts} 
          vendors={vendorData.vendors}
        />
      </div>
    </div>
  );
}