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
  if (num < 20) return units[num]
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? '-' + units[num % 10] : '')
  return ''
}

const yearToWords = (year) => {
  const firstPart = Math.floor(year / 100)
  const secondPart = year % 100
  const firstPartWords = numberToWords(firstPart)
  const secondPartWords = secondPart === 0 ? '' : numberToWords(secondPart)
  return firstPartWords + (secondPartWords ? ' ' + secondPartWords : '')
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
