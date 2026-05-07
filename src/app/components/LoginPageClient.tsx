'use client';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, Zap, Users, AlertTriangle, FolderKanban, ArrowRight, BookOpen } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import DepartmentBadge from '@/components/ui/DepartmentBadge';
import { PERSONS, type Person } from '@/data/mockData';

export default function LoginPageClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(PERSONS[0]);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
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

  const handleOnboarding = () => {
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#f5f5f7' }}>
      {/* Left Brand Panel */}
      <div
        className="hidden lg:flex lg:w-[460px] xl:w-[520px] flex-col relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0071e3 0%, #0051a2 100%)' }}
      >
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <AppLogo size={44} />
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">EliarArGe</h1>
              <p className="text-xs text-blue-100 font-medium">Eliar Elektrik A.Ş.</p>
            </div>
          </div>

          {/* Main copy */}
          <div className="mt-auto mb-auto pt-16">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <Zap size={12} />
              100 Kişilik Akıllı Ar-Ge Platformu
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Tüm Ar-Ge<br />
              <span className="text-blue-100">Operasyonunuz</span><br />
              Tek Ekranda
            </h2>
            <p className="text-blue-100 text-base leading-relaxed max-w-sm">
              Proje, görev, risk, dosya ve ekip yönetimini birbirine zincirlenmiş
              bir platformda yönetin. Her veri birbiriyle bağlantılı.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-auto">
            {[
              { icon: Users, label: 'Personel', value: '100' },
              { icon: FolderKanban, label: 'Proje', value: '22' },
              { icon: AlertTriangle, label: 'Açık Risk', value: '29' },
            ].map((stat) => {
              const StatIcon = stat.icon;
              return (
                <div key={`stat-${stat.label}`} className="bg-white/15 border border-white/20 rounded-2xl p-4 backdrop-blur-sm">
                  <StatIcon size={20} className="text-white mb-2 opacity-80" />
                  <p className="text-2xl font-bold text-white tabular-nums">{stat.value}</p>
                  <p className="text-xs text-blue-100 mt-0.5">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <AppLogo size={36} />
            <span className="font-bold text-lg text-foreground">EliarArGe</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-1">Demo Girişi</h2>
            <p className="text-sm" style={{ color: '#6e6e73' }}>
              Bir kullanıcı seçin ve platforma giriş yapın.
            </p>
          </div>

          {/* User Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground mb-1.5">
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
                      <p className="text-sm font-semibold text-foreground truncate">{selectedPerson.name}</p>
                      <p className="text-xs truncate" style={{ color: '#6e6e73' }}>{selectedPerson.title} · {selectedPerson.activeProjects} aktif proje</p>
                    </div>
                    <DepartmentBadge department={selectedPerson.department} size="sm" />
                  </>
                ) : (
                  <span className="text-sm" style={{ color: '#6e6e73' }}>Kullanıcı seçin...</span>
                )}
                <ChevronDown size={16} style={{ color: '#6e6e73' }} className={`shrink-0 transition-transform duration-150 ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute top-full left-0 right-0 mt-1.5 rounded-2xl overflow-hidden animate-scale-in z-50"
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
                            <p className="text-sm font-medium text-foreground truncate">{person.name}</p>
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

          <button
            type="button"
            onClick={handleOnboarding}
            className="w-full flex items-center justify-center gap-2 font-semibold py-2.5 rounded-xl transition-all duration-150 active:scale-95 mt-2"
            style={{
              background: '#f5f5f7',
              color: '#3a3a3c',
              border: '1px solid #d2d2d7',
            }}
          >
            <BookOpen size={16} />
            <span>Rol Tanımlarını Gör (Onboarding)</span>
          </button>

          <p className="text-center text-xs mt-4" style={{ color: '#6e6e73' }}>
            Bu bir demo ortamıdır — kimlik doğrulama gerekmez.
          </p>
        </div>
      </div>
    </div>
  );
}