import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border',
  {
    variants: {
      variant: {
        default:
          'border-indigo-500/30 bg-indigo-500/10 text-indigo-300',
        secondary:
          'border-zinc-700 bg-zinc-800 text-zinc-300',
        destructive:
          'border-rose-500/30 bg-rose-500/10 text-rose-400',
        success:
          'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
        warning:
          'border-amber-500/30 bg-amber-500/10 text-amber-300',
        outline:
          'border-zinc-800 text-zinc-400',
        cyan:
          'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
