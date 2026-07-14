'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, Shield, BarChart3, Settings, WashingMachine,
  Bell, Lock, Unlock, AlertTriangle, WifiOff, Clock, CheckCircle2, TrendingUp,
  ChevronRight, Search, Filter, MoreHorizontal, RefreshCw, Download,
  Zap, Activity, DollarSign, Eye, Edit, Ban, UserCheck, ChevronDown,
  ArrowUpRight, ArrowDownRight, Flame, Star, Phone, MessageCircle,
  UserCog, Package, FileText, Menu, X, LifeBuoy
} from 'lucide-react'
import { KpiCard } from './KpiCard'
import { StatusBadge, SeverityBadge } from './StatusBadge'
import { MACHINES, CUSTOMERS, SECURITY_EVENTS, STAFF, REVENUE_DATA, UTILIZATION_DATA, Machine } from '@/lib/data'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts'

type DashTab = 'overview' | 'machines' | 'customers' | 'security' | 'revenue' | 'staff' | 'settings'

const DASH_TABS: { id: DashTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'machines', label: 'Machines', icon: WashingMachine },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'revenue', label: 'Revenue', icon: BarChart3 },
  { id: 'staff', label: 'Staff', icon: UserCog },
  { id: 'settings', label: 'Settings', icon: Settings },
]

