'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { UserRole } from '@/lib/types';
import { api, removeAuthToken } from '@/lib/api-client';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    async function fetchUser() {
      try {
        const profile = await api.getMe();
        setUser(profile);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    router.push('/login');
  };

  // Mock fallback removed as we fetch real data now
  // currentRole based on path remains for nav logic
  const currentRole = pathname.startsWith('/doctor') ? 'doctor' : 'patient';

  const patientNavItems = [
    {
      name: 'Dashboard',
      href: '/patient/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'AI Detection',
      href: '/patient/detection',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      name: 'Consultations',
      href: '/patient/consultations',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      name: 'History',
      href: '/patient/history',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
  ];

  const doctorNavItems = [
    {
      name: 'Dashboard',
      href: '/doctor/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Patient Requests',
      href: '/doctor/requests',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      )
    },
    {
      name: 'Profile',
      href: '/doctor/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
  ];

  const navItems = currentRole === 'patient' ? patientNavItems : doctorNavItems;

  return (
    <div className="flex relative min-h-screen bg-background font-body text-foreground selection:bg-primary/20">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-md lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-surface-low border-r border-foreground/5 transform transition-all duration-500 ease-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0 shadow-2xl shadow-primary/10' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-8 h-24">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-on-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                </svg>
              </div>
              <span className="text-xl font-heading font-extrabold tracking-tight">
                SkinCare<span className="text-primary truncate">AI</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-hide">
            <p className="px-4 text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] mb-4">Main Menu</p>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-300 group ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 translate-x-1'
                      : 'text-foreground/40 hover:text-foreground/80 hover:bg-foreground/5'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className={`mr-3 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-on-primary' : 'text-primary/60'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-6 mx-4 mb-6 glass-card rounded-2xl border border-foreground/5 bg-foreground/5">
            <div className="flex items-center gap-3">
              <div className="relative">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User'}
                    className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-xs border border-secondary/30">
                    {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('') : 'U'}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-primary border-2 border-surface-low rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">
                  {user?.name || 'Authorized User'}
                </p>
                <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">
                  {user?.role || currentRole} Portal
                </p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full mt-4 py-2 text-[10px] font-bold text-foreground/30 hover:text-red-400 uppercase tracking-widest text-center transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-20 glass-card border-b border-foreground/5 sticky top-0 z-30 flex items-center px-6 lg:px-8">
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-surface-highest/50 border border-foreground/10 text-foreground hover:bg-foreground/5 transition-all"
              aria-label="Open navigation menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex flex-col">
              <h1 className="text-lg lg:text-xl font-heading font-extrabold text-foreground tracking-tight">
                {navItems.find(item => item.href === pathname)?.name || 'Clinical Overview'}
              </h1>
              <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest -mt-0.5">
                Session Active • Local Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="flex items-center gap-3">
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide">
          <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}