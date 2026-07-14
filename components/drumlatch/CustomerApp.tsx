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

type AuthStep =
  | 'landing'          // hero + social sign-in options
  | 'method'           // choose phone or email
  | 'phone'            // phone input
  | 'email'            // email + password input
  | 'verify'           // OTP for phone
  | 'email-verify'     // magic-link / email OTP confirmation
  | 'name'             // first name
  | 'payment-setup'    // Apple Pay / Google Pay / Card
  | 'ready'            // success

type PaymentTab = 'apple' | 'google' | 'card'

// SVG logos for social + wallet providers — inlined to avoid external deps
function GoogleLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function AppleLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  )
}

function ApplePayMark() {
  return (
    <svg width="52" height="22" viewBox="0 0 52 22" fill="none" aria-label="Apple Pay">
      <path d="M10.2 3.6c-.6.7-1.6 1.3-2.5 1.2-.1-1 .4-2 .9-2.7.6-.7 1.7-1.3 2.5-1.3.1 1-.3 2-.9 2.8zm.9 1.4c-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.7C3.5 5.2 2 6.3 1.2 7.8c-1.6 2.8-.4 7 1.1 9.3.8 1.1 1.7 2.4 2.9 2.3 1.1-.1 1.6-.7 2.9-.7 1.3 0 1.7.7 2.9.7 1.2-.1 2-1.2 2.8-2.3.8-1.2 1.2-2.4 1.2-2.5-.1 0-2.3-.9-2.4-3.5 0-2.2 1.8-3.2 1.9-3.3-.9-1.4-2.5-1.8-3.4-1.8z" fill="currentColor"/>
      <text x="18" y="15" fontFamily="system-ui, -apple-system, sans-serif" fontSize="10" fontWeight="600" fill="currentColor">Pay</text>
    </svg>
  )
}

function GooglePayMark() {
  return (
    <svg width="58" height="22" viewBox="0 0 58 22" aria-label="Google Pay">
      <text x="0" y="15" fontFamily="'Google Sans', system-ui, sans-serif" fontSize="13" fontWeight="500" fill="#4285F4">G</text>
      <text x="9" y="15" fontFamily="'Google Sans', system-ui, sans-serif" fontSize="13" fontWeight="500" fill="#34A853">o</text>
      <text x="17" y="15" fontFamily="'Google Sans', system-ui, sans-serif" fontSize="13" fontWeight="500" fill="#FBBC05">o</text>
      <text x="25" y="15" fontFamily="'Google Sans', system-ui, sans-serif" fontSize="13" fontWeight="500" fill="#4285F4">g</text>
      <text x="33" y="15" fontFamily="'Google Sans', system-ui, sans-serif" fontSize="13" fontWeight="500" fill="#34A853">l</text>
      <text x="37" y="15" fontFamily="'Google Sans', system-ui, sans-serif" fontSize="13" fontWeight="500" fill="#EA4335">e</text>
      <text x="44" y="15" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="500" fill="currentColor"> Pay</text>
    </svg>
  )
}

function PreAuthFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<AuthStep>('landing')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [firstName, setFirstName] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [payTab, setPayTab] = useState<PaymentTab>('apple')
  // Track which flow triggered verify (phone vs social-via-phone)
  const [verifyBack, setVerifyBack] = useState<AuthStep>('phone')

  const advance = (next: AuthStep) => {
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep(next) }, 800)
  }

  const Spinner = () => (
    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  )

  const BackBtn = ({ to }: { to: AuthStep }) => (
    <button onClick={() => setStep(to)} className="self-start p-1.5 rounded-lg bg-muted" aria-label="Go back">
      <ChevronLeft className="w-4 h-4 text-foreground" />
    </button>
  )

  // ── Landing ──────────────────────────────────────────────────────────────
  if (step === 'landing') {
    return (
      <div className="flex flex-col h-full justify-between px-6 py-8 overflow-y-auto">
        <div className="flex flex-col items-center gap-5 mt-4">
          <div className="w-[72px] h-[72px] rounded-3xl bg-primary flex items-center justify-center shadow-lg">
            <svg width="36" height="40" viewBox="0 0 20 22" fill="none" aria-hidden="true">
              <path d="M5 10V7C5 4.24 7.24 2 10 2C12.76 2 15 4.24 15 7V10" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <rect x="2" y="10" width="16" height="10" rx="3" fill="white" />
              <circle cx="10" cy="15" r="1.5" fill="oklch(0.45 0.18 255)" />
              <rect x="9.25" y="15.5" width="1.5" height="2.5" rx="0.75" fill="oklch(0.45 0.18 255)" />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">DrumLatch</h1>
            <p className="text-muted-foreground text-sm mt-1">Secure your laundry. Every cycle.</p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-col gap-2.5 w-full">
            {[
              { icon: Shield, label: 'Anti-theft machine locking' },
              { icon: Zap, label: 'Earn DrumTokens every cycle' },
              { icon: Bell, label: 'Real-time pickup reminders' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-2.5">
                <Icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6">
          {/* Primary CTA */}
          <button
            onClick={() => setStep('method')}
            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl"
          >
            Get Started
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] text-muted-foreground">or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social sign-in row */}
          <div className="flex gap-3">
            <button
              onClick={() => advance('name')}
              className="flex-1 flex items-center justify-center gap-2 bg-card border border-border rounded-xl py-3 hover:bg-muted active:scale-95 transition-all"
              aria-label="Continue with Google"
            >
              <GoogleLogo size={18} />
              <span className="text-sm font-semibold text-foreground">Google</span>
            </button>
            <button
              onClick={() => advance('name')}
              className="flex-1 flex items-center justify-center gap-2 bg-card border border-border rounded-xl py-3 hover:bg-muted active:scale-95 transition-all"
              aria-label="Continue with Apple"
            >
              <AppleLogo size={18} />
              <span className="text-sm font-semibold text-foreground">Apple</span>
            </button>
          </div>

          {/* Sign in link */}
          <button
            onClick={() => setStep('method')}
            className="text-sm text-center text-muted-foreground"
          >
            Already have an account?{' '}
            <span className="text-primary font-semibold">Sign in</span>
          </button>

          <p className="text-center text-[10px] text-muted-foreground px-4 leading-relaxed">
            By continuing you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    )
  }

  // ── Method selector ───────────────────────────────────────────────────────
  if (step === 'method') {
    return (
      <div className="flex flex-col h-full px-6 pt-8 gap-6">
        <BackBtn to="landing" />
        <div>
          <h2 className="text-xl font-bold text-foreground">How do you want to sign up?</h2>
          <p className="text-sm text-muted-foreground mt-1">Choose how to create or access your account</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setStep('phone')}
            className="flex items-center gap-4 bg-card border-2 border-border hover:border-primary rounded-xl px-4 py-4 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Phone number</p>
              <p className="text-xs text-muted-foreground mt-0.5">We&apos;ll send a 6-digit verification code</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0" />
          </button>

          <button
            onClick={() => setStep('email')}
            className="flex items-center gap-4 bg-card border-2 border-border hover:border-primary rounded-xl px-4 py-4 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Email address</p>
              <p className="text-xs text-muted-foreground mt-0.5">Sign up or sign in with your email</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0" />
          </button>
        </div>

        {/* Social options also available here */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => advance('name')}
            className="flex-1 flex items-center justify-center gap-2 bg-card border border-border rounded-xl py-3 hover:bg-muted active:scale-95 transition-all"
            aria-label="Continue with Google"
          >
            <GoogleLogo size={16} />
            <span className="text-sm font-semibold text-foreground">Google</span>
          </button>
          <button
            onClick={() => advance('name')}
            className="flex-1 flex items-center justify-center gap-2 bg-card border border-border rounded-xl py-3 hover:bg-muted active:scale-95 transition-all"
            aria-label="Continue with Apple"
          >
            <AppleLogo size={16} />
            <span className="text-sm font-semibold text-foreground">Apple</span>
          </button>
        </div>
      </div>
    )
  }

  // ── Phone input ───────────────────────────────────────────────────────────
  if (step === 'phone') {
    return (
      <div className="flex flex-col h-full px-6 pt-8 gap-6">
        <BackBtn to="method" />
        <div>
          <h2 className="text-xl font-bold text-foreground">Enter your phone number</h2>
          <p className="text-sm text-muted-foreground mt-1">We&apos;ll text you a 6-digit code to verify</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 bg-card border-2 border-primary rounded-xl px-4 py-3.5">
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
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Standard message rates may apply. A $1.00 pre-authorization is required after signup to activate your account.
          </p>
        </div>
        <button
          onClick={() => { setVerifyBack('phone'); advance('verify') }}
          disabled={phone.length < 7 || loading}
          className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Spinner /> : 'Send Code'}
        </button>
      </div>
    )
  }

  // ── Email input ───────────────────────────────────────────────────────────
  if (step === 'email') {
    return (
      <div className="flex flex-col h-full px-6 pt-8 gap-6">
        <BackBtn to="method" />
        <div>
          <h2 className="text-xl font-bold text-foreground">Enter your email</h2>
          <p className="text-sm text-muted-foreground mt-1">We&apos;ll send a confirmation link to verify</p>
        </div>
        <div className="flex flex-col gap-3">
          <input
            className="bg-card border-2 border-primary rounded-xl px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground w-full"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            aria-label="Email address"
            inputMode="email"
          />
          <input
            className="bg-card border-2 border-border focus:border-primary rounded-xl px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground w-full transition-colors"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            aria-label="Password"
          />
          <p className="text-[10px] text-muted-foreground">
            Use 8+ characters with a mix of letters and numbers.
          </p>
        </div>
        <button
          onClick={() => advance('email-verify')}
          disabled={!email.includes('@') || password.length < 8 || loading}
          className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Spinner /> : 'Continue'}
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] text-muted-foreground">already have an account?</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <button
          onClick={() => advance('email-verify')}
          className="w-full bg-card border border-border text-foreground font-semibold py-3.5 rounded-xl text-sm"
        >
          Sign In with Email
        </button>
      </div>
    )
  }

  // ── Email verification notice ─────────────────────────────────────────────
  if (step === 'email-verify') {
    return (
      <div className="flex flex-col h-full px-6 pt-8 gap-6 items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <MessageCircle className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">Check your inbox</h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            We sent a confirmation link to<br />
            <span className="font-semibold text-foreground">{email || 'your@email.com'}</span>
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 w-full flex flex-col gap-2">
          <p className="text-xs text-muted-foreground text-center">Didn&apos;t receive it?</p>
          <button
            onClick={() => advance('email-verify')}
            className="text-sm text-primary font-semibold text-center"
          >
            Resend confirmation email
          </button>
        </div>
        <button
          onClick={() => advance('name')}
          className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2"
        >
          {loading ? <Spinner /> : <>I&apos;ve confirmed my email <ArrowRight className="w-4 h-4" /></>}
        </button>
        <button onClick={() => setStep('email')} className="text-xs text-muted-foreground">
          Wrong email? Go back
        </button>
      </div>
    )
  }

  // ── OTP verification ──────────────────────────────────────────────────────
  if (step === 'verify') {
    return (
      <div className="flex flex-col h-full px-6 pt-8 gap-6">
        <BackBtn to={verifyBack} />
        <div>
          <h2 className="text-xl font-bold text-foreground">Enter the code</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Sent to {phone || '(555) 201-4488'}
          </p>
        </div>
        <div className="flex gap-2 justify-center">
          {[0,1,2,3,4,5].map(i => (
            <div
              key={i}
              className={cn(
                'w-11 h-14 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-colors',
                i < code.length ? 'border-primary bg-primary/5 text-foreground' : 'border-border bg-card text-muted-foreground'
              )}
            >
              {code[i] ?? '·'}
            </div>
          ))}
        </div>
        {/* Numeric keypad */}
        <div className="grid grid-cols-3 gap-2.5">
          {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k, i) => (
            <button
              key={i}
              onClick={() => {
                if (k === '⌫') setCode(c => c.slice(0,-1))
                else if (k !== '' && code.length < 6) setCode(c => c + k)
              }}
              className={cn(
                'h-12 rounded-xl text-lg font-semibold transition-colors',
                k === '' ? '' : 'bg-card border border-border text-foreground hover:bg-muted active:scale-95'
              )}
            >
              {k}
            </button>
          ))}
        </div>
        <button
          onClick={() => advance('name')}
          disabled={code.length < 6 || loading}
          className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Spinner /> : 'Verify'}
        </button>
        <button onClick={() => advance('verify')} className="text-center text-xs text-primary font-medium">
          Resend code
        </button>
      </div>
    )
  }

  // ── Name ──────────────────────────────────────────────────────────────────
  if (step === 'name') {
    return (
      <div className="flex flex-col h-full px-6 pt-8 gap-6">
        <BackBtn to="method" />
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
          {loading ? <Spinner /> : 'Continue'}
        </button>
      </div>
    )
  }

  // ── Payment setup ─────────────────────────────────────────────────────────
  if (step === 'payment-setup') {
    return (
      <div className="flex flex-col h-full px-6 pt-8 gap-5 pb-8 overflow-y-auto">
        <BackBtn to="name" />
        <div>
          <h2 className="text-xl font-bold text-foreground">Add a payment method</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Required to use DrumLatch. A $1.00 pre-authorization hold will be placed and immediately released.
          </p>
        </div>

        {/* Pre-auth explanation */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3">
          <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Why a pre-authorization?</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              We hold $1.00 to verify your payment method is valid and protect machines from misuse. The hold is released immediately — you are only charged for cycles you start.
            </p>
          </div>
        </div>

        {/* Payment method tabs */}
        <div className="flex rounded-xl bg-muted p-1 gap-1" role="tablist">
          {([
            { id: 'apple' as PaymentTab, label: 'Apple Pay' },
            { id: 'google' as PaymentTab, label: 'Google Pay' },
            { id: 'card' as PaymentTab, label: 'Card' },
          ]).map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={payTab === t.id}
              onClick={() => setPayTab(t.id)}
              className={cn(
                'flex-1 py-2 rounded-lg text-xs font-semibold transition-colors',
                payTab === t.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Apple Pay panel */}
        {payTab === 'apple' && (
          <div className="flex flex-col gap-4">
            <div className="bg-foreground rounded-2xl px-5 py-5 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <AppleLogo size={20} />
                <span className="text-background text-base font-semibold tracking-tight">Pay</span>
              </div>
              <p className="text-background/70 text-xs text-center leading-relaxed">
                Use Face ID or Touch ID to authorize the $1.00 pre-authorization hold securely.
              </p>
              <button
                onClick={() => { setAgreed(true); advance('ready') }}
                className="w-full bg-background text-foreground font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm mt-1"
              >
                <AppleLogo size={16} />
                Authorize with Apple Pay
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              Apple Pay uses your device biometrics — your card number is never shared with DrumLatch.
            </p>
          </div>
        )}

        {/* Google Pay panel */}
        {payTab === 'google' && (
          <div className="flex flex-col gap-4">
            <div className="bg-card border border-border rounded-2xl px-5 py-5 flex flex-col items-center gap-3">
              <div className="flex items-center gap-1.5">
                <GoogleLogo size={20} />
                <span className="text-foreground text-base font-semibold">Pay</span>
              </div>
              <p className="text-muted-foreground text-xs text-center leading-relaxed">
                Authorize the $1.00 pre-authorization hold using your Google Pay wallet.
              </p>
              <button
                onClick={() => { setAgreed(true); advance('ready') }}
                className="w-full bg-[#1a73e8] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm mt-1"
              >
                <GoogleLogo size={16} />
                Authorize with Google Pay
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              Google Pay keeps your payment info private. Your actual card details are never shared.
            </p>
          </div>
        )}

        {/* Card panel */}
        {payTab === 'card' && (
          <div className="flex flex-col gap-3">
            <div className="bg-card border-2 border-border focus-within:border-primary rounded-xl px-4 py-3 transition-colors">
              <p className="text-[10px] text-muted-foreground mb-1.5">Card number</p>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                  aria-label="Card number"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 bg-card border-2 border-border focus-within:border-primary rounded-xl px-4 py-3 transition-colors">
                <p className="text-[10px] text-muted-foreground mb-1.5">Expiry</p>
                <input
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="MM / YY"
                  inputMode="numeric"
                  aria-label="Expiry date"
                />
              </div>
              <div className="flex-1 bg-card border-2 border-border focus-within:border-primary rounded-xl px-4 py-3 transition-colors">
                <p className="text-[10px] text-muted-foreground mb-1.5">CVV</p>
                <input
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="•••"
                  inputMode="numeric"
                  aria-label="CVV"
                />
              </div>
            </div>

            {/* Consent */}
            <button
              onClick={() => setAgreed(a => !a)}
              className="flex items-start gap-3 text-left mt-1"
              aria-pressed={agreed}
            >
              <div className={cn('w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors', agreed ? 'bg-primary border-primary' : 'border-border bg-card')}>
                {agreed && <Check className="w-3 h-3 text-white" />}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                I authorize DrumLatch to place a $1.00 pre-authorization hold on my card. The hold will be released immediately.
              </p>
            </button>

            <button
              onClick={() => advance('ready')}
              disabled={!agreed || loading}
              className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Spinner /> : <><Lock className="w-4 h-4" /> Authorize &amp; Continue</>}
            </button>
          </div>
        )}

        <p className="text-center text-[10px] text-muted-foreground">Secured by DrumLatch · 256-bit encryption</p>
      </div>
    )
  }

  // ── Ready ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 gap-6">
      <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10 text-success" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">You&apos;re all set!</h2>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
          Pre-authorization confirmed. Your account is ready to use.
        </p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-4 w-full">
        <div className="flex justify-between text-sm mb-2.5">
          <span className="text-muted-foreground">Pre-auth hold</span>
          <span className="font-semibold text-foreground">$1.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Status</span>
          <span className="font-semibold text-success">Released</span>
        </div>
      </div>
      <button
        onClick={onComplete}
        className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2"
      >
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
