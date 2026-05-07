import React from 'react';
import { Activity, ExternalLink } from 'lucide-react';
import { ACTIVITY_LOGS, PERSONS } from '@/data/mockData';
import Link from 'next/link';

const ACTION_COLORS: Record<string, string> = {
  'Görev Güncellendi': '#3b7dd8',
  'Dosya Eklendi': '#06b6d4',
  'Risk Açıldı': '#f97316',
  'Görev Tamamlandı': '#22c55e',
  'Mesaj Gönderildi': '#8b5cf6',
  'Görev Eklendi': '#a78bfa',
  'Risk Güncellendi': '#eab308',
  'Görev Gecikti': '#ef4444',
};

export default function ActivityFeed() {
  return (
    <div className="card-base p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Activity size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Son Aktivite</h3>
            <p className="text-xs text-muted-foreground">980+ toplam log kaydı</p>
          </div>
        </div>
        <Link href="/logs" className="text-xs text-primary hover:underline flex items-center gap-1">
          Tümü <ExternalLink size={11} />
        </Link>
      </div>

      <div className="space-y-1">
        {ACTIVITY_LOGS.map((log) => {
          const user = PERSONS.find(p => p.id === log.userId);
          const actionColor = ACTION_COLORS[log.action] || '#94a3b8';

          return (
            <div
              key={`log-${log.id}`}
              className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/40 transition-all duration-100 cursor-pointer group"
            >
              {/* Avatar */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                style={{ backgroundColor: `${actionColor}20`, color: actionColor }}
              >
                {user?.avatar.slice(0, 2) || '?'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-foreground">{user?.name || 'Bilinmeyen'}</span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-medium"
                    style={{ backgroundColor: `${actionColor}20`, color: actionColor }}
                  >
                    {log.action}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{log.detail}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-muted-foreground font-mono">{log.date}</p>
                  <span
                    className="text-xs px-1 py-0.5 rounded"
                    style={{
                      backgroundColor: log.result === 'Başarılı' || log.result === 'Tamamlandı' ? '#22c55e20' : log.result === 'Gecikmiş' ? '#ef444420' : '#3b7dd820',
                      color: log.result === 'Başarılı' || log.result === 'Tamamlandı' ? '#22c55e' : log.result === 'Gecikmiş' ? '#ef4444' : '#3b7dd8',
                    }}
                  >
                    {log.result}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}