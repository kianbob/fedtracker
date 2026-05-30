import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import { GovernmentBuilderClient } from './GovernmentBuilderClient';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Build Your Own Government Calculator',
  description: 'Interactive calculator to design your ideal federal government. Pick which agencies to keep or cut and see the real-time impact on workforce size, costs, and taxpayer savings.',
  keywords: ['government calculator', 'federal agencies', 'DOGE cuts', 'government efficiency', 'federal workforce'],
  alternates: { canonical: '/tools/government-builder' },
};

export default function GovernmentBuilderPage() {
  const agencyListData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'agency-list.json'), 'utf-8')
  );
  
  const dogeScorecardsData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'doge-agency-scorecards.json'), 'utf-8')
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb 
          items={[
            { href: '/', label: 'Home' },
            { href: '/tools', label: 'Tools' },
            { label: 'Build Your Own Government' }
          ]} 
        />
        
        <div className="mt-8 mb-8">
          <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white mb-4">
            Build Your Own Government
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
            Design your ideal federal government. Choose which agencies to keep or eliminate and see 
            the real-time impact on workforce size, costs, and taxpayer savings. Compare your cuts 
            to DOGE's actual proposals.
          </p>
        </div>

        <GovernmentBuilderClient 
          agencies={agencyListData} 
          scorecards={dogeScorecardsData.scorecards} 
        />
      </div>
    </div>
  );
}