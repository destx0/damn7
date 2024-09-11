import { app } from 'electron'
import { join } from 'path'

const isDev = process.env.NODE_ENV === 'development'

export const getPuppeteerConfig = () => {
  return {
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: isDev
      ? undefined
      : join(app.getAppPath(), '..', 'chromium', 'chrome.exe')
  }
}

export const setupPuppeteer = async (browser) => {
  // Add any additional Puppeteer setup here
  // For example, you might want to set default viewport size
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 800 })
  return page
}
