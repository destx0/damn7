const ordinalNumbers = [
  '',
  'First',
  'Second',
  'Third',
  'Fourth',
  'Fifth',
  'Sixth',
  'Seventh',
  'Eighth',
  'Ninth',
  'Tenth',
  'Eleventh',
  'Twelfth',
  'Thirteenth',
  'Fourteenth',
  'Fifteenth',
  'Sixteenth',
  'Seventeenth',
  'Eighteenth',
  'Nineteenth',
  'Twentieth',
  'Twenty-First',
  'Twenty-Second',
  'Twenty-Third',
  'Twenty-Fourth',
  'Twenty-Fifth',
  'Twenty-Sixth',
  'Twenty-Seventh',
  'Twenty-Eighth',
  'Twenty-Ninth',
  'Thirtieth',
  'Thirty-First'
]

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

const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

const numberToWords = (num) => {
  if (num === 0) return 'Zero'
  if (num < 20) return units[num]
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? '-' + units[num % 10] : '')
  if (num < 1000) {
    const hundreds = Math.floor(num / 100)
    const remainder = num % 100
    return units[hundreds] + ' Hundred' + (remainder !== 0 ? ' ' + numberToWords(remainder) : '')
  }
  if (num < 10000) {
    const thousands = Math.floor(num / 1000)
    const remainder = num % 1000
    return units[thousands] + ' Thousand' + (remainder !== 0 ? ' ' + numberToWords(remainder) : '')
  }
  return ''
}

const yearToWords = (year) => {
  return numberToWords(year)
}

export const dateToWords = (dateString) => {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleString('default', { month: 'long' })
  const year = date.getFullYear()
  const dayWord = ordinalNumbers[day]
  const yearWord = yearToWords(year)
  return `${dayWord} ${month}, ${yearWord}`
}

export const monthYear = (dateString) => {
  const date = new Date(dateString)
  const month = date.toLocaleString('default', { month: 'long' })
  const year = date.getFullYear()
  return `${month}, ${year}`
}
