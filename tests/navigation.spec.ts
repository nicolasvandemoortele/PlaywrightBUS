import { test, expect } from '../fixtures/fixture'

test.describe('Navigation', () => {

    test('Open documentation in a new tab', async({ menu, nodesPage, context }) => {
        const [newTab] = await Promise.all([
            context.waitForEvent('page'),
            await menu.openDocs()
        ]);

        // Check that documentation has been opened in a new page
        await expect(newTab.locator('h1')).toHaveText('Ringier Event Bus');
        
        // Check that the original page is still on the Nodes list
        await nodesPage.checkTitle();
    })
})