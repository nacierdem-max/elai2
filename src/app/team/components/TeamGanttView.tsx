'use client';
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { TASKS, DEPARTMENT_COLORS, type Person, type Task } from '@/data/mockData';

type ViewMode = 'weekly' | 'monthly';

function parseDate(str: string): Date {
  const [d, m, y] = str.split('.').map(Number);
  return new Date(y, m - 1, d);
}

const MONTH_NAMES = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const MONTH_SHORT = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const DAY_NAMES = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

interface GanttColumn {
  label: string;
  subLabel?: string;
  start: Date;
  end: Date;
}

function getWeeklyColumns(anchorDate: Date): GanttColumn[] {
  const weekStart = startOfWeek(anchorDate);
  const cols: GanttColumn[] = [];
  for (let i = 0; i < 7; i++) {
    const day = addDays(weekStart, i);
    cols.push({
      label: DAY_NAMES[day.getDay()],
      subLabel: `${day.getDate()}`,
      start: new Date(day.getFullYear(), day.getMonth(), day.getDate()),
      end: new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59),
    });
  }
  return cols;
}

function getMonthlyColumns(anchorDate: Date): GanttColumn[] {
  const year = anchorDate.getFullYear();
  const cols: GanttColumn[] = [];
  for (let m = 0; m < 12; m++) {
    cols.push({
      label: MONTH_SHORT[m],
      start: new Date(year, m, 1),
      end: new Date(year, m + 1, 0, 23, 59, 59),
    });
  }
  return cols;
}

interface TaskBar {
  task: Task;
  colStart: number;
  colEnd: number;
  colStartFrac: number;
  colEndFrac: number;
}

function computeTaskBars(tasks: Task[], columns: GanttColumn[]): TaskBar[] {
  const bars: TaskBar[] = [];
  const rangeStart = columns[0].start;
  const rangeEnd = columns[columns.length - 1].end;

  for (const task of tasks) {
    if (!task.startDate || !task.endDate) continue;
    const ts = parseDate(task.startDate);
    const te = parseDate(task.endDate);
    if (te < rangeStart || ts > rangeEnd) continue;

    const clampedStart = ts < rangeStart ? rangeStart : ts;
    const clampedEnd = te > rangeEnd ? rangeEnd : te;

    let colStart = -1, colEnd = -1;
    let colStartFrac = 0, colEndFrac = 1;

    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      const colMs = col.end.getTime() - col.start.getTime();
      if (clampedStart <= col.end && colStart === -1) {
        colStart = i;
        colStartFrac = (clampedStart.getTime() - col.start.getTime()) / colMs;
        colStartFrac = Math.max(0, Math.min(1, colStartFrac));
      }
      if (clampedEnd >= col.start) {
        colEnd = i;
        colEndFrac = (clampedEnd.getTime() - col.start.getTime()) / colMs;
        colEndFrac = Math.max(0, Math.min(1, colEndFrac));
      }
    }

    if (colStart !== -1 && colEnd !== -1) {
      bars.push({ task, colStart, colEnd, colStartFrac, colEndFrac });
    }
  }
  return bars;
}

function getBarColor(task: Task, deptColor: string): string {
  if (task.status === 'Tamamlandı') return '#22c55e';
  if (task.status === 'Gecikmiş') return '#ef4444';
  if (task.status === 'Riskli') return '#f97316';
  if (task.status === 'Plan' || task.status === 'Plan Dışı') return '#94a3b8';
  return deptColor;
}

interface MemberRowProps {
  person: Person;
  tasks: Task[];
  columns: GanttColumn[];
  colWidth: number;
}

