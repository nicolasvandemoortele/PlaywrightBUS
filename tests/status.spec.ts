import { expect, test } from '../fixtures/fixture'
import { waitForAPIResponse } from '../helpers/utilities'

test.describe('Test status page', () => {

    /**
     * Test: Last checked updates after page hasn\'t been visited
     * Showcase: Clock, Wait for multiple APIs
     */
    test('Last checked updates after page hasn\'t been visited', {
        tag: ['@production','@staging','@dev']
    }, async({ statusPage, page }) => {
        test.slow()
        await statusPage.navigate();
        await page.clock.fastForward('30:00');

        // Check that the status still updates
        const responses = await Promise.all([
            waitForAPIResponse(page, '/api/e2emon/health/bus'),
            waitForAPIResponse(page, '/api/e2emon/health/bus')
        ]);
        for (const response of responses) {
            expect(response.ok()).toBeTruthy()
        }
    })
})