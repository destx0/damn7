const numberToWords = (num) => {
  const units = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen'
  ]
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety'
  ]

  if (num < 20) return units[num]
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + units[num % 10] : '')
  if (num < 1000)
    return (
      units[Math.floor(num / 100)] +
      ' Hundred' +
      (num % 100 !== 0 ? ' and ' + numberToWords(num % 100) : '')
    )
  return (
    numberToWords(Math.floor(num / 1000)) +
    ' Thousand' +
    (num % 1000 !== 0 ? ' ' + numberToWords(num % 1000) : '')
  )
}

export const dateToWords = (dateString) => {
  const date = new Date(dateString)
  const day = numberToWords(date.getDate())
  const month = date.toLocaleString('default', { month: 'long' })
  const year = numberToWords(date.getFullYear())
  return `${day} ${month} ${year}`
}

export { numberToWords }
