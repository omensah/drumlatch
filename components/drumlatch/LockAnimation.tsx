'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

type LockState = 'locked' | 'unlocked' | 'locking' | 'unlocking'

interface LockAnimationProps {
  state: LockState
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function LockAnimation({ state, size = 'md', className }: LockAnimationProps) {
  const sizes = {
    sm: { container: 'w-12 h-12', icon: 28 },
    md: { container: 'w-20 h-20', icon: 40 },
    lg: { container: 'w-28 h-28', icon: 52 },
    xl: { container: 'w-36 h-36', icon: 64 },
  }
  const s = sizes[size]
  const isLocked = state === 'locked' || state === 'locking'
  const isAnimating = state === 'locking' || state === 'unlocking'

  return (
    <div className={cn('relative flex items-center justify-center rounded-full', s.container, {
      'bg-primary/10': isLocked,
      'bg-success/10': !isLocked,
      'animate-lock-pulse': isLocked && !isAnimating,
    }, className)}>
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 40 44"
        fill="none"
        className={cn('transition-all duration-300', isAnimating && 'animate-bounce-gentle')}
      >
        {/* Shackle */}
        <path
          d={isLocked
            ? 'M10 20V14C10 8.48 14.48 4 20 4C25.52 4 30 8.48 30 14V20'
            : 'M10 20V10C10 4.48 14.48 0 20 0C25.52 0 30 4.48 30 10'
          }
          stroke={isLocked ? 'oklch(0.45 0.18 255)' : 'oklch(0.52 0.17 145)'}
          strokeWidth="3"
          strokeLinecap="round"
          className="transition-all duration-500"
          style={{ transform: !isLocked ? 'translateY(-6px)' : undefined }}
        />
        {/* Body */}
        <rect
          x="6"
          y={isLocked ? '20' : '22'}
          width="28"
          height="20"
          rx="4"
          fill={isLocked ? 'oklch(0.45 0.18 255)' : 'oklch(0.52 0.17 145)'}
          className="transition-all duration-300"
        />
        {/* Keyhole */}
        <circle cx="20" cy={isLocked ? '30' : '32'} r="3" fill="white" className="transition-all duration-300" />
        <rect x="18.5" y={isLocked ? '31' : '33'} width="3" height="5" rx="1" fill="white" className="transition-all duration-300" />
      </svg>
      {isAnimating && (
        <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-ping" />
      )}
    </div>
  )
}

interface CycleTimerProps {
  totalMinutes: number
  elapsedMinutes: number
  className?: string
}

export function CycleTimer({ totalMinutes, elapsedMinutes, className }: CycleTimerProps) {
  const circumference = 2 * Math.PI * 35
  const progress = Math.min(elapsedMinutes / totalMinutes, 1)
  const offset = circumference * (1 - progress)
  const remaining = Math.max(totalMinutes - elapsedMinutes, 0)
  const hours = Math.floor(remaining / 60)
  const mins = remaining % 60

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <svg width="100" height="100" className="-rotate-90">
        <circle cx="50" cy="50" r="35" fill="none" stroke="oklch(0.9 0.01 240)" strokeWidth="6" />
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="oklch(0.45 0.18 255)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-lg font-bold text-foreground leading-none">
          {hours > 0 ? `${hours}h${mins}m` : `${mins}m`}
        </p>
        <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">left</p>
      </div>
    </div>
  )
}