function MachineMapCard({ machines }: { machines: Machine[] }) {
  const [selected, setSelected] = useState<string | null>(null)
  const sel = machines.find(m => m.id === selected)

  const dotColor = (status: string) => ({
    available: '#22c55e',
    'in-use': 'oklch(0.45 0.18 255)',
    overdue: '#f59e0b',
    offline: '#94a3b8',
    alert: '#ef4444',
    locked: 'oklch(0.45 0.18 255)',
    reserved: '#94a3b8',
  }[status] || '#94a3b8')

  return (
    <div className="bg-card rounded-xl border border-border p-5 col-span-full xl:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Machine Map</h3>
        <div className="flex items-center gap-3">
          {[['available', '#22c55e', 'Available'], ['in-use', 'oklch(0.45 0.18 255)', 'In Use'], ['overdue', '#f59e0b', 'Overdue'], ['offline', '#94a3b8', 'Offline'], ['alert', '#ef4444', 'Alert']].map(([s, c, l]) => (
            <span key={s} className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full" style={{ background: c }} />{l}
            </span>
          ))}
        </div>
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr auto' }}>
        <div className="bg-muted/50 rounded-xl p-4 overflow-x-auto">
          {/* Washers row */}
          <div className="mb-1">
            <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wider">Washers</p>
            <div className="flex gap-3 flex-wrap">
              {machines.filter(m => m.type === 'washer').map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelected(selected === m.id ? null : m.id)}
                  className={cn('flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all min-w-[64px]', selected === m.id ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/50')}
                >
                  <div className="w-3 h-3 rounded-full" style={{ background: dotColor(m.status) }} />
                  <span className="text-xs font-bold text-foreground">{m.number}</span>
                  <span className="text-[9px] text-muted-foreground capitalize">{m.status === 'in-use' ? 'In Use' : m.status}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wider">Dryers</p>
            <div className="flex gap-3 flex-wrap">
              {machines.filter(m => m.type === 'dryer').map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelected(selected === m.id ? null : m.id)}
                  className={cn('flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all min-w-[64px]', selected === m.id ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/50')}
                >
                  <div className="w-3 h-3 rounded-full" style={{ background: dotColor(m.status) }} />
                  <span className="text-xs font-bold text-foreground">{m.number}</span>
                  <span className="text-[9px] text-muted-foreground capitalize">{m.status === 'in-use' ? 'In Use' : m.status}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Detail panel */}
        <div className="w-56 shrink-0">
          {sel ? (
            <div className="bg-muted/50 rounded-xl p-4 h-full flex flex-col gap-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <p className="font-bold text-foreground">{sel.number}</p>
                <StatusBadge status={sel.status} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-card rounded-lg p-2">
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-semibold text-foreground capitalize">{sel.type}</p>
                </div>
                <div className="bg-card rounded-lg p-2">
                  <p className="text-muted-foreground">Lock</p>
                  <p className="font-semibold text-foreground capitalize">{sel.lockStatus}</p>
                </div>
                <div className="bg-card rounded-lg p-2">
                  <p className="text-muted-foreground">Battery</p>
                  <p className={cn('font-semibold', sel.battery < 20 ? 'text-destructive' : 'text-foreground')}>{sel.battery}%</p>
                </div>
                <div className="bg-card rounded-lg p-2">
                  <p className="text-muted-foreground">Signal</p>
                  <p className={cn('font-semibold capitalize', sel.connectivity === 'online' ? 'text-success' : sel.connectivity === 'degraded' ? 'text-warning' : 'text-destructive')}>{sel.connectivity}</p>
                </div>
              </div>
              {sel.customer && (
                <div className="bg-card rounded-lg p-2 text-xs">
                  <p className="text-muted-foreground">Customer</p>
                  <p className="font-semibold text-foreground">{sel.customer}</p>
                </div>
              )}
              {sel.cycleEnd && (
                <div className="bg-card rounded-lg p-2 text-xs">
                  <p className="text-muted-foreground">Est. Complete</p>
                  <p className="font-semibold text-foreground">{sel.cycleEnd}</p>
                </div>
              )}
              <button className="w-full text-xs bg-primary text-primary-foreground py-2 rounded-lg font-medium mt-auto">Manage</button>
            </div>
          ) : (
            <div className="bg-muted/30 rounded-xl p-4 h-full flex flex-col items-center justify-center text-center gap-2">
              <Eye className="w-6 h-6 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Click a machine to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Tab panels ───────────────────────────────────────────────────────────────

function OverviewPanel() {
  const active = MACHINES.filter(m => m.status === 'in-use').length
  const available = MACHINES.filter(m => m.status === 'available').length
  const overdue = MACHINES.filter(m => m.status === 'overdue').length
  const alerts = MACHINES.filter(m => m.status === 'alert' || m.status === 'offline').length

  return (
    <div className="flex flex-col gap-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="Active Cycles" value={active} change="+2 from 1hr ago" changeType="positive" icon={<Lock className="w-5 h-5" />} accent="brand" />
        <KpiCard title="Available" value={available} change="4 washers · 3 dryers" changeType="neutral" icon={<CheckCircle2 className="w-5 h-5" />} accent="success" />
        <KpiCard title="Overdue Pickups" value={overdue} change="James Kim 18 min late" changeType="negative" icon={<Clock className="w-5 h-5" />} accent="warning" />
        <KpiCard title="Alerts" value={alerts} change="1 offline · 1 tamper" changeType="negative" icon={<AlertTriangle className="w-5 h-5" />} accent="destructive" />
      </div>

      {/* Map + alerts row */}
      <div className="grid xl:grid-cols-3 gap-4">
        <MachineMapCard machines={MACHINES} />

        {/* Live alerts */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Live Alerts</h3>
            <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col gap-3">
            {SECURITY_EVENTS.filter(e => !e.resolved).map(e => (
              <div key={e.id} className={cn('p-3 rounded-xl border', {
                'bg-destructive/5 border-destructive/20': e.severity === 'critical' || e.severity === 'high',
                'bg-warning/5 border-warning/20': e.severity === 'medium',
                'bg-muted border-border': e.severity === 'low',
              })}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-foreground">{e.machineNumber}</span>
                  <SeverityBadge severity={e.severity} />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-1.5">{e.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">{e.timestamp}</span>
                  <button className="text-[10px] text-primary font-semibold hover:underline">Resolve</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue mini chart */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Revenue This Month</h3>
            <p className="text-sm text-muted-foreground mt-0.5">July 2025</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">$5,550</p>
            <p className="text-xs text-success flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +14.8% vs last month</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={REVENUE_DATA}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.45 0.18 255)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="oklch(0.45 0.18 255)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 240)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'oklch(0.5 0.02 250)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'oklch(0.5 0.02 250)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
            <Tooltip formatter={(v: number, name: string) => [`$${v}`, name === 'cycle' ? 'Cycles' : name === 'fees' ? 'Fees' : 'Rewards']} contentStyle={{ borderRadius: '0.5rem', border: '1px solid oklch(0.9 0.01 240)', fontSize: 12 }} />
            <Area type="monotone" dataKey="cycle" stroke="oklch(0.45 0.18 255)" fill="url(#revGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function MachinesPanel() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const filtered = MACHINES.filter(m => {
    if (filter !== 'all' && m.status !== filter) return false
    if (search && !m.number.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search machines..."
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'available', 'in-use', 'overdue', 'offline', 'alert'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize', filter === f ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground')}>
              {f === 'all' ? 'All' : f === 'in-use' ? 'In Use' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {['Machine', 'Type', 'Status', 'Lock', 'Customer', 'Est. Complete', 'Battery', 'Signal', 'Actions'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={m.id} className={cn('border-t border-border hover:bg-muted/30 transition-colors', i % 2 === 0 ? '' : 'bg-muted/10')}>
                <td className="px-4 py-3 text-sm font-bold text-foreground">{m.number}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground capitalize">{m.type}</td>
                <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                <td className="px-4 py-3">
                  {m.lockStatus === 'locked' ? <Lock className="w-4 h-4 text-primary" /> : m.lockStatus === 'unlocked' ? <Unlock className="w-4 h-4 text-success" /> : <AlertTriangle className="w-4 h-4 text-destructive" />}
                </td>
                <td className="px-4 py-3 text-sm text-foreground">{m.customer || '—'}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{m.cycleEnd || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full', m.battery > 50 ? 'bg-success' : m.battery > 20 ? 'bg-warning' : 'bg-destructive')} style={{ width: `${m.battery}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{m.battery}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={cn('text-xs font-medium capitalize', m.connectivity === 'online' ? 'text-success' : m.connectivity === 'degraded' ? 'text-warning' : 'text-destructive')}>{m.connectivity}</span>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1.5 hover:bg-muted rounded-lg transition-colors"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CustomersPanel() {
  const [search, setSearch] = useState('')
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers…" className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground"><Filter className="w-4 h-4" />Filter</button>
        <button className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground"><Download className="w-4 h-4" />Export</button>
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {['Customer', 'Visits', 'DrumTokens', 'Streak', 'On-Time %', 'Total Spent', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CUSTOMERS.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase())).map((c, i) => (
              <tr key={c.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">{c.name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-foreground">{c.visits}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-sm font-medium text-foreground"><Zap className="w-3 h-3 text-warning" />{c.drumTokens.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-sm font-medium text-foreground"><Flame className={cn('w-3 h-3', c.pickupStreak > 0 ? 'text-orange-400' : 'text-muted-foreground')} />{c.pickupStreak}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full', c.onTimeRate >= 90 ? 'bg-success' : c.onTimeRate >= 70 ? 'bg-warning' : 'bg-destructive')} style={{ width: `${c.onTimeRate}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{c.onTimeRate}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-foreground">${c.totalSpent.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', c.status === 'active' ? 'bg-success/10 text-success' : c.status === 'suspended' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive')}>{c.status}</span>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1.5 hover:bg-muted rounded-lg"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SecurityPanel() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-4">
        <KpiCard title="Active Alerts" value="3" changeType="negative" icon={<AlertTriangle className="w-5 h-5" />} accent="destructive" change="1 critical" />
        <KpiCard title="Resolved Today" value="2" changeType="positive" icon={<CheckCircle2 className="w-5 h-5" />} accent="success" change="All by staff" />
        <KpiCard title="Failed Unlocks" value="3" icon={<Lock className="w-5 h-5" />} accent="warning" change="Last: 2:28 PM" />
        <KpiCard title="Offline Devices" value="1" icon={<WifiOff className="w-5 h-5" />} accent="warning" change="W-06 low battery" />
      </div>

      <div className="bg-card rounded-xl border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Security Event Timeline</h3>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
        <div className="divide-y divide-border">
          {SECURITY_EVENTS.map(e => (
            <div key={e.id} className="px-5 py-4 flex items-start gap-4">
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', {
                'bg-destructive/10': e.severity === 'critical' || e.severity === 'high',
                'bg-warning/10': e.severity === 'medium',
                'bg-muted': e.severity === 'low',
              })}>
                <AlertTriangle className={cn('w-4 h-4', { 'text-destructive': e.severity === 'critical' || e.severity === 'high', 'text-warning': e.severity === 'medium', 'text-muted-foreground': e.severity === 'low' })} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-sm font-semibold text-foreground">{e.machineNumber}</span>
                  <SeverityBadge severity={e.severity} />
                  {e.resolved && <span className="text-xs text-success font-medium">Resolved</span>}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{e.description}</p>
                {e.staffName && <p className="text-xs text-muted-foreground mt-1">By {e.staffName}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">{e.timestamp}</p>
                {!e.resolved && (
                  <button className="mt-1 text-xs text-primary font-semibold hover:underline">Resolve</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RevenuePanel() {
  const PICK_COLORS = ['oklch(0.45 0.18 255)', 'oklch(0.52 0.17 145)', 'oklch(0.7 0.18 55)']
  const pieData = [
    { name: 'Cycles', value: 5240 },
    { name: 'Fees', value: 310 },
    { name: 'Redeemed', value: 690 },
  ]
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-4">
        <KpiCard title="MTD Revenue" value="$5,550" change="+14.8% vs last month" changeType="positive" icon={<DollarSign className="w-5 h-5" />} accent="brand" />
        <KpiCard title="Cycle Revenue" value="$5,240" change="94.4% of total" changeType="neutral" icon={<WashingMachine className="w-5 h-5" />} accent="brand" />
        <KpiCard title="Fee Revenue" value="$310" change="5.6% of total" changeType="neutral" icon={<Clock className="w-5 h-5" />} accent="warning" />
        <KpiCard title="Tokens Redeemed" value="$690" change="34 redemptions" changeType="neutral" icon={<Zap className="w-5 h-5" />} accent="success" />
      </div>

      <div className="grid xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Monthly Revenue Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 240)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'oklch(0.5 0.02 250)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'oklch(0.5 0.02 250)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip formatter={(v: number) => [`$${v}`]} contentStyle={{ borderRadius: '0.5rem', border: '1px solid oklch(0.9 0.01 240)', fontSize: 12 }} />
              <Bar dataKey="cycle" name="Cycles" fill="oklch(0.45 0.18 255)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="fees" name="Fees" fill="oklch(0.7 0.18 55)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="rewards" name="Rewards" fill="oklch(0.52 0.17 145)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Revenue Mix</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={PICK_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`$${v}`]} contentStyle={{ borderRadius: '0.5rem', border: '1px solid oklch(0.9 0.01 240)', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs text-muted-foreground"><span className="w-2 h-2 rounded-full" style={{ background: PICK_COLORS[i] }} />{d.name}</span>
                <span className="text-xs font-semibold text-foreground">${d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4">Machine Utilization (Today)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={UTILIZATION_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 240)" />
            <XAxis dataKey="hour" tick={{ fontSize: 11, fill: 'oklch(0.5 0.02 250)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'oklch(0.5 0.02 250)' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[0, 100]} />
            <Tooltip formatter={(v: number) => [`${v}%`]} contentStyle={{ borderRadius: '0.5rem', border: '1px solid oklch(0.9 0.01 240)', fontSize: 12 }} />
            <Line type="monotone" dataKey="washers" name="Washers" stroke="oklch(0.45 0.18 255)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="dryers" name="Dryers" stroke="oklch(0.52 0.17 145)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function StaffPanel() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Staff Members</h3>
        <button className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"><UserCheck className="w-4 h-4" />Add Staff</button>
      </div>
      <div className="grid gap-4">
        {STAFF.map(s => (
          <div key={s.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">{s.name.split(' ').map(n => n[0]).join('')}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-semibold text-foreground text-sm">{s.name}</p>
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium capitalize', s.role === 'manager' ? 'bg-primary/10 text-primary' : s.role === 'supervisor' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground')}>{s.role}</span>
              </div>
              <p className="text-xs text-muted-foreground">{s.email} · Shift: {s.shift}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">Overrides</p>
              <p className="text-sm font-bold text-foreground">{s.overrides}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">Last login</p>
              <p className="text-xs text-foreground">{s.lastLogin}</p>
            </div>
            <button className="p-1.5 hover:bg-muted rounded-lg"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsPanel() {
  const [grace, setGrace] = useState(10)
  return (
    <div className="grid xl:grid-cols-2 gap-5">
      <div className="flex flex-col gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Grace Period</h3>
          <div className="flex items-center gap-4">
            <button onClick={() => setGrace(g => Math.max(0, g - 5))} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted"><span className="text-lg font-bold text-foreground">−</span></button>
            <div className="flex-1 text-center"><span className="text-3xl font-bold text-foreground">{grace}</span><span className="text-sm text-muted-foreground ml-1">min</span></div>
            <button onClick={() => setGrace(g => Math.min(60, g + 5))} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted"><span className="text-lg font-bold text-foreground">+</span></button>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Fee Configuration</h3>
          <div className="flex flex-col gap-3">
            {[['Late Pickup Fee (per 5 min)', '$1.50'], ['Max Late Fee Cap', '$15.00'], ['Forced Entry Fee', '$25.00']].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-semibold text-foreground">{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">DrumToken Rules</h3>
          <div className="flex flex-col gap-3">
            {[['On-time pickup', '+60 tokens'], ['Streak bonus (7 days)', '+100 tokens'], ['Referral', '+200 tokens'], ['Free Wash threshold', '500 tokens'], ['Free Dry threshold', '400 tokens']].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-semibold text-success">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Notification Timing</h3>
          <div className="flex flex-col gap-3">
            {[['Cycle complete', 'Immediate'], ['Grace midway reminder', '5 min before end'], ['Final grace reminder', '1 min before end'], ['Overdue alert to manager', '5 min after expiry']].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-semibold text-foreground">{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Operating Hours</h3>
          <div className="flex flex-col gap-3">
            {[['Monday – Friday', '6:00 AM – 11:00 PM'], ['Saturday', '7:00 AM – 10:00 PM'], ['Sunday', '8:00 AM – 9:00 PM']].map(([day, hours]) => (
              <div key={day} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{day}</span>
                <span className="text-sm font-semibold text-foreground">{hours}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Root Manager Dashboard ───────────────────────────────────────────────────

export function ManagerDashboard() {
  const [tab, setTab] = useState<DashTab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-[calc(100vh-56px)] bg-background">
      {/* Sidebar */}
      <aside className={cn('bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-200 shrink-0', sidebarOpen ? 'w-56' : 'w-14')}>
        <div className="flex items-center justify-between px-3 py-4 border-b border-sidebar-border">
          {sidebarOpen && (
            <div>
              <p className="text-sidebar-foreground font-bold text-sm">SpinSpot</p>
              <p className="text-sidebar-foreground/40 text-xs">123 Main St, Austin TX</p>
            </div>
          )}
          <button onClick={() => setSidebarOpen(o => !o)} className="p-1.5 rounded-lg hover:bg-sidebar-accent shrink-0">
            {sidebarOpen ? <X className="w-4 h-4 text-sidebar-foreground/60" /> : <Menu className="w-4 h-4 text-sidebar-foreground/60" />}
          </button>
        </div>
        <nav className="flex-1 px-2 py-3 flex flex-col gap-1">
          {DASH_TABS.map(t => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn('flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors', tab === t.id ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent')}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>{t.label}</span>}
              </button>
            )
          })}
        </nav>
        {sidebarOpen && (
          <div className="px-3 py-4 border-t border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-bold text-sidebar-foreground">AT</div>
              <div className="min-w-0">
                <p className="text-sidebar-foreground text-xs font-semibold truncate">Alex Torres</p>
                <p className="text-sidebar-foreground/40 text-[10px]">Manager</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-foreground capitalize">{tab === 'overview' ? 'Operations Overview' : tab}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">SpinSpot Laundry · Monday, July 14, 2025</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-border bg-card hover:bg-muted"><RefreshCw className="w-4 h-4 text-muted-foreground" /></button>
              <button className="relative p-2 rounded-lg border border-border bg-card hover:bg-muted">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-destructive rounded-full" />
              </button>
            </div>
          </div>

          {tab === 'overview' && <OverviewPanel />}
          {tab === 'machines' && <MachinesPanel />}
          {tab === 'customers' && <CustomersPanel />}
          {tab === 'security' && <SecurityPanel />}
          {tab === 'revenue' && <RevenuePanel />}
          {tab === 'staff' && <StaffPanel />}
          {tab === 'settings' && <SettingsPanel />}
        </div>
      </main>
    </div>
  )
}
