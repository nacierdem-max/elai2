import React from 'react';
import Link from 'next/link';
import KPIBentoGrid from './KPIBentoGrid';
import AIQueryBar from './AIQueryBar';
import WorkloadChartSection from './WorkloadChartSection';
import RiskAlertList from './RiskAlertList';
import ActivityFeed from './ActivityFeed';
import TopEngineersWorkload from './TopEngineersWorkload';

export default function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Genel Bakış</h1>
          <p className="text-muted-foreground text-sm mt-1">
            05 Mayıs 2026 · Tüm departmanlar · 2026 Aktif Dönemi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/analytics" className="btn-ghost text-sm flex items-center gap-2">
            <span>📅</span> Dönem Seç
          </Link>
          <Link href="/analytics" className="btn-primary text-sm flex items-center gap-2">
            <span>📊</span> Rapor Al
          </Link>
        </div>
      </div>

      {/* AI Query Bar */}
      <AIQueryBar />

      {/* KPI Bento Grid */}
      <KPIBentoGrid />

      {/* Charts row */}
      <WorkloadChartSection />

      {/* Bottom row: Risk alerts + Activity + Top engineers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
        <RiskAlertList />
        <ActivityFeed />
        <TopEngineersWorkload />
      </div>
    </div>
  );
}