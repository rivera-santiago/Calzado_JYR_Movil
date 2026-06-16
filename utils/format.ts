export function formatMoney(value?: number) {
  if (!value && value !== 0) return '$ 0.00'
  return `$ ${value.toFixed(2)}`
}
