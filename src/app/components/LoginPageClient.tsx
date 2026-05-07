'use client';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, ArrowRight, Zap, Users, FolderKanban, AlertTriangle, ChevronRight } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import DepartmentBadge from '@/components/ui/DepartmentBadge';
import { PERSONS, PERSONNEL_ROLES, type Person } from '@/data/mockData';

function RoleChip({ role, isExpanded, onClick }: { role: typeof PERSONNEL_ROLES[0]; isExpanded: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl transition-all duration-200"
      style={{
        background: isExpanded ? role.bgColor : 'rgba(255,255,255,0.08)',
        border: `1px solid ${isExpanded ? role.color + '60' : 'rgba(255,255,255,0.12)'}`,
        padding: isExpanded ? '12px 14px' : '9px 14px',
      }}
    >
      <div className="flex items-center gap-2.5">
        <span className="text-lg shrink-0">{role.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <p
              className="text-sm font-semibold truncate"
              style={{ color: isExpanded ? role.color : '#ffffff' }}
            >
              {role.title}
            </p>
            <ChevronRight
              size={14}
              className="shrink-0 transition-transform duration-200"
              style={{
                color: isExpanded ? role.color : 'rgba(255,255,255,0.5)',
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
              }}
            />
          </div>
          {!isExpanded && (
            <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {role.subtitle}
            </p>
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="mt-2 pl-8">
          <p className="text-xs font-medium mb-1" style={{ color: role.color }}>{role.subtitle}</p>
          <p className="text-xs leading-relaxed" style={{ color: '#3a3a3c' }}>{role.description}</p>
        </div>
      )}
    </button>
  );
}

export default function LoginPageClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(PERSONS[0]);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredPersons = PERSONS.filter(p =>
    p.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    p.department.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    p.title.toLowerCase().includes(userSearchQuery.toLowerCase())
  ).slice(0, 12);

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
    setUserDropdownOpen(false);
    setUserSearchQuery('');
  };

  const handleEnter = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    router.push('/dashboard');
  };

  const handleRoleToggle = (key: string) => {
    setExpandedRole(prev => (prev === key ? null : key));
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#f5f5f7' }}>
      {/* Left Brand + Roles Panel */}
      <div
        className="hidden lg:flex lg:w-[480px] xl:w-[540px] flex-col relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0a1628 0%, #0d2247 50%, #0a3060 100%)' }}
      >
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glow */}
        <div
          className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #0071e3 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }}
        />

        <div className="relative z-10 flex flex-col h-full p-8 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <AppLogo size={40} />
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">EliarArGe</h1>
              <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Eliar Elektrik A.Ş.</p>
            </div>
          </div>

          {/* Headline */}
          <div className="mt-8 shrink-0">
            <div
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
              style={{ background: 'rgba(0,113,227,0.25)', color: '#60a5fa', border: '1px solid rgba(0,113,227,0.3)' }}
            >
              <Zap size={11} />
              100 Kişilik Akıllı Ar-Ge Platformu
            </div>
            <h2 className="text-2xl font-bold text-white leading-snug mb-2">
              Tüm Ar-Ge Operasyonunuz<br />
              <span style={{ color: '#60a5fa' }}>Tek Ekranda</span>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Proje, görev, risk ve ekip yönetimini birbirine bağlı bir platformda yönetin.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mt-5 shrink-0">
            {[
              { icon: Users, label: 'Personel', value: '100' },
              { icon: FolderKanban, label: 'Proje', value: '22' },
              { icon: AlertTriangle, label: 'Açık Risk', value: '29' },
            ].map((stat) => {
              const StatIcon = stat.icon;
              return (
                <div
                  key={`stat-${stat.label}`}
                  className="rounded-xl p-3 text-center"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <StatIcon size={16} className="mx-auto mb-1" style={{ color: 'rgba(255,255,255,0.6)' }} />
                  <p className="text-lg font-bold text-white tabular-nums">{stat.value}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Roles section */}
          <div className="mt-6 flex-1">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              Personel Rolleri
            </p>
            <div className="space-y-1.5">
              {PERSONNEL_ROLES.map(role => (
                <RoleChip
                  key={role.key}
                  role={role}
                  isExpanded={expandedRole === role.key}
                  onClick={() => handleRoleToggle(role.key)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <AppLogo size={36} />
            <span className="font-bold text-lg" style={{ color: '#1d1d1f' }}>EliarArGe</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#1d1d1f' }}>Platforma Giriş</h2>
            <p className="text-sm" style={{ color: '#6e6e73' }}>
              Bir kullanıcı seçin ve platforma giriş yapın.
            </p>
          </div>

          {/* Mobile: compact role list */}
          <div className="lg:hidden mb-6 rounded-2xl overflow-hidden" style={{ border: '1px solid #e8e8ed' }}>
            <div className="px-4 py-3" style={{ background: '#f5f5f7', borderBottom: '1px solid #e8e8ed' }}>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#6e6e73' }}>Personel Rolleri</p>
            </div>
            <div className="divide-y" style={{ background: '#ffffff' }}>
              {PERSONNEL_ROLES.map(role => (
                <div key={`mobile-role-${role.key}`} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="text-base">{role.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#1d1d1f' }}>{role.title}</p>
                    <p className="text-xs truncate" style={{ color: '#6e6e73' }}>{role.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>
              Kullanıcı Seç
            </label>
            <p className="text-xs mb-2" style={{ color: '#6e6e73' }}>100 personelden birini seçin veya arayın</p>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150"
                style={{
                  background: '#ffffff',
                  border: '1px solid #d2d2d7',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}
              >
                {selectedPerson ? (
                  <>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ backgroundColor: '#e8f0fb', color: '#0071e3' }}
                    >
                      {selectedPerson.avatar.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: '#1d1d1f' }}>{selectedPerson.name}</p>
                      <p className="text-xs truncate" style={{ color: '#6e6e73' }}>{selectedPerson.title} · {selectedPerson.activeProjects} aktif proje</p>
                    </div>
                    <DepartmentBadge department={selectedPerson.department} size="sm" />
                  </>
                ) : (
                  <span className="text-sm" style={{ color: '#6e6e73' }}>Kullanıcı seçin...</span>
                )}
                <ChevronDown
                  size={16}
                  style={{ color: '#6e6e73' }}
                  className={`shrink-0 transition-transform duration-150 ${userDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute top-full left-0 right-0 mt-1.5 rounded-2xl overflow-hidden z-50"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #d2d2d7',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  }}
                >
                  <div className="p-2 border-b" style={{ borderColor: '#e8e8ed' }}>
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6e6e73' }} />
                      <input
                        type="text"
                        placeholder="İsim, departman, unvan..."
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        className="w-full rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none"
                        style={{
                          background: '#f5f5f7',
                          border: '1px solid #d2d2d7',
                          color: '#1d1d1f',
                        }}
                      />
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredPersons.length === 0 ? (
                      <p className="text-center text-sm py-6" style={{ color: '#6e6e73' }}>Sonuç bulunamadı</p>
                    ) : (
                      filteredPersons.map((person) => (
                        <button
                          key={`person-opt-${person.id}`}
                          type="button"
                          onClick={() => handlePersonSelect(person)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all duration-100 text-left ${selectedPerson?.id === person.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                        >
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ backgroundColor: '#e8f0fb', color: '#0071e3' }}
                          >
                            {person.avatar.slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: '#1d1d1f' }}>{person.name}</p>
                            <p className="text-xs truncate" style={{ color: '#6e6e73' }}>{person.title}</p>
                          </div>
                          <DepartmentBadge department={person.department} size="sm" />
                        </button>
                      ))
                    )}
                  </div>
                  <div className="px-3 py-2 border-t" style={{ borderColor: '#e8e8ed', background: '#f5f5f7' }}>
                    <p className="text-xs" style={{ color: '#6e6e73' }}>Toplam {PERSONS.length} personel · {filteredPersons.length} gösteriliyor</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enter Button */}
          <button
            type="button"
            onClick={handleEnter}
            disabled={isLoading || !selectedPerson}
            className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl transition-all duration-150 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: isLoading ? '#0051a2' : '#0071e3',
              minHeight: '48px',
              boxShadow: '0 2px 8px rgba(0,113,227,0.3)',
            }}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Giriş yapılıyor...</span>
              </>
            ) : (
              <>
                <span>Platforma Giriş Yap</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <p className="text-center text-xs mt-4" style={{ color: '#6e6e73' }}>
            Bu bir demo ortamıdır — kimlik doğrulama gerekmez.
          </p>
        </div>
      </div>
    </div>
  );
}