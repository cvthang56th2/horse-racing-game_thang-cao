import { test, expect } from '@playwright/test'

test.describe('Horse Racing Game - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('top-actions')).toBeVisible()
  })

  test('initial state, generate program, and list visibility toggle', async ({ page }) => {
    await expect(page.getByTestId('programs')).toBeVisible()
    await expect(page.getByTestId('programs-empty')).toBeVisible()

    await expect(page.getByTestId('horse-list')).toBeVisible()

    await page.getByTestId('btn-toggle-horses').click()
    await expect(page.getByTestId('horse-list')).toHaveCount(0)

    await page.getByTestId('btn-toggle-horses').click()
    await expect(page.getByTestId('horse-list')).toBeVisible()

    await page.getByTestId('btn-generate-program').click({ force: true })
    const firstProgram = page.getByTestId(/program-\d+/).first()
    await expect(firstProgram).toBeVisible()
    await expect(page.getByTestId('programs-empty')).toHaveCount(0)

    // Start button should be enabled now
    await expect(page.getByTestId('btn-start-all')).toBeEnabled()
  })

  test('start all races, pause and resume', async ({ page }) => {
    // Start button disabled before generating programs
    await expect(page.getByTestId('btn-start-all')).toBeDisabled()

    await page.getByTestId('btn-generate-program').click({ force: true })
    await expect(page.getByTestId(/program-\d+/).first()).toBeVisible()

    await page.getByTestId('btn-start-all').click({ force: true })
    const pauseButton = page.getByTestId('btn-toggle-pause')
    await expect(pauseButton).toBeVisible()

    // Button has bounce animation; use force
    await pauseButton.click({ force: true })
    await expect(pauseButton).toContainText('Resume')

    await pauseButton.click({ force: true })
    await expect(pauseButton).toContainText('Pause')
  })

  test('scroll links navigate to program anchors', async ({ page }) => {
    await page.getByTestId('btn-generate-program').click({ force: true })
    const scrollBar = page.getByTestId('scroll-programs')
    await expect(scrollBar).toBeVisible()

    const firstLink = page.getByTestId('scroll-link').first()
    const href = await firstLink.getAttribute('href')
    await firstLink.click({ force: true })

    if (href) {
      await expect.poll(async () => page.evaluate(() => window.location.hash)).toBe(href)
      const target = page.locator(href)
      await expect(target).toBeVisible()
    }
  })

  test('regenerate horses and generate programs count', async ({ page }) => {
    // Horse list shows 20 horses initially
    await expect(page.getByTestId('horse-list')).toContainText('(20 horses)')

    // Regenerate horses keeps the list visible and resets state
    await page.getByTestId('btn-regenerate-horses').click({ force: true })
    await expect(page.getByTestId('horse-list')).toBeVisible()

    // Generate programs twice, ensure programs exist and count is 6
    await page.getByTestId('btn-generate-program').click({ force: true })
    await page.getByTestId('btn-generate-program').click({ force: true })
    const programItems = page.getByTestId(/program-\d+$/)
    await expect(programItems).toHaveCount(6)
  })

  test('button labels and disabled states', async ({ page }) => {
    const toggleButton = page.getByTestId('btn-toggle-horses')
    await expect(toggleButton).toContainText('Hide Horses')
    await toggleButton.click({ force: true })
    await expect(toggleButton).toContainText('Show Horses')
    await toggleButton.click({ force: true })

    // Before generating programs, Start is disabled
    const startAll = page.getByTestId('btn-start-all')
    await expect(startAll).toBeDisabled()

    await page.getByTestId('btn-generate-program').click({ force: true })
    await expect(startAll).toBeEnabled()

    await startAll.click({ force: true })
    await expect(startAll).toBeDisabled()
  })

  test('pause stops horse movement (position remains stable)', async ({ page }) => {
    await page.getByTestId('btn-generate-program').click({ force: true })
    await page.getByTestId('btn-start-all').click({ force: true })
    const pauseButton = page.getByTestId('btn-toggle-pause')
    await expect(pauseButton).toBeVisible()

    // Pick first program and first horse position element
    const firstProgram = page.getByTestId(/program-\d+$/).first()
    // horse container is the absolutely positioned div within the track (z-20). Use xpath to find the absolute positioned mover in first program
    const mover = firstProgram.locator('div.relative.h-13 >> ..').locator('div.absolute.z-20').first()

    // Wait a moment for movement then capture position
    await page.waitForTimeout(500)
    const posBeforePause = await mover.evaluate(el => (el as HTMLElement).style.left)

    await pauseButton.click({ force: true })
    await expect(pauseButton).toContainText('Resume')

    // While paused, position should remain the same
    await page.waitForTimeout(700)
    const posWhilePaused = await mover.evaluate(el => (el as HTMLElement).style.left)
    expect(posWhilePaused).toBe(posBeforePause)

    // Resume and expect position to eventually change
    await pauseButton.click({ force: true })
    await expect(pauseButton).toContainText('Pause')
    await expect.poll(async () => mover.evaluate(el => (el as HTMLElement).style.left)).not.toBe(posBeforePause)
  })

  test('regenerating horses resets racing and results', async ({ page }) => {
    await page.getByTestId('btn-generate-program').click({ force: true })
    await page.getByTestId('btn-start-all').click({ force: true })
    await expect(page.getByTestId('btn-toggle-pause')).toBeVisible()

    await page.getByTestId('btn-regenerate-horses').click({ force: true })

    // Racing should stop (no pause button), programs should exist again
    await expect(page.getByTestId('btn-toggle-pause')).toHaveCount(0)
    await expect(page.getByTestId(/program-\d+$/).first()).toBeVisible()

    // Scroll links count equals program count
    const programCount = await page.getByTestId(/program-\d+$/).count()
    const scrollLinksCount = await page.getByTestId('scroll-link').count()
    expect(scrollLinksCount).toBe(programCount)
  })

  test('multiple rapid clicks on generate program', async ({ page }) => {
    // Rapid clicks should not break the app
    await page.getByTestId('btn-generate-program').click({ force: true })
    await page.getByTestId('btn-generate-program').click({ force: true })
    await page.getByTestId('btn-generate-program').click({ force: true })

    // Should still have programs
    await expect(page.getByTestId(/program-\d+$/).first()).toBeVisible()
    const programCount = await page.getByTestId(/program-\d+$/).count()
    expect(programCount).toBeGreaterThan(0)
  })

  test('horse list visibility with rapid toggles', async ({ page }) => {
    const toggleButton = page.getByTestId('btn-toggle-horses')

    // Rapid toggles should work correctly
    await toggleButton.click({ force: true })
    await expect(page.getByTestId('horse-list')).toHaveCount(0)

    await toggleButton.click({ force: true })
    await expect(page.getByTestId('horse-list')).toBeVisible()

    await toggleButton.click({ force: true })
    await expect(page.getByTestId('horse-list')).toHaveCount(0)

    await toggleButton.click({ force: true })
    await expect(page.getByTestId('horse-list')).toBeVisible()
  })

  test('accessibility - keyboard navigation', async ({ page }) => {
    // Test that buttons can be focused and activated with keyboard
    await page.getByTestId('btn-toggle-horses').focus()
    await expect(page.getByTestId('btn-toggle-horses')).toBeFocused()

    // Test Enter key activation
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('horse-list')).toHaveCount(0)

    // Test Space key activation
    await page.keyboard.press('Space')
    await expect(page.getByTestId('horse-list')).toBeVisible()

    // Test generate program with keyboard
    await page.getByTestId('btn-generate-program').focus()
    await page.keyboard.press('Enter')
    await expect(page.getByTestId(/program-\d+$/).first()).toBeVisible()
  })

  test('race completion and final results', async ({ page }) => {
    await page.getByTestId('btn-generate-program').click({ force: true })
    await page.getByTestId('btn-start-all').click({ force: true })

    // Wait for races to complete with a more reasonable timeout
    await page.waitForTimeout(10000) // 10 seconds should be enough for races to finish

    // Pause button should disappear when races finish
    await expect(page.getByTestId('btn-toggle-pause')).toHaveCount(0)

    // Start button should be enabled again
    await expect(page.getByTestId('btn-start-all')).toBeEnabled()

    // Should have final results (check for green text indicating final results)
    const finalResults = page.locator('text=🏆 Final Results')
    await expect(finalResults.first()).toBeVisible()
  })

  test('scroll links work for all programs', async ({ page }) => {
    await page.getByTestId('btn-generate-program').click({ force: true })

    const scrollLinks = page.getByTestId('scroll-link')
    const linkCount = await scrollLinks.count()

    // Test each scroll link
    for (let i = 0; i < linkCount; i++) {
      const link = scrollLinks.nth(i)
      const href = await link.getAttribute('href')

      await link.click({ force: true })

      if (href) {
        await expect.poll(async () => page.evaluate(() => window.location.hash)).toBe(href)
        const target = page.locator(href)
        await expect(target).toBeVisible()
      }
    }
  })

  test('horse table displays correct data', async ({ page }) => {
    const horseTable = page.getByTestId('horse-table')
    await expect(horseTable).toBeVisible()

    // Check table headers
    await expect(horseTable.locator('th')).toContainText(['Name', 'Color', 'Condition'])

    // Check that horses have data
    const horseRows = horseTable.locator('tbody tr')
    const rowCount = await horseRows.count()
    expect(rowCount).toBe(20) // Should have 20 horses

    // Check first row has data
    const firstRow = horseRows.first()
    await expect(firstRow.locator('td').first()).not.toBeEmpty()
    await expect(firstRow.locator('td').nth(2)).toContainText('%') // Condition percentage
  })

  test('program stats show live and final results', async ({ page }) => {
    await page.getByTestId('btn-generate-program').click({ force: true })

    // Before starting races, should show "Results" header (not the "No results yet" message)
    const firstProgram = page.getByTestId(/program-\d+$/).first()
    await expect(firstProgram.locator('h4:has-text("Results")')).toBeVisible()

    await page.getByTestId('btn-start-all').click({ force: true })

    // During race, should show live results
    await expect(firstProgram.locator('text=🔴 Live Results')).toBeVisible()

    // Wait for race completion with shorter timeout
    await page.waitForTimeout(10000)

    // After completion, should show final results
    await expect(firstProgram.locator('text=🏆 Final Results')).toBeVisible()
  })
})


