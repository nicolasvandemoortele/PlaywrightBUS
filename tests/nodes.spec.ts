import { expect, test } from '../fixtures/fixture'
import nodes from '../data/nodes.json'

test.describe('Nodes page tests', () => {

    /**
     * Test: All elements on Nodes page are displayed correctly
     * Showcase: 
     */
    test('Nodes list is displayed correctly', {
        tag: ['@production','@staging','@dev']
    }, async({ nodesPage }) => {
        await nodesPage.checkTitle();
        await nodesPage.checkPageElements();
    });

    /**
     * Test: Use can open a node details page in a new tab
     * Showcase: Annotations, Tabs, Control-click
     */
    test.fail('Open node in a new tab', {
        annotation: {
            type: 'issue',
            description: 'Open node details in a new tab has stopped working'
        },
        tag: ['@staging','@dev']
    }, async({ nodesPage, context }) => {
        const nodeList = await nodesPage.getNodes()
        const [newTab] = await Promise.all([
            context.waitForEvent('page'),
            await nodeList.first().click({ modifiers: ["ControlOrMeta"]})
        ])
        await expect(newTab.locator('h2')).toHaveText('Details and settings')

        await nodesPage.checkTitle();
    });

    /**
     * Test: Use can search for an existing node
     * Showcase: Randomization
     */    
    test('Search for existing node', {
        tag: ['@production','@staging','@dev']
    }, async({ nodesPage }) => {
        const nodesList = await nodesPage.getNodes();
        const nodesCount = await nodesList.count();
        const randomNode = Math.floor(Math.random() * nodesCount);
        const nodeToSearch = 
            await nodesList.nth(randomNode)
                .locator('td')
                .first()
                .innerText();
        await nodesPage.searchNode(nodeToSearch);
        const newNodesList = await nodesPage.getNodes();
        await expect(newNodesList.first()).toContainText(nodeToSearch);
    })

    /**
     * Test: Search for a node with special chars
     * Showcase: Modify API response
     */
    test('Search with special chars', {
        tag: ['@production','@staging','@dev']
    }, async({ nodesPage, page }) => {
        const searchTerm = '!@#$%^&*()/<>';
        await page.route('*/**/api/nodes', async(route) => {
            const response = await route.fetch();
            const json = await response.json()
            json.push(nodes.testNode);
            await route.fulfill({ json })
        })
        
        await page.reload();
        await nodesPage.searchNode(searchTerm);
        const nodesList = await nodesPage.getNodes();
        await expect(nodesList).toHaveCount(1);
        await expect(nodesList.first()).toContainText(searchTerm);
    })
    
    test('Filter by team', {
        tag: ['@production', '@staging', '@dev']
    }, async({ nodesPage, page }) => {
        await page.route('*/**/api/nodes', async route => {
            const json = nodes.filterNodes;
            await route.fulfill({ json });
        })
        await page.reload();
        await nodesPage.selectTeam('Team 1');
        const nodesList = await nodesPage.getAllNodes();
        for (const node of nodesList) {
            await expect(node).not.toContainText('Team 2');
            await expect(node).not.toContainText('Team 3');
        }
    })
    
    test('Filter only emitting nodes', {
        tag: ['@production', '@staging', '@dev']
    }, async({ nodesPage, page }) => {
        await page.route('*/**/api/nodes', async route => {
            const json = nodes.filterNodes;
            await route.fulfill({ json });
        })
        await page.reload();
        await nodesPage.filterBy('emits');
        const nodesList = await nodesPage.getAllNodes();
        for (const node of nodesList) {
            await expect(node).not.toContainText('receives only');
        }      
    })

    test('Display nodes per page', {
        tag: ['@production', '@staging', '@dev']
    }, async({ nodesPage }) => {
        await nodesPage.displayNodesPerPage('50');
        const nodeList = await nodesPage.getNodes();
        await expect(nodeList).toHaveCount(50);
    })

    /**
     * Test: Navigate to the last page then to the first page
     * Showcase: Loops
     */
    test('Navigate between pages', {
        tag: ['@production','@staging','@dev']
    }, async({ nodesPage }) => {
        
        let lastPage: boolean = false;
        while(!lastPage) {
            await nodesPage.goToNextPage();
            lastPage = await nodesPage.isOnLastPage() ? true : false;
        }

        await nodesPage.assertNodeListIsNotEmpty();
        
        let firstPage: boolean = false;
        while(!firstPage) {
            await nodesPage.goToPreviousPage();
            firstPage = await nodesPage.isOnFirstPage() ? true : false;
        }
        
        await nodesPage.assertNodeListIsNotEmpty();
    })
        // Click on add new

    // Negative tests
    
    test('Search for non existent node', {
        tag: ['@production','@staging','@dev']
    }, async({ nodesPage }) => {
        await nodesPage.searchNode('This node doesn\'t exist');
        await nodesPage.assertNodeListIsEmpty();
    })
        
    test('Go to a non-existent page', {
        tag: ['@production','@staging','@dev']
    }, async({ nodesPage }) => {
        await nodesPage.goToPage('0');
        await nodesPage.assertNodeListIsNotEmpty();
    })

    // Non-functional tests
    
    /**
     * Test: Nodes page adhere to accessiblity rules
     * Showcase: Accessibility testing, Attachment, Soft assertions
     */    
    test('Nodes page adhere to accessiblity rules', {
        tag: ['@production','@staging','@dev']
    }, async({ nodesPage, axeBuild }, testInfo) => {
        const accessibleResult = axeBuild;
        await expect.soft(accessibleResult.violations).toHaveLength(0);
        await testInfo.attach('accessibility-scan-results', {
            body: JSON.stringify(accessibleResult.violations, null, 2),
            contentType: 'application/json'
        });
    })

})