'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { PROJECTS, PERSONS, TASKS, DEPARTMENT_COLORS, type Project, type Department } from '@/data/mockData';
import { FolderKanban, Search, Filter, ChevronRight, CheckCircle, AlertTriangle, Clock, X } from 'lucide-react';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  Aktif: '#22c55e',
  Tamamlandı: '#3b7dd8',
  Beklemede: '#eab308',
  Kritik: '#ef4444',
};

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

function ProjectModal({ project, onClose }: ProjectModalProps) {
  const lead = PERSONS.find(p => p.id === project.leadId);
  const projectTasks = TASKS.filter(t => t.projectId === project.id);
  const statusColor = STATUS_COLORS[project.status] || '#94a3b8';

  const phases = [
    { name: 'Planlama', start: 0, width: 20, color: '#3b7dd8', done: true },
    { name: 'Geliştirme', start: 20, width: 35, color: '#8b5cf6', done: project.completionPercent > 30 },
    { name: 'Test', start: 55, width: 25, color: '#f97316', done: project.completionPercent > 60 },
    { name: 'Teslim', start: 80, width: 20, color: '#22c55e', done: project.completionPercent > 85 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
              >
                {project.status}
              </span>
              {project.department.map(d => (
                <span
                  key={d}
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${DEPARTMENT_COLORS[d]}20`, color: DEPARTMENT_COLORS[d] }}
                >
                  {d}
                </span>
              ))}
            </div>
            <h2 className="text-xl font-bold text-foreground">{project.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">Lider: {lead?.name} · {project.startDate} → {project.endDate}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">Genel İlerleme</span>
              <span className="text-lg font-bold" style={{ color: statusColor }}>{project.completionPercent}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${project.completionPercent}%`, backgroundColor: statusColor }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Aktif Görev', value: project.activeTaskCount, color: '#f97316' },
              { label: 'Tamamlanan', value: project.completedTaskCount, color: '#22c55e' },
              { label: 'Toplam', value: project.totalTaskCount, color: '#3b7dd8' },
            ].map(s => (
              <div key={s.label} className="bg-muted/30 rounded-xl p-4 text-center border border-border">
                <p className="text-2xl font-bold tabular-nums" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Gantt-style phases */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Faz Planı (Gantt)</h3>
            <div className="space-y-2">
              {phases.map(phase => (
                <div key={phase.name} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20 shrink-0">{phase.name}</span>
                  <div className="flex-1 h-6 bg-muted rounded relative overflow-hidden">
                    <div
                      className="absolute h-full rounded flex items-center px-2 transition-all duration-500"
                      style={{
                        left: `${phase.start}%`,
                        width: `${phase.width}%`,
                        backgroundColor: phase.done ? phase.color : `${phase.color}60`,
                      }}
                    >
                      <span className="text-xs font-semibold text-white truncate">{phase.name}</span>
                    </div>
                  </div>
                  {phase.done ? (
                    <CheckCircle size={14} className="text-green-400 shrink-0" />
                  ) : (
                    <Clock size={14} className="text-muted-foreground shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          {projectTasks.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Görevler</h3>
              <div className="space-y-2">
                {projectTasks.map(task => {
                  const assignee = PERSONS.find(p => p.id === task.assigneeId);
                  return (
                    <Link
                      key={task.id}
                      href="/task-kanban-panel"
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/60 border border-transparent hover:border-border transition-all cursor-pointer"
                      onClick={onClose}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{task.name}</p>
                        <p className="text-xs text-muted-foreground">{assignee?.name} · {task.endDate}</p>
                      </div>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full ml-2 shrink-0"
                        style={{
                          backgroundColor: task.status === 'Gecikmiş' ? '#ef444420' : task.status === 'Tamamlandı' ? '#22c55e20' : '#3b7dd820',
                          color: task.status === 'Gecikmiş' ? '#ef4444' : task.status === 'Tamamlandı' ? '#22c55e' : '#3b7dd8',
                        }}
                      >
                        {task.status}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Tümü');
  const [deptFilter, setDeptFilter] = useState<string>('Tümü');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const statuses = ['Tümü', 'Aktif', 'Kritik', 'Beklemede', 'Tamamlandı'];
  const departments: string[] = ['Tümü', 'Elektronik', 'Yazılım', 'Mekanik', 'Test', 'Otomasyon', 'Donanım', 'Saha', 'Ürün', 'Lojistik', 'Destek'];

  const filtered = PROJECTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'Tümü' || p.status === statusFilter;
    const matchDept = deptFilter === 'Tümü' || p.department.includes(deptFilter as Department);
    return matchSearch && matchStatus && matchDept;
  });

  return (
    <AppLayout currentPath="/projects">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Projeler</h1>
            <p className="text-muted-foreground text-sm mt-1">{PROJECTS.length} proje · 2025–2026 Dönemi</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-ghost text-sm flex items-center gap-2">
              <Filter size={14} /> Filtrele
            </button>
            <button className="btn-primary text-sm flex items-center gap-2">
              📊 Rapor Al
            </button>
          </div>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                statusFilter === s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {s}
              {s !== 'Tümü' && (
                <span className="ml-1.5 opacity-70">
                  {PROJECTS.filter(p => p.status === s).length}
                </span>
              )}
            </button>
          ))}
          <div className="relative ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Proje ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-muted/40 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all w-48"
            />
          </div>
        </div>

        {/* Department filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-muted-foreground mr-1">Departman:</span>
          {departments.map(d => (
            <button
              key={`dept-filter-${d}`}
              onClick={() => setDeptFilter(d)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
              style={{
                background: deptFilter === d
                  ? (d === 'Tümü' ? '#0071e3' : DEPARTMENT_COLORS[d as Department])
                  : '#f5f5f7',
                color: deptFilter === d ? 'white' : '#6e6e73',
                border: `1px solid ${deptFilter === d ? 'transparent' : '#e8e8ed'}`,
              }}
            >
              {d}
              {d !== 'Tümü' && (
                <span className="ml-1 opacity-80">
                  {PROJECTS.filter(p => p.department.includes(d as Department)).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(project => {
            const lead = PERSONS.find(p => p.id === project.leadId);
            const statusColor = STATUS_COLORS[project.status] || '#94a3b8';
            const projectTasks = TASKS.filter(t => t.projectId === project.id);
            const delayed = projectTasks.filter(t => t.status === 'Gecikmiş').length;

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="card-base p-5 cursor-pointer hover:scale-[1.01] hover:shadow-elevated transition-all duration-200 border border-border hover:border-primary/30 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
                      >
                        {project.status}
                      </span>
                      {project.department.slice(0, 2).map(d => (
                        <span
                          key={d}
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${DEPARTMENT_COLORS[d]}20`, color: DEPARTMENT_COLORS[d] }}
                        >
                          {d}
                        </span>
                      ))}
                      {project.department.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{project.department.length - 2}</span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-foreground">{project.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Lider: {lead?.name}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">İlerleme</span>
                    <span className="text-sm font-bold" style={{ color: statusColor }}>{project.completionPercent}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${project.completionPercent}%`, backgroundColor: statusColor }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { label: 'Aktif', value: project.activeTaskCount, color: '#f97316' },
                    { label: 'Bitti', value: project.completedTaskCount, color: '#22c55e' },
                    { label: 'Toplam', value: project.totalTaskCount, color: '#3b7dd8' },
                    { label: 'Gecikmiş', value: delayed, color: delayed > 0 ? '#ef4444' : '#94a3b8' },
                  ].map(s => (
                    <div key={s.label} className="text-center bg-muted/30 rounded-lg py-2">
                      <p className="text-sm font-bold tabular-nums" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{project.startDate} → {project.endDate}</span>
                  </div>
                  {delayed > 0 && (
                    <div className="flex items-center gap-1 text-red-400">
                      <AlertTriangle size={12} />
                      <span className="text-xs font-semibold">{delayed} gecikmiş</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <FolderKanban size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Proje bulunamadı</p>
          </div>
        )}
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </AppLayout>
  );
}
