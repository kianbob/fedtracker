import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import { TaxpayerImpactClient } from './TaxpayerImpactClient';

export const metadata: Metadata = {
  title: 'Taxpayer Impact Calculator | Federal Employee Tracker',
  description: 'Calculate what DOGE savings mean for the average taxpayer by state. See how much you could save if government efficiency claims are real.',
  keywords: ['DOGE savings', 'taxpayer impact', 'government efficiency', 'tax savings by state'],
  alternates: { canonical: '/tools/taxpayer-impact' },
};

export default function TaxpayerImpactPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb 
          items={[
            { href: '/', label: 'Home' },
            { href: '/tools', label: 'Tools' },
            { label: 'Taxpayer Impact Calculator' }
          ]} 
        />
        
        <div className="mt-8 mb-8">
          <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white mb-4">
            Taxpayer Impact Calculator
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
            Calculate what DOGE's claimed $2 trillion in savings would mean for you. 
            See how much the average taxpayer in your state could save if the efficiency 
            claims are real—and how much if they're not.
          </p>
        </div>

        <TaxpayerImpactClient />
      </div>
    </div>
  );
}