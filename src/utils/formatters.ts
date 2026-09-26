export function formatDaysRemaining(days: number): string {
  if (days <= 0) return 'Placement season active'
  if (days === 1) return '1 day remaining'
  return `${days} days remaining`
}

export function formatDurationMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const remainingMins = minutes % 60
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`
}

export function formatRoleName(role: string): string {
  return role
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
