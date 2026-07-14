'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { LockAnimation, CycleTimer } from './LockAnimation'
import {
  Home, History, Gift, User, Bell, ChevronRight, ChevronLeft, Lock, Unlock,
  CheckCircle2, Clock, AlertTriangle, Star, Zap, Shield, WashingMachine,
  Phone, MessageCircle, X, Plus, Minus, QrCode, Bluetooth, CreditCard,
  Settings, ArrowRight, Check, Trophy, Flame, TrendingUp
} from 'lucide-react'
import { MACHINES } from '@/lib/data'

type Screen =
  | 'home' | 'machine-select' | 'cycle-select' | 'payment' | 'locking' | 'active-cycle'
  | 'cycle-complete' | 'unlock' | 'pickup' | 'rewards' | 'profile' | 'history'

/**
 * Map internal machine status to what a customer should see.
 * Overdue is an operational concern — customers see it as "in-use" so they
 * don't try to interact with a machine pending pickup.
 * Alert/offline machines are shown as unavailable.
 */
type CustomerMachineStatus = 'available' | 'in-use' | 'offline'

function toCustomerStatus(status: string): CustomerMachineStatus {
  if (status === 'available') return 'available'
  if (status === 'offline' || status === 'alert') return 'offline'
  return 'in-use' // covers: in-use, overdue, locked, reserved
}

// Price map derived from the machines API response — keyed by machine number
const MACHINE_PRICE: Record<string, number> = {
  'W-01': 4.50, 'W-02': 4.50, 'W-03': 4.50, 'W-04': 5.25, 'W-05': 4.50, 'W-06': 4.50,
  'D-01': 3.75, 'D-02': 3.75, 'D-03': 3.75, 'D-04': 4.25, 'D-05': 3.75, 'D-06': 3.75,
}

// Derived from MACHINES — customer-safe view, no overdue status exposed
const CUSTOMER_MACHINES = MACHINES.map(m => ({
  id: m.id,
  number: m.number,
  type: m.type,
  status: toCustomerStatus(m.status),
  price: MACHINE_PRICE[m.number] ?? (m.type === 'washer' ? 4.50 : 3.75),
}))

const ACHIEVEMENTS = [
  { id: 'first', label: 'First Secure Pickup', icon: Shield, earned: true, tokens: 50 },
  { id: 'ten', label: '10 On-Time Pickups', icon: CheckCircle2, earned: true, tokens: 100 },
  { id: 'streak30', label: '30-Day Streak', icon: Flame, earned: true, tokens: 300 },
  { id: 'champ', label: 'Security Champion', icon: Trophy, earned: true, tokens: 500 },
  { id: 'community', label: 'Community Hero', icon: Star, earned: false, tokens: 1000 },
]

const REWARDS = [
  { id: 'r1', label: 'Free Wash Cycle', tokens: 500, icon: '🫧' },
  { id: 'r2', label: 'Free Dry Cycle', tokens: 400, icon: '☀️' },
  { id: 'r3', label: '$2 Off Premium Cycle', tokens: 200, icon: '💸' },
  { id: 'r4', label: 'Exclusive Member Discount', tokens: 750, icon: '🎁' },
]

function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <div className="w-[375px] min-h-[780px] bg-background rounded-[2.5rem] shadow-2xl border-2 border-border overflow-hidden relative">
        {/* Status bar */}
        <div className="h-10 bg-card flex items-center justify-between px-6 pt-2">
          <span className="text-xs font-semibold text-foreground">9:41</span>
          <div className="w-24 h-5 bg-foreground/10 rounded-full" />
          <div className="flex items-center gap-1">
            <div className="w-4 h-2.5 border border-foreground/40 rounded-sm relative">
              <div className="absolute inset-0.5 right-1 bg-foreground/70 rounded-[1px]" />
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

