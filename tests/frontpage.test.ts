import { expect, test } from '@playwright/test'

//# options to goto() which can speed things up
//# https://www.checklyhq.com/blog/why-page-goto-is-slowing-down-your-playwright-test/

test.describe(`/`, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Hero Photos', async ({ page }) => {
    const idList = ['adam', 'cute', 'lols']
    for (const id of idList) {
      await expect(page.locator(`#photos > a > img#${id}`)).toHaveCount(1)
    }
  })

  test('Random Quote', async ({ page }) => {
    await expect(page.locator('#quote .quote > a').first().getAttribute('href')).resolves.toMatch('/quote/')
    await expect(page.locator('#quote footer a.author').getAttribute('href')).resolves.toMatch('/search/by/')
  })

  test('Social Icons', async ({ page }) => {
    await page.waitForSelector('section:has(a[rel="me"])')
    await expect(page.locator('section a[rel="me"]')).toHaveCount(5)
    await expect(page.locator('section:has(a[rel="me"]) img, section:has(a[rel="me"]) svg')).toHaveCount(9)
  })

  test('Recent & Popular Posts', async ({ page }) => {
    await expect(page.locator('#recent .post')).toHaveCount(11)
    await expect(page.locator('#popular .post')).toHaveCount(9)
  })
})
