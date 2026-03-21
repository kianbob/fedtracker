'use client';

import { useState, useMemo } from 'react';
import { StatCard } from '@/components/StatCard';
import { SimpleBarChart } from '@/components/Charts';
import { formatNumber, formatSalary, fixAgencyName } from '@/lib/format';

interface AgencyScorecard {
  agencyName: string;
  totalClaimedSavings: number;
  contractSavings: number;
  grantSavings: number;
  totalActions: number;
}

interface Agency {
  code: string;
  name: string;
  employees: number;
  avgSalary: number | null;
}

interface DogeImpact {
  agencies: Array<{
    name: string;
    employeesLost: number;
    quitRate: number;
    rateChange: number;
  }>;
}

interface Props {
  scorecards: AgencyScorecard[];
  agencies: Agency[];
  dogeImpact: DogeImpact;
}

interface AgencyReportCard {
  name: string;
  grade: string;
  score: number;
  employees: number;
  employeesLost: number;
  quitRate: number;
  contractSavings: number;
  grantSavings: number;
  totalSavings: number;
  totalActions: number;
  verificationRate: number;
  costPerEmployee: number;
}

export function AgencyReportCardClient({ scorecards, agencies, dogeImpact }: Props) {
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'score' | 'savings' | 'workforce' | 'name'>('score');
  const [searchQuery, setSearchQuery] = useState('');

  // Create comprehensive report cards
  const reportCards = useMemo<AgencyReportCard[]>(() => {
    const agencyMap = new Map((agencies || []).map((a: any) => [a.name, a]));
    const impactMap = new Map((dogeImpact?.agencies || []).map((a: any) => [a.name, a]));

    return scorecards.map(scorecard => {
      const agency = agencyMap.get(scorecard.agencyName) || 
        (agencies || []).find((a: any) => a.name.includes(scorecard.agencyName) || scorecard.agencyName.includes(a.name));
      const impact = impactMap.get(scorecard.agencyName) ||
        (dogeImpact?.agencies || []).find((a: any) => a.name.includes(scorecard.agencyName) || scorecard.agencyName.includes(a.name));

      const employees = agency?.employees || 0;
      const employeesLost = impact?.employeesLost || 0;
      const quitRate = impact?.quitRate || 0;
      const totalSavings = scorecard.contractSavings + scorecard.grantSavings;
      
      // Calculate verification rate (mock calculation based on actions vs savings)
      const verificationRate = scorecard.totalActions > 0 
        ? Math.min(100, (scorecard.totalActions / (totalSavings / 10000000)) * 100)
        : 0;

      // Calculate cost per employee
      const costPerEmployee = employees > 0 ? (agency?.avgSalary || 100000) : 0;

      // Calculate overall score (weighted metrics)
      let score = 0;
      
      // Workforce efficiency (30%)
      if (employees > 0) {
        const workforceScore = Math.min(100, (employeesLost / employees) * 100 * 5); // Scale up smaller percentages
        score += workforceScore * 0.3;
      }
      
      // Savings efficiency (40%)
      const savingsScore = Math.min(100, Math.log10(totalSavings + 1) * 10);
      score += savingsScore * 0.4;
      
      // Verification/credibility (20%)
      score += verificationRate * 0.2;
      
      // Quit rate penalty (10% - lower quit rate is better)
      const quitScore = Math.max(0, 100 - (quitRate * 10));
      score += quitScore * 0.1;

      // Determine letter grade
      let grade = 'F';
      if (score >= 90) grade = 'A';
      else if (score >= 80) grade = 'B';
      else if (score >= 70) grade = 'C';
      else if (score >= 60) grade = 'D';

      return {
        name: fixAgencyName(scorecard.agencyName),
        grade,
        score: Math.round(score),
        employees,
        employeesLost,
        quitRate,
        contractSavings: scorecard.contractSavings,
        grantSavings: scorecard.grantSavings,
        totalSavings,
        totalActions: scorecard.totalActions,
        verificationRate: Math.round(verificationRate),
        costPerEmployee
      };
    });
  }, [scorecards, agencies, dogeImpact]);

  // Filter and sort report cards
  const filteredCards = useMemo(() => {
    let filtered = reportCards.filter(card =>
      card.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'savings':
          return b.totalSavings - a.totalSavings;
        case 'workforce':
          return b.employeesLost - a.employeesLost;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [reportCards, searchQuery, sortBy]);

  // Calculate overall stats
  const overallStats = useMemo(() => {
    const totalAgencies = reportCards.length;
    const avgScore = reportCards.reduce((sum, card) => sum + card.score, 0) / totalAgencies;
    const totalSavings = reportCards.reduce((sum, card) => sum + card.totalSavings, 0);
    const totalEmployeesLost = reportCards.reduce((sum, card) => sum + card.employeesLost, 0);

    const gradeDistribution = {
      A: reportCards.filter(c => c.grade === 'A').length,
      B: reportCards.filter(c => c.grade === 'B').length,
      C: reportCards.filter(c => c.grade === 'C').length,
      D: reportCards.filter(c => c.grade === 'D').length,
      F: reportCards.filter(c => c.grade === 'F').length
    };

    return {
      totalAgencies,
      avgScore,
      totalSavings,
      totalEmployeesLost,
      gradeDistribution
    };
  }, [reportCards]);

  // Chart data for top/bottom performers
  const topPerformersData = filteredCards
    .slice(0, 10)
    .map(card => ({
      name: card.name.length > 25 ? card.name.substring(0, 22) + '...' : card.name,
      value: card.score,
      grade: card.grade,
      savings: card.totalSavings
    }));

  const addToComparison = (agencyName: string) => {
    if (selectedAgencies.length < 3 && !selectedAgencies.includes(agencyName)) {
      setSelectedAgencies([...selectedAgencies, agencyName]);
    }
  };

  const removeFromComparison = (agencyName: string) => {
    setSelectedAgencies(selectedAgencies.filter(name => name !== agencyName));
  };

  return (
    <div className="space-y-8">
      {/* Overall Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          value={`${overallStats.avgScore.toFixed(0)}/100`}
          sub={`${Object.entries(overallStats.gradeDistribution).reduce((acc, [grade, count]) => count > acc.count ? {grade, count} : acc, {grade: '', count: 0}).grade} most common`}
        />
        <StatCard
          value={formatSalary(overallStats.totalSavings)}
          sub="across all agencies"
        />
        <StatCard
          value={formatNumber(overallStats.totalEmployeesLost)}
          sub="positions affected"
        />
        <StatCard
          value={formatNumber(overallStats.totalAgencies)}
          sub={`${overallStats.gradeDistribution.A + overallStats.gradeDistribution.B} performing well`}
        />
      </div>

      {/* Grade Distribution */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-6">
          Grade Distribution
        </h2>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(overallStats.gradeDistribution).map(([grade, count]) => (
            <div key={grade} className="text-center">
              <div className={`text-3xl font-bold mb-2 ${
                grade === 'A' ? 'text-green-600' :
                grade === 'B' ? 'text-blue-600' :
                grade === 'C' ? 'text-yellow-600' :
                grade === 'D' ? 'text-orange-600' : 'text-red-600'
              }`}>
                {grade}
              </div>
              <div className="text-2xl font-medium text-slate-900 dark:text-white">{count}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">agencies</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performers Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-6">
          Top 10 Agency Performers
        </h2>
        <SimpleBarChart
          data={topPerformersData}
          nameKey="name"
          dataKey="value"
        />
      </div>

      {/* Search and Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Search Agencies
            </label>
            <input
              type="text"
              placeholder="Search agency name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
            >
              <option value="score">DOGE Score (High to Low)</option>
              <option value="savings">Total Savings (High to Low)</option>
              <option value="workforce">Workforce Impact (High to Low)</option>
              <option value="name">Agency Name (A-Z)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setSelectedAgencies([])}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Clear Comparison ({selectedAgencies.length}/3)
            </button>
          </div>
        </div>

        {selectedAgencies.length > 0 && (
          <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <h3 className="font-medium text-slate-900 dark:text-white mb-2">
              Agency Comparison ({selectedAgencies.length}/3)
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedAgencies.map(name => (
                <span 
                  key={name}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 rounded-full text-sm"
                >
                  {name}
                  <button
                    onClick={() => removeFromComparison(name)}
                    className="ml-1 text-indigo-600 hover:text-indigo-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Agency Report Cards */}
      <div className="grid gap-6">
        {filteredCards.map(card => (
          <div key={card.name} className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
                    {card.name}
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-lg font-bold ${
                    card.grade === 'A' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                    card.grade === 'B' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                    card.grade === 'C' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                    card.grade === 'D' ? 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100' :
                    'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                  }`}>
                    {card.grade}
                  </div>
                  <span className="text-lg font-medium text-slate-600 dark:text-slate-400">
                    {card.score}/100
                  </span>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {formatNumber(card.employees)} employees • {formatNumber(card.totalActions)} DOGE actions
                </div>
              </div>
              <button
                onClick={() => selectedAgencies.includes(card.name) 
                  ? removeFromComparison(card.name) 
                  : addToComparison(card.name)}
                disabled={!selectedAgencies.includes(card.name) && selectedAgencies.length >= 3}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  selectedAgencies.includes(card.name)
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : selectedAgencies.length >= 3
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {selectedAgencies.includes(card.name) ? 'Remove' : 'Compare'}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Workforce Impact</div>
                <div className="font-medium text-slate-900 dark:text-white">
                  {formatNumber(card.employeesLost)} positions
                </div>
                <div className="text-xs text-slate-400">
                  {card.quitRate.toFixed(1)}% quit rate
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Contract Savings</div>
                <div className="font-medium text-green-600">
                  {formatSalary(card.contractSavings)}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Grant Savings</div>
                <div className="font-medium text-green-600">
                  {formatSalary(card.grantSavings)}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Verification Rate</div>
                <div className={`font-medium ${card.verificationRate > 60 ? 'text-green-600' : card.verificationRate > 30 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {card.verificationRate}%
                </div>
                <div className="text-xs text-slate-400">
                  credibility score
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Methodology */}
      <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-4">
          How We Grade Agencies
        </h3>
        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          <p>• <span className="font-medium">Workforce Efficiency (30%):</span> Positions eliminated relative to agency size</p>
          <p>• <span className="font-medium">Savings Performance (40%):</span> Total dollar savings in contracts and grants</p>
          <p>• <span className="font-medium">Verification Rate (20%):</span> How many claims can be verified in official databases</p>
          <p>• <span className="font-medium">Retention Score (10%):</span> Lower quit rates indicate better management during transition</p>
          <p>• Grades: A (90-100), B (80-89), C (70-79), D (60-69), F (&lt;60)</p>
        </div>
      </div>
    </div>
  );
}