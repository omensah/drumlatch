'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Building2, Package, CreditCard, LifeBuoy, Activity,
  Users, Shield, ChevronRight, Search, MoreHorizontal, TrendingUp,
  TrendingDown, ArrowUpRight, CheckCircle2, AlertTriangle, Clock,
  DollarSign, Zap, WifiOff, Settings, Bell, RefreshCw, Download,
  Menu, X, ExternalLink, Lock, Star, Filter, ChevronDown, Eye,
  Cpu, Globe, Server, Database, Key
} from 'lucide-react'
import { KpiCard } from './KpiCard'
import { SeverityBadge } from './StatusBadge'
import { ORGANIZATIONS, PLATFORM_MRR_DATA, Organization } from '@/lib/data'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts'

type AdminTab = 'platform' | 'orgs' | 'fleet' | 'billing' | 'support' | 'monitoring' | 'team' | 'security'

const ADMIN_TABS: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: 'platform', label: 'Platform', icon: LayoutDashboard },
  { id: 'orgs', label: 'Organizations', icon: Building2 },
  { id: 'fleet', label: 'Device Fleet', icon: Package },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'support', label: 'Support', icon: LifeBuoy },
  { id: 'monitoring', label: 'Monitoring', icon: Activity },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'security', label: 'Security', icon: Shield },
]

// ── Platform Overview ────────────────────────────────────────────────────────

