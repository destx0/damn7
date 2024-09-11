import { app } from 'electron'
import { join } from 'path'

const isDev = process.env.NODE_ENV === 'development'

export const getPuppeteerConfig = () => {
  // Handle both development and production environments
  const chromePath = isDev
    ? join(process.cwd(), 'chromium', 'chrome.exe') // Development environment
    : join(app.getPath('exe'), '..', 'resources', 'app.asar.unpacked', 'chromium', 'chrome.exe') // Production environment path to unpacked folder

  return {
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: chromePath
  }
}

export const setupPuppeteer = async (browser) => {
  // Add any additional Puppeteer setup here
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 800 })
  return page
}
