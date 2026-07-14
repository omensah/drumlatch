'use client'

import { cn } from '@/lib/utils'
import { MachineStatus, STATUS_COLORS } from '@/lib/data'
import { Lock, Unlock, WifiOff, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react'

const STATUS_LABELS: Record<MachineStatus, string> = {
  available: 'Available',
  'in-use': 'In Use',
  locked: 'Locked',
  overdue: 'Overdue',
  offline: 'Offline',
  alert: 'Alert',
  reserved: 'Reserved',
}

const STATUS_ICONS: Record<MachineStatus, React.ReactNode> = {
  available: <CheckCircle2 className="w-3 h-3" />,
  'in-use': <Lock className="w-3 h-3" />,
  locked: <Lock className="w-3 h-3" />,
  overdue: <Clock className="w-3 h-3" />,
  offline: <WifiOff className="w-3 h-3" />,
  alert: <AlertTriangle className="w-3 h-3" />,
  reserved: <Unlock className="w-3 h-3" />,
}

export function StatusBadge({ status, className }: { status: MachineStatus; className?: string }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border',
      STATUS_COLORS[status],
      className
    )}>
      {STATUS_ICONS[status]}
      {STATUS_LABELS[status]}
    </span>
  )
}

export function SeverityBadge({ severity }: { severity: 'low' | 'medium' | 'high' | 'critical' }) {
  const classes = {
    low: 'bg-muted text-muted-foreground border-border',
    medium: 'bg-warning/10 text-warning border-warning/20',
    high: 'bg-destructive/10 text-destructive border-destructive/20',
    critical: 'bg-destructive text-white border-destructive',
  }
  return (
    <span className={cn('inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wide', classes[severity])}>
      {severity}
    </span>
  )
}
