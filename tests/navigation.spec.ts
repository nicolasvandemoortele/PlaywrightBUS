import { test, expect } from '../fixtures/fixture'

test.describe('Navigation', () => {

    /**
     * Test: Documentation opens successfully in a new tab
     * Showcase: Tabs
     */
    test('Documentation opens successfully in a new tab', {
        tag: ['@production','@staging','@dev']
    }, async({ menu, nodesPage, context }) => {
        const [newTab] = await Promise.all([
            context.waitForEvent('page'),
            await menu.openDocs()
        ]);

        // Check that documentation has been opened in a new page
        await expect(newTab.locator('h1')).toHaveText('Ringier Event Bus');
        
        // Check that the original page is still on the Nodes list
        await nodesPage.checkTitle();
    })

    test('Teams page opens successfully', {
        tag: ['@production','@staging','@dev']
    }, async({ menu, nodesPage, teamsPage }) => {
        await menu.openTeams();
        await teamsPage.assertTitle();
    })
})