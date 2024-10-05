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
  if (num < 1000)
    return (
      units[Math.floor(num / 100)] +
      ' Hundred' +
      (num % 100 !== 0 ? ' ' + numberToWords(num % 100) : '')
    )
  return ''
}

const yearToWords = (year) => {
  if (year >= 2000) {
    const remainder = year - 2000
    const firstPartWords = 'Two Thousand'
    const secondPartWords = remainder > 0 ? ' ' + numberToWords(remainder) : ''
    return firstPartWords + secondPartWords
  } else {
    const firstPart = Math.floor(year / 100)
    const secondPart = year % 100
    const firstPartWords = numberToWords(firstPart)
    const secondPartWords = numberToWords(secondPart)
    return firstPartWords + ' ' + secondPartWords
  }
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
