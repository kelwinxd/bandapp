export function formatServiceDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`)
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  })
}

export function formatPhone(phone: string): string {
  // E.164 -> +55 (11) 99999-0001
  const match = phone.match(/^(\d{2})(\d{2})(\d{5})(\d{4})$/)
  if (!match) return phone
  const [, ddi, ddd, part1, part2] = match
  return `+${ddi} (${ddd}) ${part1}-${part2}`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}