function MemberRow({ person, tasks, columns, colWidth }: MemberRowProps) {
  const deptColor = DEPARTMENT_COLORS[person.department] || '#94a3b8';
  const isOverloaded = person.activeTasks >= 7;
  const bars = useMemo(() => computeTaskBars(tasks, columns), [tasks, columns]);
  const totalWidth = columns.length * colWidth;

  return (
    <div className="flex items-stretch border-b border-border/40 hover:bg-muted/20 transition-colors group min-h-[52px]">
      {/* Member info */}
      <div className="w-44 shrink-0 flex items-center gap-2.5 px-3 py-2 border-r border-border/40">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ backgroundColor: deptColor }}
        >
          {person.avatar}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">{person.name}</p>
          <p className="text-xs text-muted-foreground truncate" style={{ fontSize: '10px' }}>
            {isOverloaded ? (
              <span className="text-orange-500 font-semibold flex items-center gap-0.5">
                <AlertTriangle size={9} /> AŞIRI YÜK: %{Math.round((person.activeTasks / 8) * 100)}
              </span>
            ) : (
              person.title.toUpperCase().slice(0, 18)
            )}
          </p>
        </div>
      </div>

      {/* Gantt area */}
      <div className="relative flex-1 overflow-hidden" style={{ minWidth: `${totalWidth}px` }}>
        {/* Column grid lines */}
        <div className="absolute inset-0 flex pointer-events-none">
          {columns.map((col, i) => (
            <div
              key={i}
              className="border-r border-border/20 h-full"
              style={{ width: `${colWidth}px`, flexShrink: 0 }}
            />
          ))}
        </div>

        {/* Task bars */}
        {bars.map(({ task, colStart, colEnd, colStartFrac, colEndFrac }) => {
          const barColor = getBarColor(task, deptColor);
          const left = colStart * colWidth + colStartFrac * colWidth;
          const right = colEnd * colWidth + colEndFrac * colWidth;
          const width = Math.max(4, right - left);

          return (
            <div
              key={task.id}
              className="absolute top-2 bottom-2 rounded-md flex items-center px-2 overflow-hidden cursor-pointer"
              style={{
                left: `${left}px`,
                width: `${width}px`,
                backgroundColor: barColor,
                opacity: task.status === 'Tamamlandı' ? 0.75 : 1,
              }}
              title={`${task.name}\n${task.startDate} → ${task.endDate}\nDurum: ${task.status}`}
            >
              {width > 40 && (
                <span className="text-white font-semibold truncate whitespace-nowrap" style={{ fontSize: '10px' }}>
                  {task.name}
                </span>
              )}
            </div>
          );
        })}

        {bars.length === 0 && (
          <div className="absolute inset-0 flex items-center px-4">
            <span className="text-xs text-muted-foreground/40">—</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface TeamGanttViewProps {
  filteredPersons: Person[];
}

export default function TeamGanttView({ filteredPersons }: TeamGanttViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('weekly');
  const [anchorDate, setAnchorDate] = useState<Date>(() => new Date(2026, 4, 12)); // May 12 2026

  const columns = useMemo(() => {
    return viewMode === 'weekly'
      ? getWeeklyColumns(anchorDate)
      : getMonthlyColumns(anchorDate);
  }, [viewMode, anchorDate]);

  const colWidth = viewMode === 'weekly' ? 110 : 72;

  function navigate(dir: 1 | -1) {
    if (viewMode === 'weekly') {
      setAnchorDate(d => addDays(d, dir * 7));
    } else {
      setAnchorDate(d => new Date(d.getFullYear() + dir, d.getMonth(), 1));
    }
  }

  // Period label
  const periodLabel = useMemo(() => {
    if (viewMode === 'weekly') {
      const ws = startOfWeek(anchorDate);
      const we = addDays(ws, 6);
      return `${ws.getDate()} ${MONTH_SHORT[ws.getMonth()]} – ${we.getDate()} ${MONTH_SHORT[we.getMonth()]} ${we.getFullYear()}`;
    } else {
      return `${anchorDate.getFullYear()}`;
    }
  }, [viewMode, anchorDate]);

  // Summary stats
  const totalBusy = useMemo(() => filteredPersons.filter(p => p.activeTasks > 0).length, [filteredPersons]);
  const totalAvailable = useMemo(() => filteredPersons.filter(p => p.activeTasks === 0).length, [filteredPersons]);
  const totalOverload = useMemo(() => filteredPersons.filter(p => p.activeTasks >= 7).length, [filteredPersons]);

  // Legend: unique departments in filtered persons
  const deptLegend = useMemo(() => {
    const seen = new Set<string>();
    const items: { dept: string; color: string }[] = [];
    for (const p of filteredPersons) {
      if (!seen.has(p.department)) {
        seen.add(p.department);
        items.push({ dept: p.department, color: DEPARTMENT_COLORS[p.department] || '#94a3b8' });
      }
    }
    return items.slice(0, 5);
  }, [filteredPersons]);

  const totalWidth = columns.length * colWidth;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
        {/* Legend */}
        <div className="flex items-center gap-3 flex-wrap">
          {deptLegend.map(({ dept, color }) => (
            <span key={dept} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: color }} />
              {dept}
            </span>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-muted rounded-lg p-0.5">
            {(['weekly', 'monthly'] as ViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  viewMode === mode
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {mode === 'weekly' ? 'Haftalık' : 'Aylık'}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs font-semibold text-foreground min-w-[140px] text-center">{periodLabel}</span>
            <button
              onClick={() => navigate(1)}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Gantt table */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: `${176 + totalWidth}px` }}>
          {/* Header row */}
          <div className="flex items-stretch border-b border-border bg-muted/30 sticky top-0 z-10">
            <div className="w-44 shrink-0 px-3 py-2 border-r border-border/40">
              <span className="text-xs font-bold text-muted-foreground">Ekip Üyeleri</span>
            </div>
            <div className="flex" style={{ minWidth: `${totalWidth}px` }}>
              {columns.map((col, i) => (
                <div
                  key={i}
                  className="border-r border-border/30 text-center py-2 last:border-r-0"
                  style={{ width: `${colWidth}px`, flexShrink: 0 }}
                >
                  <p className="text-xs font-semibold text-foreground">{col.label}</p>
                  {col.subLabel && (
                    <p className="text-xs text-muted-foreground">{col.subLabel}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Member rows */}
          {filteredPersons.map(person => {
            const personTasks = TASKS.filter(t => t.assigneeId === person.id);
            return (
              <MemberRow
                key={person.id}
                person={person}
                tasks={personTasks}
                columns={columns}
                colWidth={colWidth}
              />
            );
          })}

          {filteredPersons.length === 0 && (
            <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
              Gösterilecek personel bulunamadı
            </div>
          )}
        </div>
      </div>

      {/* Summary footer */}
      <div className="flex items-center gap-6 px-4 py-3 border-t border-border bg-muted/10">
        <span className="text-sm font-bold text-foreground">
          <span className="text-primary tabular-nums">{totalBusy}</span>
          <span className="text-muted-foreground font-normal ml-1">Personel Meşgul</span>
        </span>
        <span className="text-sm font-bold text-foreground">
          <span className="text-emerald-500 tabular-nums">{totalAvailable}</span>
          <span className="text-muted-foreground font-normal ml-1">Personel Müsait</span>
        </span>
        <span className="text-sm font-bold text-foreground">
          <span className="text-orange-500 tabular-nums">{totalOverload}</span>
          <span className="text-muted-foreground font-normal ml-1">Kritik Aşırı Yük</span>
        </span>
      </div>
    </div>
  );
}
