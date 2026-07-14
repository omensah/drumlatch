'use client'

import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ReactNode
  description?: string
  accent?: 'brand' | 'success' | 'warning' | 'destructive'
  className?: string
}

export function KpiCard({ title, value, change, changeType = 'neutral', icon, description, accent, className }: KpiCardProps) {
  const accentClasses = {
    brand: 'border-l-4 border-l-primary',
    success: 'border-l-4 border-l-success',
    warning: 'border-l-4 border-l-warning',
    destructive: 'border-l-4 border-l-destructive',
  }

  return (
    <div className={cn(
      'bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow',
      accent && accentClasses[accent],
      className
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 truncate">{title}</p>
          <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
          {description && <p className="text-xs text-muted-foreground mt-1.5">{description}</p>}
        </div>
        {icon && (
          <div className={cn(
            'p-2.5 rounded-lg shrink-0',
            accent === 'brand' ? 'bg-primary/10 text-primary' :
            accent === 'success' ? 'bg-success/10 text-success' :
            accent === 'warning' ? 'bg-warning/10 text-warning' :
            accent === 'destructive' ? 'bg-destructive/10 text-destructive' :
            'bg-muted text-muted-foreground'
          )}>
            {icon}
          </div>
        )}
      </div>
      {change && (
        <div className="flex items-center gap-1 mt-3">
          {changeType === 'positive' && <TrendingUp className="w-3 h-3 text-success" />}
          {changeType === 'negative' && <TrendingDown className="w-3 h-3 text-destructive" />}
          <span className={cn('text-xs font-medium', {
            'text-success': changeType === 'positive',
            'text-destructive': changeType === 'negative',
            'text-muted-foreground': changeType === 'neutral',
          })}>
            {change}
          </span>
        </div>
      )}
    </div>
  )
}
