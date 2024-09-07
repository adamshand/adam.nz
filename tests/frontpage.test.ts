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
    await expect(page.locator('.quote > a').getAttribute('href')).resolves.toMatch('/quotes/id/')
    await expect(page.locator('.meta > a').getAttribute('href')).resolves.toMatch('/search/by/')
  })

  test('Social Icons', async ({ page }) => {
    await page.waitForSelector('#social > a:has(img)')
    await expect(page.locator('#social > a:has(img)')).toHaveCount(5)
    await expect(page.locator('#social > img')).toHaveCount(1)
  })

  test('Recent & Popular Posts', async ({ page }) => {
    await expect(page.locator('#recent .title')).toHaveCount(11)
    await expect(page.locator('#popular .title')).toHaveCount(9)
  })
})
