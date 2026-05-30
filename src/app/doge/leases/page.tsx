import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import { LeasesClient } from './LeasesClient';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'DOGE Lease Cuts: 264 Leases, $53M Saved',
  description: '264 federal leases terminated saving $53.5M. Track which agencies eliminated leases, square footage reduced, and cost per square foot savings.',
  keywords: ['DOGE leases', 'federal lease terminations', 'real estate savings', 'government efficiency', 'office space reduction'],
  alternates: { canonical: '/doge/leases' },
};

export default function DogeleasesPage() {
  const leasesData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'doge-leases-analytics.json'), 'utf-8')
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb 
          items={[
            { href: '/', label: 'Home' },
            { href: '/doge', label: 'DOGE Analysis' },
            { label: 'Lease Terminations' }
          ]} 
        />
        
        <div className="mt-8 mb-8">
          <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white mb-4">
            264 Federal Leases Terminated — $53.5M Saved
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
            The smallest category of DOGE savings, but the most verifiable. Track which agencies 
            terminated office leases, how much square footage was reduced, and what the government 
            saved on rent.
          </p>
        </div>

        <LeasesClient data={leasesData} />
      </div>
    </div>
  );
}