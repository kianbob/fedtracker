import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import { AgencyReportCardClient } from './AgencyReportCardClient';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Federal Agency DOGE Report Card Tool',
  description: 'Grade each federal agency on DOGE performance. Compare workforce changes, contract savings, verification rates, and efficiency scores.',
  keywords: ['DOGE scorecard', 'agency performance', 'federal efficiency', 'agency comparison', 'government report card'],
  alternates: { canonical: '/tools/agency-report-card' },
};

export default function AgencyReportCardPage() {
  const scorecardsData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'doge-agency-scorecards.json'), 'utf-8')
  );
  
  const agencyListData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'agency-list.json'), 'utf-8')
  );
  
  const dogeImpactData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'doge-impact.json'), 'utf-8')
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb 
          items={[
            { href: '/', label: 'Home' },
            { href: '/tools', label: 'Tools' },
            { label: 'Agency DOGE Report Card' }
          ]} 
        />
        
        <div className="mt-8 mb-8">
          <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white mb-4">
            Agency DOGE Report Card
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
            Grade each federal agency on their DOGE performance. Compare workforce changes, 
            contract savings, verification rates, and compute an overall efficiency score. 
            See which agencies exceeded targets and which fell short.
          </p>
        </div>

        <AgencyReportCardClient 
          scorecards={scorecardsData.scorecards}
          agencies={agencyListData}
          dogeImpact={dogeImpactData}
        />
      </div>
    </div>
  );
}