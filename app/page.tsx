'use client'

import { useState } from 'react'
import { Smartphone, Monitor, Shield, ChevronRight } from 'lucide-react'
import { CustomerApp } from '@/components/drumlatch/CustomerApp'
import { ManagerDashboard } from '@/components/drumlatch/ManagerDashboard'
import { AdminPlatform } from '@/components/drumlatch/AdminPlatform'
import { cn } from '@/lib/utils'

type View = 'customer' | 'manager' | 'admin'

const VIEWS = [
  {
    id: 'customer' as const,
    label: 'Customer App',
    description: 'Mobile customer experience',
    icon: Smartphone,
    tag: 'Mobile',
  },
  {
    id: 'manager' as const,
    label: 'Owner Dashboard',
    description: 'Laundromat operations',
    icon: Monitor,
    tag: 'Desktop',
  },
  {
    id: 'admin' as const,
    label: 'Super Admin',
    description: 'DrumLatch internal console',
    icon: Shield,
    tag: 'Internal',
  },
]

export default function Home() {
  const [view, setView] = useState<View>('customer')

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-50 bg-sidebar border-b border-sidebar-border shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <img src="/images/drumlatch-logo.png" alt="DrumLatch" className="h-5 w-auto" />
            <span className="hidden sm:inline text-xs text-sidebar-foreground/40 font-medium">Platform Preview</span>
          </div>

          {/* View switcher */}
          <nav className="flex items-center gap-1" role="tablist" aria-label="Platform views">
            {VIEWS.map((v) => {
              const Icon = v.icon
              const active = view === v.id
              return (
                <button
                  key={v.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setView(v.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden />
                  <span className="hidden sm:inline">{v.label}</span>
                  <span className={cn(
                    'hidden md:inline text-[10px] px-1.5 py-0.5 rounded-full font-semibold tracking-wide',
                    active ? 'bg-white/20 text-white' : 'bg-sidebar-accent text-sidebar-foreground/50'
                  )}>
                    {v.tag}
                  </span>
                </button>
              )
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" aria-hidden />
            <span className="text-xs text-sidebar-foreground/50 hidden sm:inline">Live Demo</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {view === 'customer' && <CustomerApp />}
        {view === 'manager' && <ManagerDashboard />}
        {view === 'admin' && <AdminPlatform />}
      </main>
    </div>
  )
}