function PlatformPanel() {
  const activeOrgs = ORGANIZATIONS.filter(o => o.status === 'active').length
  const totalMRR = ORGANIZATIONS.reduce((s, o) => s + o.mrr, 0)
  const totalMachines = ORGANIZATIONS.reduce((s, o) => s + o.machines, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="MRR" value={`$${(totalMRR / 1000).toFixed(1)}k`} change="+12.9% MoM" changeType="positive" icon={<DollarSign className="w-5 h-5" />} accent="brand" description="Monthly Recurring Revenue" />
        <KpiCard title="ARR" value={`$${(totalMRR * 12 / 1000).toFixed(0)}k`} change="Annualized" changeType="positive" icon={<TrendingUp className="w-5 h-5" />} accent="brand" />
        <KpiCard title="Active Orgs" value={activeOrgs} change={`${ORGANIZATIONS.length} total · 1 trial`} changeType="positive" icon={<Building2 className="w-5 h-5" />} accent="success" />
        <KpiCard title="Active Devices" value={totalMachines} change="98.4% uptime" changeType="positive" icon={<Package className="w-5 h-5" />} accent="success" />
      </div>

      <div className="grid xl:grid-cols-3 gap-5">
        {/* MRR growth */}
        <div className="xl:col-span-2 bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">MRR Growth</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Jan – Jul 2025</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">${totalMRR.toLocaleString()}</p>
              <p className="text-xs text-success flex items-center gap-1 justify-end"><TrendingUp className="w-3 h-3" />+118.7% YTD</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={PLATFORM_MRR_DATA}>
              <defs>
                <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.45 0.18 255)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.45 0.18 255)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 240)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'oklch(0.5 0.02 250)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'oklch(0.5 0.02 250)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'MRR']} contentStyle={{ borderRadius: '0.5rem', border: '1px solid oklch(0.9 0.01 240)', fontSize: 12 }} />
              <Area type="monotone" dataKey="mrr" stroke="oklch(0.45 0.18 255)" fill="url(#mrrGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top orgs */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Top Organizations</h3>
          <div className="flex flex-col gap-3">
            {ORGANIZATIONS.filter(o => o.mrr > 0).sort((a, b) => b.mrr - a.mrr).map((o, i) => (
              <div key={o.id} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{o.name}</p>
                  <div className="mt-1 bg-muted rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(o.mrr / 2200) * 100}%` }} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-foreground">${o.mrr.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">/mo</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health table */}
      <div className="bg-card rounded-xl border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Organization Health</h3>
          <button className="text-xs text-primary font-medium flex items-center gap-1">View All <ChevronRight className="w-3 h-3" /></button>
        </div>
        <div className="divide-y divide-border">
          {ORGANIZATIONS.map(o => (
            <div key={o.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">{o.name.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{o.name}</p>
                  <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase', o.tier === 'enterprise' ? 'bg-primary/10 text-primary' : o.tier === 'professional' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground')}>{o.tier}</span>
                </div>
                <p className="text-xs text-muted-foreground">{o.location} · {o.owner}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs text-muted-foreground">Machines</p>
                <p className="text-sm font-bold text-foreground">{o.activeMachines}/{o.machines}</p>
              </div>
              <div className="w-20 shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground">Health</span>
                  <span className="text-[10px] font-bold text-foreground">{o.healthScore}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full', o.healthScore >= 80 ? 'bg-success' : o.healthScore >= 60 ? 'bg-warning' : 'bg-destructive')} style={{ width: `${o.healthScore}%` }} />
                </div>
              </div>
              <div className="shrink-0">
                <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full capitalize', {
                  'bg-success/10 text-success': o.status === 'active',
                  'bg-warning/10 text-warning': o.status === 'trial',
                  'bg-primary/10 text-primary': o.status === 'onboarding',
                  'bg-muted text-muted-foreground': o.status === 'churned',
                })}>{o.status}</span>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-bold text-foreground">${o.mrr.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">/mo</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Organizations ────────────────────────────────────────────────────────────

function OrgsPanel() {
  const [search, setSearch] = useState('')
  const [tier, setTier] = useState('all')
  const filtered = ORGANIZATIONS.filter(o =>
    (tier === 'all' || o.tier === tier) &&
    (!search || o.name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-4">
        <KpiCard title="Total Orgs" value={ORGANIZATIONS.length} icon={<Building2 className="w-5 h-5" />} accent="brand" />
        <KpiCard title="Active" value={ORGANIZATIONS.filter(o => o.status === 'active').length} icon={<CheckCircle2 className="w-5 h-5" />} accent="success" />
        <KpiCard title="Trial" value={ORGANIZATIONS.filter(o => o.status === 'trial').length} icon={<Clock className="w-5 h-5" />} accent="warning" />
        <KpiCard title="Churned" value={ORGANIZATIONS.filter(o => o.status === 'churned').length} icon={<TrendingDown className="w-5 h-5" />} accent="destructive" />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search organizations…" className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        {['all', 'starter', 'professional', 'enterprise'].map(t => (
          <button key={t} onClick={() => setTier(t)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors', tier === t ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground')}>{t === 'all' ? 'All Tiers' : t}</button>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {['Organization', 'Tier', 'Owner', 'Location', 'Machines', 'MRR', 'Health', 'Status', 'Last Active', ''].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 first:pl-5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">{o.name.charAt(0)}</div>
                    <span className="text-sm font-semibold text-foreground">{o.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5"><span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide', o.tier === 'enterprise' ? 'bg-primary/10 text-primary' : o.tier === 'professional' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground')}>{o.tier}</span></td>
                <td className="px-4 py-3.5 text-sm text-foreground">{o.owner}</td>
                <td className="px-4 py-3.5 text-sm text-muted-foreground">{o.location}</td>
                <td className="px-4 py-3.5 text-sm text-foreground">{o.activeMachines}/{o.machines}</td>
                <td className="px-4 py-3.5 text-sm font-bold text-foreground">{o.mrr > 0 ? `$${o.mrr.toLocaleString()}` : '—'}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-14 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full', o.healthScore >= 80 ? 'bg-success' : o.healthScore >= 60 ? 'bg-warning' : 'bg-destructive')} style={{ width: `${o.healthScore}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{o.healthScore}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5"><span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full capitalize', { 'bg-success/10 text-success': o.status === 'active', 'bg-warning/10 text-warning': o.status === 'trial', 'bg-muted text-muted-foreground': o.status === 'churned', 'bg-primary/10 text-primary': o.status === 'onboarding' })}>{o.status}</span></td>
                <td className="px-4 py-3.5 text-xs text-muted-foreground">{o.lastActive}</td>
                <td className="px-4 py-3.5"><button className="p-1.5 hover:bg-muted rounded-lg"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Device Fleet ─────────────────────────────────────────────────────────────

function FleetPanel() {
  const FLEET = [
    { serial: 'DL-001-2401', org: 'SpinSpot Laundry', firmware: '2.4.1', status: 'online', battery: 92, signal: 'strong', provisioned: '2024-03-01', warranty: '2027-03-01' },
    { serial: 'DL-002-2401', org: 'SpinSpot Laundry', firmware: '2.3.9', status: 'offline', battery: 12, signal: 'none', provisioned: '2024-03-01', warranty: '2027-03-01' },
    { serial: 'DL-003-2405', org: 'CleanWave', firmware: '2.4.1', status: 'online', battery: 88, signal: 'strong', provisioned: '2024-05-15', warranty: '2027-05-15' },
    { serial: 'DL-004-2411', org: 'Laundry Loop', firmware: '2.4.1', status: 'online', battery: 95, signal: 'strong', provisioned: '2023-11-20', warranty: '2026-11-20' },
    { serial: 'DL-005-2401', org: 'SpinSpot Laundry', firmware: '2.4.0', status: 'degraded', battery: 45, signal: 'weak', provisioned: '2024-03-01', warranty: '2027-03-01' },
    { serial: 'DL-006-2501', org: 'QuickWash Pro', firmware: '2.4.1', status: 'online', battery: 99, signal: 'strong', provisioned: '2025-01-10', warranty: '2028-01-10' },
  ]
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-4">
        <KpiCard title="Total Devices" value={FLEET.length} icon={<Package className="w-5 h-5" />} accent="brand" />
        <KpiCard title="Online" value={FLEET.filter(d => d.status === 'online').length} icon={<CheckCircle2 className="w-5 h-5" />} accent="success" />
        <KpiCard title="Degraded" value={FLEET.filter(d => d.status === 'degraded').length} icon={<AlertTriangle className="w-5 h-5" />} accent="warning" />
        <KpiCard title="Offline" value={FLEET.filter(d => d.status === 'offline').length} icon={<WifiOff className="w-5 h-5" />} accent="destructive" />
      </div>

      <div className="bg-card rounded-xl border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Device Registry</h3>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium"><RefreshCw className="w-3.5 h-3.5" />Rollout Firmware</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {['Serial', 'Organization', 'Firmware', 'Status', 'Battery', 'Signal', 'Provisioned', 'Warranty', ''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FLEET.map(d => (
                <tr key={d.serial} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono font-medium text-foreground">{d.serial}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{d.org}</td>
                  <td className="px-4 py-3"><span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{d.firmware}</span></td>
                  <td className="px-4 py-3"><span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full capitalize', d.status === 'online' ? 'bg-success/10 text-success' : d.status === 'degraded' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive')}>{d.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden"><div className={cn('h-full rounded-full', d.battery > 50 ? 'bg-success' : d.battery > 20 ? 'bg-warning' : 'bg-destructive')} style={{ width: `${d.battery}%` }} /></div>
                      <span className="text-xs text-muted-foreground">{d.battery}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={cn('text-xs font-medium capitalize', d.signal === 'strong' ? 'text-success' : d.signal === 'weak' ? 'text-warning' : 'text-destructive')}>{d.signal}</span></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{d.provisioned}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{d.warranty}</td>
                  <td className="px-4 py-3"><button className="p-1.5 hover:bg-muted rounded-lg"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Billing ──────────────────────────────────────────────────────────────────

function BillingPanel() {
  const INVOICES = [
    { org: 'Laundry Loop', amount: 2150, date: 'Jul 1, 2025', status: 'paid', tier: 'Enterprise' },
    { org: 'SpinSpot Laundry', amount: 1240, date: 'Jul 1, 2025', status: 'paid', tier: 'Professional' },
    { org: 'QuickWash Pro', amount: 1680, date: 'Jul 1, 2025', status: 'paid', tier: 'Professional' },
    { org: 'CleanWave', amount: 820, date: 'Jul 1, 2025', status: 'paid', tier: 'Starter' },
    { org: 'FreshSpin', amount: 0, date: 'Jul 1, 2025', status: 'trial', tier: 'Starter' },
    { org: 'Suds & Go', amount: 820, date: 'Jun 1, 2025', status: 'failed', tier: 'Starter' },
  ]
  const totalMRR = ORGANIZATIONS.reduce((s, o) => s + o.mrr, 0)
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-4">
        <KpiCard title="MRR" value={`$${totalMRR.toLocaleString()}`} change="+12.9% MoM" changeType="positive" icon={<DollarSign className="w-5 h-5" />} accent="brand" />
        <KpiCard title="ARR" value={`$${(totalMRR * 12).toLocaleString()}`} icon={<TrendingUp className="w-5 h-5" />} accent="brand" />
        <KpiCard title="Payment Failures" value="1" change="Suds & Go" changeType="negative" icon={<AlertTriangle className="w-5 h-5" />} accent="destructive" />
        <KpiCard title="Avg Contract" value="$1,178" change="Per org/mo" changeType="neutral" icon={<CreditCard className="w-5 h-5" />} accent="success" />
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Invoices</h3>
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"><Download className="w-3.5 h-3.5" />Export CSV</button>
        </div>
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {['Organization', 'Tier', 'Amount', 'Date', 'Status', ''].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((inv, i) => (
              <tr key={i} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3.5 text-sm font-semibold text-foreground">{inv.org}</td>
                <td className="px-4 py-3.5"><span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', inv.tier === 'Enterprise' ? 'bg-primary/10 text-primary' : inv.tier === 'Professional' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground')}>{inv.tier}</span></td>
                <td className="px-4 py-3.5 text-sm font-bold text-foreground">{inv.amount > 0 ? `$${inv.amount.toLocaleString()}` : '—'}</td>
                <td className="px-4 py-3.5 text-sm text-muted-foreground">{inv.date}</td>
                <td className="px-4 py-3.5"><span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', inv.status === 'paid' ? 'bg-success/10 text-success' : inv.status === 'failed' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning')}>{inv.status}</span></td>
                <td className="px-4 py-3.5"><button className="p-1.5 hover:bg-muted rounded-lg"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Support Center ───────────────────────────────────────────────────────────

function SupportPanel() {
  const TICKETS = [
    { id: 'T-1024', org: 'SpinSpot Laundry', subject: 'W-06 offline after firmware update', priority: 'high' as const, status: 'open', created: '2 hrs ago', assignee: 'Eng Team' },
    { id: 'T-1023', org: 'CleanWave', subject: 'Customer locked out, cycle complete', priority: 'medium' as const, status: 'in-progress', created: '4 hrs ago', assignee: 'Support' },
    { id: 'T-1022', org: 'FreshSpin', subject: 'Onboarding: BLE pairing failure on D-03', priority: 'medium' as const, status: 'open', created: '1 day ago', assignee: 'CS Team' },
    { id: 'T-1021', org: 'Laundry Loop', subject: 'Billing invoice discrepancy July', priority: 'low' as const, status: 'resolved', created: '2 days ago', assignee: 'Finance' },
    { id: 'T-1020', org: 'QuickWash Pro', subject: 'Staff override logs not syncing', priority: 'medium' as const, status: 'resolved', created: '3 days ago', assignee: 'Eng Team' },
  ]
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-4">
        <KpiCard title="Open Tickets" value="3" change="+1 today" changeType="negative" icon={<LifeBuoy className="w-5 h-5" />} accent="warning" />
        <KpiCard title="In Progress" value="1" icon={<RefreshCw className="w-5 h-5" />} accent="brand" />
        <KpiCard title="Resolved Today" value="2" changeType="positive" icon={<CheckCircle2 className="w-5 h-5" />} accent="success" />
        <KpiCard title="Avg Resolution" value="3.2h" icon={<Clock className="w-5 h-5" />} accent="brand" />
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Support Tickets</h3>
          <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">New Ticket</button>
        </div>
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {['ID', 'Organization', 'Subject', 'Priority', 'Status', 'Created', 'Assignee', ''].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TICKETS.map(t => (
              <tr key={t.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3.5 text-xs font-mono text-muted-foreground">{t.id}</td>
                <td className="px-4 py-3.5 text-sm font-medium text-foreground">{t.org}</td>
                <td className="px-4 py-3.5 text-sm text-foreground max-w-xs truncate">{t.subject}</td>
                <td className="px-4 py-3.5"><SeverityBadge severity={t.priority} /></td>
                <td className="px-4 py-3.5"><span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', t.status === 'open' ? 'bg-warning/10 text-warning' : t.status === 'in-progress' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success')}>{t.status}</span></td>
                <td className="px-4 py-3.5 text-xs text-muted-foreground">{t.created}</td>
                <td className="px-4 py-3.5 text-xs text-muted-foreground">{t.assignee}</td>
                <td className="px-4 py-3.5"><button className="p-1.5 hover:bg-muted rounded-lg"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Platform Monitoring ──────────────────────────────────────────────────────

function MonitoringPanel() {
  const SERVICES = [
    { name: 'API Gateway', status: 'operational', uptime: '99.98%', latency: '42ms', icon: Server },
    { name: 'Auth Service', status: 'operational', uptime: '100%', latency: '18ms', icon: Lock },
    { name: 'Bluetooth Relay', status: 'degraded', uptime: '99.1%', latency: '210ms', icon: Cpu },
    { name: 'Payment Gateway', status: 'operational', uptime: '100%', latency: '95ms', icon: CreditCard },
    { name: 'Push Notifications', status: 'operational', uptime: '99.95%', latency: '120ms', icon: Bell },
    { name: 'Database Cluster', status: 'operational', uptime: '100%', latency: '8ms', icon: Database },
  ]
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-4">
        <KpiCard title="API Uptime" value="99.98%" changeType="positive" icon={<Activity className="w-5 h-5" />} accent="success" change="30d average" />
        <KpiCard title="Active Orgs" value="5" icon={<Building2 className="w-5 h-5" />} accent="brand" />
        <KpiCard title="Degraded Services" value="1" change="BT relay" changeType="negative" icon={<AlertTriangle className="w-5 h-5" />} accent="warning" />
        <KpiCard title="Incidents Today" value="0" changeType="positive" icon={<CheckCircle2 className="w-5 h-5" />} accent="success" />
      </div>
      <div className="grid xl:grid-cols-2 gap-5">
        {SERVICES.map(s => {
          const Icon = s.icon
          return (
            <div key={s.name} className={cn('bg-card rounded-xl border p-4 flex items-center gap-4', s.status === 'operational' ? 'border-border' : 'border-warning/30')}>
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', s.status === 'operational' ? 'bg-success/10' : 'bg-warning/10')}>
                <Icon className={cn('w-5 h-5', s.status === 'operational' ? 'text-success' : 'text-warning')} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">{s.name}</p>
                <p className="text-xs text-muted-foreground">Latency: {s.latency}</p>
              </div>
              <div className="text-right">
                <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', s.status === 'operational' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning')}>{s.status}</span>
                <p className="text-xs text-muted-foreground mt-1">{s.uptime} uptime</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Team ─────────────────────────────────────────────────────────────────────

function TeamPanel() {
  const TEAM = [
    { name: 'Jordan Wu', email: 'jordan@drumlatch.io', role: 'Engineering', access: 'Admin', lastLogin: '9:14 AM today', mfa: true },
    { name: 'Tasha Morris', email: 'tasha@drumlatch.io', role: 'Customer Success', access: 'Write', lastLogin: '8:52 AM today', mfa: true },
    { name: 'Caleb Foster', email: 'caleb@drumlatch.io', role: 'Sales', access: 'Read', lastLogin: 'Yesterday', mfa: false },
    { name: 'Nadia Rios', email: 'nadia@drumlatch.io', role: 'Operations', access: 'Write', lastLogin: '10:01 AM today', mfa: true },
    { name: 'Ben Holloway', email: 'ben@drumlatch.io', role: 'Executive', access: 'Admin', lastLogin: '2 hrs ago', mfa: true },
  ]
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Internal Team</h3>
        <button className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"><Users className="w-4 h-4" />Invite Member</button>
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {['Member', 'Role', 'Access Level', 'MFA', 'Last Login', ''].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TEAM.map(m => (
              <tr key={m.email} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{m.name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-sm text-muted-foreground">{m.role}</td>
                <td className="px-4 py-3.5"><span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', m.access === 'Admin' ? 'bg-primary/10 text-primary' : m.access === 'Write' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground')}>{m.access}</span></td>
                <td className="px-4 py-3.5">
                  {m.mfa ? <CheckCircle2 className="w-4 h-4 text-success" /> : <AlertTriangle className="w-4 h-4 text-warning" />}
                </td>
                <td className="px-4 py-3.5 text-xs text-muted-foreground">{m.lastLogin}</td>
                <td className="px-4 py-3.5"><button className="p-1.5 hover:bg-muted rounded-lg"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Security Admin ───────────────────────────────────────────────────────────

function SecurityAdminPanel() {
  return (
    <div className="grid xl:grid-cols-2 gap-5">
      <div className="flex flex-col gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Authentication</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'MFA Enforcement', value: 'Required for Admins', status: 'active' },
              { label: 'Session Timeout', value: '8 hours', status: 'active' },
              { label: 'Login Audit Log', value: 'Enabled (90-day retention)', status: 'active' },
              { label: 'IP Allowlist', value: 'Disabled', status: 'inactive' },
              { label: 'SSO / SAML', value: 'Configured', status: 'active' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{item.value}</span>
                  <span className={cn('w-2 h-2 rounded-full', item.status === 'active' ? 'bg-success' : 'bg-muted-foreground')} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">API Keys</h3>
          <div className="flex flex-col gap-3">
            {[
              { name: 'Production API Key', scope: 'read:all write:devices', created: '2024-01-01', last: '2 min ago' },
              { name: 'Webhook Signing Key', scope: 'events:write', created: '2024-03-15', last: '1 day ago' },
              { name: 'Firmware Update Key', scope: 'devices:firmware', created: '2024-06-01', last: '3 hrs ago' },
            ].map(k => (
              <div key={k.name} className="p-3 bg-muted/50 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-foreground">{k.name}</p>
                  <button className="text-xs text-destructive hover:underline">Revoke</button>
                </div>
                <p className="text-xs text-muted-foreground font-mono">{k.scope}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-muted-foreground">Created {k.created}</span>
                  <span className="text-[10px] text-muted-foreground">Last used {k.last}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Audit Log</h3>
          <div className="flex flex-col gap-2.5">
            {[
              { action: 'Firmware rollout initiated', actor: 'Jordan Wu', time: '10:02 AM', type: 'system' },
              { action: 'API key rotated', actor: 'Ben Holloway', time: '9:45 AM', type: 'security' },
              { action: 'Org suspended: Suds & Go', actor: 'Tasha Morris', time: '9:12 AM', type: 'admin' },
              { action: 'New user invited: caleb@drumlatch.io', actor: 'Ben Holloway', time: 'Yesterday 5:30 PM', type: 'admin' },
              { action: 'Compliance report exported', actor: 'Nadia Rios', time: 'Yesterday 3:00 PM', type: 'compliance' },
            ].map((log, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                <div className={cn('w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5', {
                  'bg-primary/10': log.type === 'system',
                  'bg-destructive/10': log.type === 'security',
                  'bg-warning/10': log.type === 'admin',
                  'bg-success/10': log.type === 'compliance',
                })}>
                  <Key className="w-3 h-3 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">{log.action}</p>
                  <p className="text-[10px] text-muted-foreground">{log.actor}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Compliance</h3>
          <div className="flex flex-col gap-3">
            {[['SOC 2 Type II', 'Certified — Aug 2025', true], ['PCI DSS', 'Compliant (via Stripe)', true], ['GDPR', 'DPA Active', true], ['CCPA', 'Compliant', true]].map(([s, v, ok]) => (
              <div key={s as string} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{s as string}</span>
                <span className={cn('flex items-center gap-1 text-xs font-medium', ok ? 'text-success' : 'text-warning')}>{ok && <CheckCircle2 className="w-3 h-3" />}{v as string}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Root Admin Platform ──────────────────────────────────────────────────────

export function AdminPlatform() {
  const [tab, setTab] = useState<AdminTab>('platform')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-[calc(100vh-56px)] bg-background">
      {/* Sidebar */}
      <aside className={cn('bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-200 shrink-0', sidebarOpen ? 'w-56' : 'w-14')}>
        <div className="flex items-center justify-between px-3 py-4 border-b border-sidebar-border">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <img src="/images/drumlatch-icon.png" alt="" aria-hidden="true" className="w-6 h-6 shrink-0" />
              <div>
                <p className="text-sidebar-foreground font-bold text-sm">DrumLatch</p>
                <p className="text-sidebar-foreground/40 text-xs">Super Admin</p>
              </div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(o => !o)} className="p-1.5 rounded-lg hover:bg-sidebar-accent shrink-0">
            {sidebarOpen ? <X className="w-4 h-4 text-sidebar-foreground/60" /> : <Menu className="w-4 h-4 text-sidebar-foreground/60" />}
          </button>
        </div>
        <nav className="flex-1 px-2 py-3 flex flex-col gap-1">
          {ADMIN_TABS.map(t => {
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
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-semibold text-destructive bg-destructive/20 px-1.5 py-0.5 rounded">INTERNAL</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-bold text-sidebar-foreground">BH</div>
              <div className="min-w-0">
                <p className="text-sidebar-foreground text-xs font-semibold truncate">Ben Holloway</p>
                <p className="text-sidebar-foreground/40 text-[10px]">Executive · Admin</p>
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
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-foreground capitalize">{
                  tab === 'platform' ? 'Platform Overview' :
                  tab === 'orgs' ? 'Organizations' :
                  tab === 'fleet' ? 'Device Fleet' :
                  tab === 'billing' ? 'Billing & Revenue' :
                  tab === 'support' ? 'Support Center' :
                  tab === 'monitoring' ? 'Platform Monitoring' :
                  tab === 'team' ? 'Internal Team' :
                  'Security Administration'
                }</h1>
                <span className="text-xs font-semibold bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">Internal</span>
              </div>
              <p className="text-sm text-muted-foreground">DrumLatch Operations · Monday, July 14, 2025</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-border bg-card hover:bg-muted"><RefreshCw className="w-4 h-4 text-muted-foreground" /></button>
              <button className="relative p-2 rounded-lg border border-border bg-card hover:bg-muted">
                <Bell className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {tab === 'platform' && <PlatformPanel />}
          {tab === 'orgs' && <OrgsPanel />}
          {tab === 'fleet' && <FleetPanel />}
          {tab === 'billing' && <BillingPanel />}
          {tab === 'support' && <SupportPanel />}
          {tab === 'monitoring' && <MonitoringPanel />}
          {tab === 'team' && <TeamPanel />}
          {tab === 'security' && <SecurityAdminPanel />}
        </div>
      </main>
    </div>
  )
}
