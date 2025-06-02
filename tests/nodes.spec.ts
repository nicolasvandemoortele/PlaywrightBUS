import { test, expect } from '../fixtures/fixture'

test.describe('Nodes page tests', () => {

    // Positive tests
    test('Nodes list is displayed correctly', async({ nodesPage }) => {
        await nodesPage.checkTitle();
        await nodesPage.checkPageElements();
    });

    test.fail('Open node in a new tab', {
        annotation: {
            type: 'issue',
            description: 'Open node details in a new tab does not work'
        }
    }, async({ nodesPage, context }) => {
        const newTabPromise = context.waitForEvent('page');

        const nodeList = await nodesPage.getNodes()
        await nodeList.first().click({ modifiers: ["ControlOrMeta"]})
        const newTab = await newTabPromise;

        await nodesPage.checkTitle();
    });


        // Search for existing node
        // Search with special chars
        // Filter by team
        // Filter by emit/receive
        // Display nodes per page
        // Navigate between pages
        // Click on add new

    // Negative tests
        // Search for non existent node
        // Try to go to a non-existent page

    // Non-functional tests
        // Page is WCAG compliant, critical

})