function BottomNav({ active, onNav }: { active: Screen; onNav: (s: Screen) => void }) {
  const items = [
    { id: 'home' as Screen, icon: Home, label: 'Home' },
    { id: 'history' as Screen, icon: History, label: 'History' },
    { id: 'rewards' as Screen, icon: Gift, label: 'Rewards' },
    { id: 'profile' as Screen, icon: User, label: 'Profile' },
  ]
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border h-16 flex items-center">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = active === item.id
        return (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            className="flex-1 flex flex-col items-center gap-1 py-2"
            aria-label={item.label}
          >
            <Icon className={cn('w-5 h-5 transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')} />
            <span className={cn('text-[10px] font-medium transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')}>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

// ── Screen components ────────────────────────────────────────────────────────

function HomeScreen({ onNav }: { onNav: (s: Screen) => void }) {
  return (
    <div className="flex flex-col h-full pb-16 overflow-y-auto">
      {/* Header */}
      <div className="bg-sidebar px-5 pt-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sidebar-foreground/60 text-xs font-medium">Good afternoon,</p>
            <h1 className="text-sidebar-foreground font-bold text-lg leading-tight">Maria Santos</h1>
          </div>
          <button className="relative p-2 rounded-full bg-sidebar-accent" aria-label="Notifications">
            <Bell className="w-5 h-5 text-sidebar-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
          </button>
        </div>
        {/* Token card */}
        <div className="bg-primary rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span className="text-primary-foreground/80 text-xs font-medium">DrumTokens</span>
            </div>
            <span className="text-xs text-primary-foreground/60">12-day streak 🔥</span>
          </div>
          <p className="text-3xl font-bold text-primary-foreground">2,340</p>
          <div className="mt-3 bg-white/20 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-yellow-300 rounded-full" style={{ width: '68%' }} />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-primary-foreground/60">2,340 / 3,400 tokens to Free Wash</span>
            <span className="text-[10px] text-primary-foreground/60">68%</span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-5 -mt-3">
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4 mb-4">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onNav('machine-select')}
              className="flex flex-col items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors"
            >
              <Lock className="w-6 h-6 text-primary" />
              <span className="text-xs font-semibold text-foreground">Start Wash</span>
            </button>
            <button
              onClick={() => onNav('active-cycle')}
              className="flex flex-col items-center gap-2 p-3 bg-success/5 border border-success/20 rounded-xl hover:bg-success/10 transition-colors"
            >
              <Clock className="w-6 h-6 text-success" />
              <span className="text-xs font-semibold text-foreground">Active Cycle</span>
            </button>
          </div>
        </div>

        {/* Active cycle preview */}
        <div className="bg-card rounded-2xl border border-primary/20 shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-foreground">D-01 — Active</span>
            <span className="flex items-center gap-1 text-xs text-success font-medium">
              <Lock className="w-3 h-3" /> Secured
            </span>
          </div>
          <div className="flex items-center gap-4">
            <CycleTimer totalMinutes={45} elapsedMinutes={14} />
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">Dryer D-01</p>
              <p className="text-xs text-muted-foreground mb-2">Est. done 2:45 PM</p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => onNav('active-cycle')}
                  className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-medium"
                >
                  View
                </button>
                <button className="text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-lg font-medium">
                  Notify Me
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Achievements</h2>
            <button className="text-xs text-primary font-medium">View All</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {ACHIEVEMENTS.filter(a => a.earned).map(a => {
              const Icon = a.icon
              return (
                <div key={a.id} className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[9px] text-muted-foreground text-center w-14 leading-tight">{a.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function MachineSelectScreen({ onNav, onBack }: { onNav: (s: Screen) => void; onBack: () => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'washer' | 'dryer'>('all')
  const visible = filter === 'all' ? CUSTOMER_MACHINES : CUSTOMER_MACHINES.filter(m => m.type === filter)

  const statusColor = (s: CustomerMachineStatus) => ({
    available: 'bg-success/10 border-success/30 text-success',
    'in-use': 'bg-primary/10 border-primary/20 text-primary',
    offline: 'bg-muted border-border text-muted-foreground',
  }[s] ?? 'bg-muted border-border text-muted-foreground')

  return (
    <div className="flex flex-col h-full pb-16 overflow-y-auto">
      <div className="bg-sidebar px-5 pt-4 pb-4 flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-lg bg-sidebar-accent">
          <ChevronLeft className="w-4 h-4 text-sidebar-foreground" />
        </button>
        <div>
          <h1 className="text-sidebar-foreground font-bold">Select Machine</h1>
          <p className="text-sidebar-foreground/50 text-xs">SpinSpot — 123 Main St</p>
        </div>
      </div>

      <div className="px-5 pt-4">
        {/* Filter */}
        <div className="flex gap-2 mb-4">
          {(['all', 'washer', 'dryer'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={cn('flex-1 py-2 text-xs font-semibold rounded-xl transition-colors', filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
              {f === 'all' ? 'All' : f === 'washer' ? 'Washers' : 'Dryers'}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-3 mb-4 flex-wrap">
          {([['available', 'Available'], ['in-use', 'In Use'], ['offline', 'Unavailable']] as [CustomerMachineStatus, string][]).map(([s, l]) => (
            <span key={s} className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className={cn('w-2 h-2 rounded-full', {
                'bg-success': s === 'available',
                'bg-primary': s === 'in-use',
                'bg-muted-foreground': s === 'offline',
              })} />
              {l}
            </span>
          ))}
        </div>

        {/* Machine grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {visible.map(m => {
            const isSelectable = m.status === 'available'
            const isSelected = selected === m.id
            return (
              <button
                key={m.id}
                disabled={!isSelectable}
                onClick={() => setSelected(m.id)}
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all',
                  isSelected ? 'border-primary bg-primary/10 shadow-md' : statusColor(m.status),
                  !isSelectable && 'opacity-50 cursor-not-allowed'
                )}
              >
                <WashingMachine className={cn('w-7 h-7', {
                  'text-success': m.status === 'available',
                  'text-primary': m.status === 'in-use',
                  'text-muted-foreground': m.status === 'offline',
                })} />
                <span className="text-xs font-bold text-foreground">{m.number}</span>
                <span className="text-[10px] capitalize text-muted-foreground leading-none">
                  {m.status === 'in-use' ? 'In Use' : m.status === 'offline' ? 'Unavailable' : 'Available'}
                </span>
              </button>
            )
          })}
        </div>

        {selected && (
          <div className="bg-card rounded-2xl border border-border p-4 mb-4 animate-slide-up">
            {(() => {
              const sel = visible.find(m => m.id === selected)
              return (
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-foreground">{sel?.number} — {sel?.type === 'dryer' ? 'Dryer' : 'Washer'}</p>
                    <p className="text-xs text-muted-foreground">Standard {sel?.type === 'dryer' ? 'dry' : 'wash'} cycle</p>
                  </div>
                  <p className="text-lg font-bold text-foreground">${(sel?.price ?? 0).toFixed(2)}</p>
                </div>
              )
            })()}
            <button
              onClick={() => onNav('cycle-select')}
              className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              Select Cycle <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function CycleSelectScreen({ onNav, onBack }: { onNav: (s: Screen) => void; onBack: () => void }) {
  const [selected, setSelected] = useState('normal')
  const cycles = [
    { id: 'quick', label: 'Quick Wash', duration: '25 min', price: 3.50, desc: 'Lightly soiled items' },
    { id: 'normal', label: 'Normal Wash', duration: '40 min', price: 4.50, desc: 'Everyday laundry' },
    { id: 'heavy', label: 'Heavy Duty', duration: '55 min', price: 5.25, desc: 'Towels & bedding' },
    { id: 'delicate', label: 'Delicate', duration: '30 min', price: 4.00, desc: 'Gentle fabrics' },
  ]
  const sel = cycles.find(c => c.id === selected)!
  return (
    <div className="flex flex-col h-full pb-16 overflow-y-auto">
      <div className="bg-sidebar px-5 pt-4 pb-4 flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-lg bg-sidebar-accent">
          <ChevronLeft className="w-4 h-4 text-sidebar-foreground" />
        </button>
        <div>
          <h1 className="text-sidebar-foreground font-bold">Select Cycle</h1>
          <p className="text-sidebar-foreground/50 text-xs">Washer W-03</p>
        </div>
      </div>
      <div className="px-5 pt-4 flex flex-col gap-3">
        {cycles.map(c => (
          <button key={c.id} onClick={() => setSelected(c.id)} className={cn('flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left', selected === c.id ? 'border-primary bg-primary/5' : 'border-border bg-card')}>
            <div>
              <p className="font-semibold text-foreground text-sm">{c.label}</p>
              <p className="text-xs text-muted-foreground">{c.desc} · {c.duration}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-foreground">${c.price.toFixed(2)}</p>
              {selected === c.id && <Check className="w-4 h-4 text-primary ml-auto mt-1" />}
            </div>
          </button>
        ))}
        <button
          onClick={() => onNav('payment')}
          className="w-full mt-2 bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2"
        >
          Continue — ${sel.price.toFixed(2)} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function PaymentScreen({ onNav, onBack }: { onNav: (s: Screen) => void; onBack: () => void }) {
  const [loading, setLoading] = useState(false)
  const handlePay = () => {
    setLoading(true)
    setTimeout(() => onNav('locking'), 1400)
  }
  return (
    <div className="flex flex-col h-full pb-16 overflow-y-auto">
      <div className="bg-sidebar px-5 pt-4 pb-4 flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-lg bg-sidebar-accent">
          <ChevronLeft className="w-4 h-4 text-sidebar-foreground" />
        </button>
        <h1 className="text-sidebar-foreground font-bold">Payment</h1>
      </div>
      <div className="px-5 pt-4 flex flex-col gap-4">
        {/* Order summary */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Order Summary</h2>
          <div className="flex justify-between mb-2 text-sm"><span className="text-muted-foreground">Washer W-03 — Normal Wash</span><span className="font-medium text-foreground">$4.50</span></div>
          <div className="flex justify-between mb-2 text-sm"><span className="text-muted-foreground">Tax</span><span className="font-medium text-foreground">$0.36</span></div>
          <div className="border-t border-border pt-2 mt-2 flex justify-between"><span className="font-bold text-foreground">Total</span><span className="font-bold text-foreground">$4.86</span></div>
        </div>
        {/* Payment method */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Payment Method</h2>
          <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl">
            <CreditCard className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">Visa •••• 4242</p>
              <p className="text-xs text-muted-foreground">Expires 12/26</p>
            </div>
            <Check className="w-4 h-4 text-primary ml-auto" />
          </div>
        </div>
        {/* DrumToken discount */}
        <div className="bg-success/5 border border-success/20 rounded-2xl p-4 flex items-center gap-3">
          <Zap className="w-5 h-5 text-success" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">2,340 DrumTokens available</p>
            <p className="text-xs text-muted-foreground">Not enough for a free cycle yet (need 500 more)</p>
          </div>
        </div>
        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Processing...</span>
          ) : (
            <><Lock className="w-4 h-4" /> Pay & Lock Machine</>
          )}
        </button>
        <p className="text-center text-xs text-muted-foreground">Secured by DrumLatch · 256-bit encryption</p>
      </div>
    </div>
  )
}

function LockingScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [step, setStep] = useState(0)
  const steps = ['Payment confirmed', 'Connecting to W-03', 'Engaging DrumLatch', 'Machine secured']
  useState(() => {
    const timers = steps.map((_, i) => setTimeout(() => {
      setStep(i + 1)
      if (i === steps.length - 1) setTimeout(() => onNav('active-cycle'), 800)
    }, (i + 1) * 700))
    return () => timers.forEach(clearTimeout)
  })
  const done = step >= steps.length
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 gap-6">
      {done ? (
        <>
          <div className="flex flex-col items-center gap-4 animate-slide-up">
            <LockAnimation state="locked" size="xl" />
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground mb-1">Machine Secured</p>
              <p className="text-sm text-muted-foreground">Your laundry is securely protected until pickup.</p>
            </div>
            <div className="w-full bg-card rounded-2xl border border-border p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div><p className="text-xs text-muted-foreground">Machine</p><p className="font-bold text-foreground">W-03</p></div>
                <div><p className="text-xs text-muted-foreground">Lock Status</p><p className="font-bold text-success">Locked</p></div>
                <div><p className="text-xs text-muted-foreground">Cycle</p><p className="font-bold text-foreground">40 min</p></div>
                <div><p className="text-xs text-muted-foreground">Est. Done</p><p className="font-bold text-foreground">3:14 PM</p></div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <LockAnimation state="locking" size="xl" />
          <div className="text-center">
            <p className="text-xl font-bold text-foreground mb-1">Activating DrumLatch</p>
            <p className="text-sm text-muted-foreground">Please wait…</p>
          </div>
          <div className="w-full bg-card rounded-2xl border border-border p-4 flex flex-col gap-3">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={cn('w-5 h-5 rounded-full flex items-center justify-center shrink-0', {
                  'bg-success': i < step,
                  'bg-primary border-2 border-primary': i === step,
                  'bg-muted border-2 border-border': i > step,
                })}>
                  {i < step && <Check className="w-3 h-3 text-white" />}
                  {i === step && <span className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                </div>
                <span className={cn('text-sm', i < step ? 'text-success font-medium' : i === step ? 'text-foreground font-medium' : 'text-muted-foreground')}>{s}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ActiveCycleScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [showModal, setShowModal] = useState(false)
  return (
    <div className="flex flex-col h-full pb-16 overflow-y-auto">
      <div className="bg-sidebar px-5 pt-4 pb-5">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-sidebar-foreground font-bold text-lg">Dryer D-01</h1>
          <span className="flex items-center gap-1 text-xs text-success font-semibold bg-success/20 px-2 py-1 rounded-full">
            <Lock className="w-3 h-3" /> Secured
          </span>
        </div>
        <p className="text-sidebar-foreground/50 text-xs">SpinSpot · 123 Main St</p>
      </div>

      <div className="px-5 pt-4 flex flex-col gap-4">
        {/* Timer */}
        <div className="bg-card rounded-2xl border border-primary/20 p-6 flex flex-col items-center gap-4">
          <CycleTimer totalMinutes={45} elapsedMinutes={14} className="w-28 h-28" />
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">31 min remaining</p>
            <p className="text-sm text-muted-foreground">Estimated completion 2:45 PM</p>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-full rounded-full" style={{ width: '31%' }} />
          </div>
          <p className="text-xs text-muted-foreground">31% complete</p>
        </div>

        {/* Security status */}
        <div className="bg-success/5 border border-success/20 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-success" />
            <div>
              <p className="text-sm font-semibold text-foreground">Laundry Protected</p>
              <p className="text-xs text-muted-foreground">DrumLatch is actively securing your machine</p>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="bg-card rounded-2xl border border-border p-4 grid grid-cols-2 gap-4">
          <div><p className="text-xs text-muted-foreground">Machine</p><p className="font-bold text-foreground text-sm">D-01</p></div>
          <div><p className="text-xs text-muted-foreground">Lock Status</p><p className="font-bold text-success text-sm">Locked</p></div>
          <div><p className="text-xs text-muted-foreground">Cycle Type</p><p className="font-bold text-foreground text-sm">High Heat</p></div>
          <div><p className="text-xs text-muted-foreground">Grace Period</p><p className="font-bold text-foreground text-sm">10 min</p></div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <button className="flex items-center justify-between w-full p-4 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors">
            <span className="flex items-center gap-2.5 text-sm font-medium text-foreground">
              <Bell className="w-4 h-4 text-muted-foreground" /> Enable notifications
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="flex items-center justify-between w-full p-4 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors">
            <span className="flex items-center gap-2.5 text-sm font-medium text-foreground">
              <MessageCircle className="w-4 h-4 text-muted-foreground" /> Contact store
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center justify-between w-full p-4 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors">
            <span className="flex items-center gap-2.5 text-sm font-medium text-foreground">
              <AlertTriangle className="w-4 h-4 text-warning" /> Report issue
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground pb-2">Cannot unlock during active cycle. Contact staff for emergencies.</p>
      </div>

      {/* Notify modal */}
      {showModal && (
        <div className="fixed inset-0 bg-foreground/60 flex items-end z-50" onClick={() => setShowModal(false)}>
          <div className="w-full bg-card rounded-t-3xl p-5" onClick={e => e.stopPropagation()}>
            <div className="w-8 h-1 bg-muted rounded-full mx-auto mb-4" />
            <h3 className="font-bold text-foreground mb-4">Report an Issue</h3>
            {['Machine not starting', 'Payment error', 'Door issue', 'Missing laundry', 'Other'].map(opt => (
              <button key={opt} className="flex items-center gap-3 w-full py-3 border-b border-border last:border-0" onClick={() => setShowModal(false)}>
                <span className="text-sm text-foreground">{opt}</span>
              </button>
            ))}
            <button onClick={() => setShowModal(false)} className="w-full mt-3 py-3 bg-muted rounded-xl text-sm font-medium text-muted-foreground">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

function CycleCompleteScreen({ onNav }: { onNav: (s: Screen) => void }) {
  return (
    <div className="flex flex-col h-full pb-16 overflow-y-auto">
      <div className="bg-success px-5 pt-6 pb-8 flex flex-col items-center gap-3">
        <CheckCircle2 className="w-12 h-12 text-white" />
        <h1 className="text-white font-bold text-xl text-center">Your laundry is ready!</h1>
        <p className="text-white/70 text-sm text-center">Dryer D-01 has finished. Your machine remains locked until you unlock it.</p>
      </div>

      <div className="px-5 -mt-4 flex flex-col gap-4">
        {/* Grace period */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">Pickup Window</span>
            <span className="text-destructive font-bold text-lg">8:32</span>
          </div>
          <div className="bg-muted rounded-full h-2 mb-2">
            <div className="bg-warning h-full rounded-full" style={{ width: '83%' }} />
          </div>
          <p className="text-xs text-muted-foreground">10-min grace period · 1:32 used</p>
        </div>

        {/* Lock status */}
        <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
          <LockAnimation state="locked" size="md" />
          <div>
            <p className="font-bold text-foreground">Machine Locked</p>
            <p className="text-xs text-muted-foreground">Tap below to unlock · Identity required</p>
          </div>
        </div>

        {/* Actions */}
        <button onClick={() => onNav('unlock')} className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2">
          <Unlock className="w-4 h-4" /> Unlock Machine
        </button>
        <button className="w-full bg-card border border-border text-foreground font-semibold py-3.5 rounded-xl">
          I&apos;m Heading There
        </button>
        <button className="w-full bg-card border border-border text-muted-foreground font-medium py-3 rounded-xl text-sm">
          Need More Time
        </button>

        {/* Earnings */}
        <div className="bg-success/5 border border-success/20 rounded-2xl p-4 flex items-center gap-3">
          <Zap className="w-5 h-5 text-success" />
          <div>
            <p className="text-sm font-semibold text-foreground">+60 DrumTokens earned!</p>
            <p className="text-xs text-muted-foreground">On-time pickup bonus · Streak day 13</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function RewardsScreen() {
  const tokens = 2340
  return (
    <div className="flex flex-col h-full pb-16 overflow-y-auto">
      <div className="bg-sidebar px-5 pt-4 pb-6">
        <h1 className="text-sidebar-foreground font-bold text-lg mb-4">Rewards</h1>
        <div className="bg-primary rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-300" />
            <span className="text-primary-foreground/80 text-xs font-medium">Your DrumTokens</span>
          </div>
          <p className="text-3xl font-bold text-primary-foreground">{tokens.toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-2">
            <Flame className="w-3.5 h-3.5 text-orange-300" />
            <span className="text-primary-foreground/70 text-xs">12-day on-time streak</span>
          </div>
        </div>
      </div>
      <div className="px-5 pt-4 flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Redeem Rewards</h2>
        {REWARDS.map(r => {
          const canRedeem = tokens >= r.tokens
          return (
            <div key={r.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
              <div className="text-2xl">{r.icon}</div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.tokens} DrumTokens</p>
              </div>
              <button className={cn('text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors', canRedeem ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground cursor-not-allowed')}>
                {canRedeem ? 'Redeem' : `Need ${r.tokens - tokens} more`}
              </button>
            </div>
          )
        })}
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-2">Achievements</h2>
        {ACHIEVEMENTS.map(a => {
          const Icon = a.icon
          return (
            <div key={a.id} className={cn('bg-card border rounded-2xl p-4 flex items-center gap-4', a.earned ? 'border-primary/20' : 'border-border opacity-60')}>
              <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0', a.earned ? 'bg-primary/10' : 'bg-muted')}>
                <Icon className={cn('w-5 h-5', a.earned ? 'text-primary' : 'text-muted-foreground')} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">{a.label}</p>
                <p className="text-xs text-muted-foreground">+{a.tokens} DrumTokens</p>
              </div>
              {a.earned && <Check className="w-4 h-4 text-success" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ProfileScreen() {
  return (
    <div className="flex flex-col h-full pb-16 overflow-y-auto">
      <div className="bg-sidebar px-5 pt-4 pb-6 flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">MS</div>
        <div className="text-center">
          <h1 className="text-sidebar-foreground font-bold text-lg">Maria Santos</h1>
          <p className="text-sidebar-foreground/50 text-xs">Member since March 2024</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-sidebar-foreground font-bold text-lg">47</p>
            <p className="text-sidebar-foreground/50 text-xs">Visits</p>
          </div>
          <div className="w-px bg-sidebar-border" />
          <div className="text-center">
            <p className="text-sidebar-foreground font-bold text-lg">97%</p>
            <p className="text-sidebar-foreground/50 text-xs">On-Time</p>
          </div>
          <div className="w-px bg-sidebar-border" />
          <div className="text-center">
            <p className="text-sidebar-foreground font-bold text-lg">$285</p>
            <p className="text-sidebar-foreground/50 text-xs">Total Spent</p>
          </div>
        </div>
      </div>
      <div className="px-5 pt-4 flex flex-col gap-3">
        {[
          { label: 'Payment Methods', icon: CreditCard },
          { label: 'Notifications', icon: Bell },
          { label: 'Security & Privacy', icon: Shield },
          { label: 'Bluetooth Devices', icon: Bluetooth },
          { label: 'Settings', icon: Settings },
        ].map(item => {
          const Icon = item.icon
          return (
            <button key={item.label} className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors">
              <Icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground flex-1 text-left">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Pre-auth screens ────────────────────────────────────────────────────────

type AuthStep = 'landing' | 'phone' | 'verify' | 'name' | 'payment-setup' | 'ready'

function PreAuthFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<AuthStep>('landing')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [firstName, setFirstName] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  const advance = (next: AuthStep) => {
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep(next) }, 900)
  }

  if (step === 'landing') {
    return (
      <div className="flex flex-col h-full justify-between px-6 py-8">
        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-lg">
            <svg width="40" height="44" viewBox="0 0 20 22" fill="none">
              <path d="M5 10V7C5 4.24 7.24 2 10 2C12.76 2 15 4.24 15 7V10" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <rect x="2" y="10" width="16" height="10" rx="3" fill="white" />
              <circle cx="10" cy="15" r="1.5" fill="oklch(0.45 0.18 255)" />
              <rect x="9.25" y="15.5" width="1.5" height="2.5" rx="0.5" fill="oklch(0.45 0.18 255)" />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">DrumLatch</h1>
            <p className="text-muted-foreground text-sm mt-1.5">Secure your laundry. Every cycle.</p>
          </div>
          <div className="flex flex-col gap-3 w-full mt-4">
            {[
              { icon: Shield, label: 'Anti-theft machine locking' },
              { icon: Zap, label: 'Earn DrumTokens on every cycle' },
              { icon: Bell, label: 'Real-time pickup reminders' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3">
                <Icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={() => setStep('phone')} className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl">
            Get Started
          </button>
          <button onClick={() => setStep('phone')} className="w-full bg-card border border-border text-foreground font-semibold py-3.5 rounded-xl text-sm">
            Sign In
          </button>
          <p className="text-center text-[10px] text-muted-foreground px-4">
            By continuing you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    )
  }

  if (step === 'phone') {
    return (
      <div className="flex flex-col h-full px-6 pt-8 gap-6">
        <button onClick={() => setStep('landing')} className="self-start p-1.5 rounded-lg bg-muted">
          <ChevronLeft className="w-4 h-4 text-foreground" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-foreground">Enter your phone number</h2>
          <p className="text-sm text-muted-foreground mt-1">We&apos;ll send you a verification code</p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 bg-card border-2 border-primary rounded-xl px-4 py-3">
            <span className="text-sm font-semibold text-muted-foreground">+1</span>
            <div className="w-px h-4 bg-border" />
            <input
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="(555) 000-0000"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              inputMode="tel"
              aria-label="Phone number"
            />
          </div>
          <p className="text-[10px] text-muted-foreground">Standard message rates may apply. Pre-authorization of $1.00 is required to activate your account.</p>
        </div>
        <button
          onClick={() => advance('verify')}
          disabled={phone.length < 7 || loading}
          className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Send Code'}
        </button>
      </div>
    )
  }

  if (step === 'verify') {
    return (
      <div className="flex flex-col h-full px-6 pt-8 gap-6">
        <button onClick={() => setStep('phone')} className="self-start p-1.5 rounded-lg bg-muted">
          <ChevronLeft className="w-4 h-4 text-foreground" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-foreground">Verify your number</h2>
          <p className="text-sm text-muted-foreground mt-1">Enter the 6-digit code sent to {phone || '(555) 201-4488'}</p>
        </div>
        <div className="flex gap-2 justify-center">
          {[0,1,2,3,4,5].map(i => (
            <div key={i} className={cn('w-11 h-14 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-colors', i < code.length ? 'border-primary bg-primary/5 text-foreground' : 'border-border bg-card text-muted-foreground')}>
              {code[i] ?? '·'}
            </div>
          ))}
        </div>
        {/* Numeric keypad */}
        <div className="grid grid-cols-3 gap-3 mt-2">
          {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k, i) => (
            <button key={i} onClick={() => {
              if (k === '⌫') setCode(c => c.slice(0,-1))
              else if (k !== '' && code.length < 6) setCode(c => c + k)
            }} className={cn('h-12 rounded-xl text-lg font-semibold transition-colors', k === '' ? '' : 'bg-card border border-border text-foreground hover:bg-muted active:scale-95')}>
              {k}
            </button>
          ))}
        </div>
        <button
          onClick={() => advance('name')}
          disabled={code.length < 6 || loading}
          className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Verify'}
        </button>
        <button onClick={() => advance('verify')} className="text-center text-xs text-primary font-medium">Resend code</button>
      </div>
    )
  }

  if (step === 'name') {
    return (
      <div className="flex flex-col h-full px-6 pt-8 gap-6">
        <button onClick={() => setStep('verify')} className="self-start p-1.5 rounded-lg bg-muted">
          <ChevronLeft className="w-4 h-4 text-foreground" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-foreground">What&apos;s your name?</h2>
          <p className="text-sm text-muted-foreground mt-1">This is how we&apos;ll greet you in the app</p>
        </div>
        <input
          className="bg-card border-2 border-primary rounded-xl px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground w-full"
          placeholder="First name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          aria-label="First name"
        />
        <button
          onClick={() => advance('payment-setup')}
          disabled={firstName.trim().length < 2 || loading}
          className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Continue'}
        </button>
      </div>
    )
  }

  if (step === 'payment-setup') {
    return (
      <div className="flex flex-col h-full px-6 pt-8 gap-5 pb-8 overflow-y-auto">
        <button onClick={() => setStep('name')} className="self-start p-1.5 rounded-lg bg-muted">
          <ChevronLeft className="w-4 h-4 text-foreground" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-foreground">Add a payment method</h2>
          <p className="text-sm text-muted-foreground mt-1">Required to use DrumLatch machines. A $1.00 pre-authorization hold will be placed and immediately released.</p>
        </div>

        {/* Pre-auth explanation */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3">
          <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Why a pre-authorization?</p>
            <p className="text-xs text-muted-foreground mt-1">We hold $1.00 to verify your card is valid and to protect machines from misuse. The hold is released immediately — you are only charged for cycles you start.</p>
          </div>
        </div>

        {/* Card fields */}
        <div className="flex flex-col gap-3">
          <div className="bg-card border-2 border-border focus-within:border-primary rounded-xl px-4 py-3 transition-colors">
            <p className="text-[10px] text-muted-foreground mb-1">Card number</p>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-muted-foreground shrink-0" />
              <input className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" placeholder="1234 5678 9012 3456" inputMode="numeric" aria-label="Card number" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-card border-2 border-border focus-within:border-primary rounded-xl px-4 py-3 transition-colors">
              <p className="text-[10px] text-muted-foreground mb-1">Expiry</p>
              <input className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" placeholder="MM / YY" inputMode="numeric" aria-label="Expiry date" />
            </div>
            <div className="flex-1 bg-card border-2 border-border focus-within:border-primary rounded-xl px-4 py-3 transition-colors">
              <p className="text-[10px] text-muted-foreground mb-1">CVV</p>
              <input className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" placeholder="•••" inputMode="numeric" aria-label="CVV" />
            </div>
          </div>
        </div>

        {/* Consent */}
        <button
          onClick={() => setAgreed(a => !a)}
          className="flex items-start gap-3 text-left"
          aria-pressed={agreed}
        >
          <div className={cn('w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors', agreed ? 'bg-primary border-primary' : 'border-border bg-card')}>
            {agreed && <Check className="w-3 h-3 text-white" />}
          </div>
          <p className="text-xs text-muted-foreground">I authorize DrumLatch to place a $1.00 pre-authorization hold on my card to verify my account. This hold will be released immediately.</p>
        </button>

        <button
          onClick={() => advance('ready')}
          disabled={!agreed || loading}
          className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <><Lock className="w-4 h-4" /> Authorize & Continue</>}
        </button>
        <p className="text-center text-[10px] text-muted-foreground">Secured by DrumLatch · 256-bit encryption</p>
      </div>
    )
  }

  // step === 'ready'
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 gap-6">
      <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10 text-success" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">You&apos;re all set!</h2>
        <p className="text-sm text-muted-foreground mt-1.5">Pre-authorization confirmed. Your account is ready to use.</p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-4 w-full">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Pre-auth hold</span>
          <span className="font-semibold text-foreground">$1.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Status</span>
          <span className="font-semibold text-success">Released</span>
        </div>
      </div>
      <button onClick={onComplete} className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2">
        Start Using DrumLatch <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

// ── Root Customer App ────────────────────────────────────────────────────────

export function CustomerApp() {
  const [authed, setAuthed] = useState(false)
  const [screen, setScreen] = useState<Screen>('home')
  const [history, setHistory] = useState<Screen[]>(['home'])

  const navigate = (s: Screen) => {
    setHistory(h => [...h, s])
    setScreen(s)
  }
  const goBack = () => {
    if (history.length > 1) {
      const prev = history[history.length - 2]
      setHistory(h => h.slice(0, -1))
      setScreen(prev)
    }
  }

  const mainScreens: Screen[] = ['home', 'history', 'rewards', 'profile']

  return (
    <div className="min-h-screen bg-muted flex flex-col items-center py-8 px-4">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-foreground">Customer Mobile App</h2>
        <p className="text-sm text-muted-foreground mt-1">Tap through the complete customer experience</p>
      </div>

      {/* Screen tabs */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center max-w-2xl">
        {/* Pre-auth tab */}
        <button
          onClick={() => setAuthed(false)}
          className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', !authed ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground')}
        >
          Pre-Auth Flow
        </button>
        {/* App screen tabs — only shown once authed */}
        {authed && ([
          ['home', 'Home'],
          ['machine-select', 'Select Machine'],
          ['cycle-select', 'Choose Cycle'],
          ['payment', 'Payment'],
          ['locking', 'Lock Animation'],
          ['active-cycle', 'Active Cycle'],
          ['cycle-complete', 'Cycle Complete'],
          ['rewards', 'Rewards'],
          ['profile', 'Profile'],
        ] as [Screen, string][]).map(([s, label]) => (
          <button
            key={s}
            onClick={() => { setHistory([s]); setScreen(s) }}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', screen === s ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground')}
          >
            {label}
          </button>
        ))}
      </div>

      <PhoneFrame>
        {!authed && <PreAuthFlow onComplete={() => setAuthed(true)} />}
        {authed && screen === 'home' && <HomeScreen onNav={navigate} />}
        {authed && screen === 'machine-select' && <MachineSelectScreen onNav={navigate} onBack={goBack} />}
        {authed && screen === 'cycle-select' && <CycleSelectScreen onNav={navigate} onBack={goBack} />}
        {authed && screen === 'payment' && <PaymentScreen onNav={navigate} onBack={goBack} />}
        {authed && screen === 'locking' && <LockingScreen onNav={navigate} />}
        {authed && screen === 'active-cycle' && <ActiveCycleScreen onNav={navigate} />}
        {authed && screen === 'cycle-complete' && <CycleCompleteScreen onNav={navigate} />}
        {authed && screen === 'unlock' && (
          <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
            <LockAnimation state="unlocking" size="xl" />
            <div className="text-center animate-slide-up">
              <p className="text-2xl font-bold text-foreground mb-2">Machine Unlocked!</p>
              <p className="text-sm text-muted-foreground mb-6">Please remove your laundry</p>
              <button onClick={() => navigate('pickup')} className="bg-success text-white font-bold px-8 py-3.5 rounded-xl">Laundry Removed</button>
            </div>
          </div>
        )}
        {authed && screen === 'pickup' && (
          <div className="flex flex-col items-center justify-center h-full gap-6 px-6 pb-16">
            <CheckCircle2 className="w-16 h-16 text-success" />
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground mb-2">Pickup Complete!</p>
              <p className="text-sm text-muted-foreground mb-1">Thank you for picking up on time.</p>
              <p className="text-sm font-semibold text-success">+60 DrumTokens earned!</p>
            </div>
            <button onClick={() => navigate('home')} className="bg-primary text-primary-foreground font-bold px-8 py-3.5 rounded-xl">Back to Home</button>
          </div>
        )}
        {authed && screen === 'rewards' && <RewardsScreen />}
        {authed && screen === 'profile' && <ProfileScreen />}
        {authed && screen === 'history' && (
          <div className="flex flex-col h-full pb-16">
            <div className="bg-sidebar px-5 pt-4 pb-4">
              <h1 className="text-sidebar-foreground font-bold text-lg">Wash History</h1>
            </div>
            <div className="px-4 pt-4 flex flex-col gap-3 overflow-y-auto">
              {[
                { date: 'Today', machine: 'D-01', type: 'High Heat Dry', cost: '$3.75', tokens: '+45', status: 'active' },
                { date: 'Today', machine: 'W-03', type: 'Normal Wash', cost: '$4.50', tokens: '+60', status: 'complete' },
                { date: 'Jul 12', machine: 'D-02', type: 'Low Heat Dry', cost: '$3.75', tokens: '+45', status: 'complete' },
                { date: 'Jul 12', machine: 'W-01', type: 'Heavy Duty', cost: '$5.25', tokens: '+60', status: 'complete' },
                { date: 'Jul 10', machine: 'W-05', type: 'Quick Wash', cost: '$3.50', tokens: '+30', status: 'complete' },
              ].map((item, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <WashingMachine className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{item.machine} — {item.type}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{item.cost}</p>
                    <p className="text-xs text-success">{item.tokens} tokens</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Bottom nav only on main screens */}
        {mainScreens.includes(screen) && <BottomNav active={screen} onNav={navigate} />}
      </PhoneFrame>
    </div>
  )
}
