import { test } from '../fixtures/fixture'

test.describe('Teams page tests', () => {

    /**
     * Test: Page displays correctly when there are no teams
     * Showcase: Mock API response
     */
    test('Page displays correctly when there are no teams', {
        tag: ['@production','@staging','@dev']
    }, async({ teamsPage, page }) => {
        await page.route('*/**/api/user-groups', async route => {
            const json = [];
            await route.fulfill({ json })
        });
        await teamsPage.navigate();

        await teamsPage.assertTeamListIsEmpty();
    })
})