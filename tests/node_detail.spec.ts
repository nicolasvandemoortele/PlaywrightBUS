import { test } from '../fixtures/fixture'

test.describe('Node details page test', () => {

    test('Clicking on a node opens the correct node details page', {
        tag: ['@production','@staging','@dev']
    }, async ({ page, nodesPage, nodeDetailsPage }) => {
        const nodeList = await nodesPage.getAllNodes();
        const randomIndex = Math.floor(Math.random() * nodeList.length);
        const nodeInfo = await nodeList[randomIndex].innerText();
        await nodeList[randomIndex].click();
        const nodeName = nodeInfo.split('\t')[0];

        await nodeDetailsPage.assertName(nodeName);
    })

})