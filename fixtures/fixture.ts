import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { NodesPage } from '../pages/NodesPage';
import { waitForAPIResponse } from '../helpers/utilities';
import { NodeDetailsPage } from '../pages/NodeDetailsPage';
import { Menu } from '../pages/Menu';

type BusFixture = {
    loginPage: LoginPage;
    nodesPage: NodesPage;
    nodeDetailsPage: NodeDetailsPage;
    menu: Menu;
    waitForAPI;
}

export const test = base.extend<BusFixture>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();

        await use(loginPage);
    },

    nodesPage: async ({ page }, use) => {
        const nodesPage = new NodesPage(page);
        await nodesPage.navigate();

        await use(nodesPage);
    },

    nodeDetailsPage: async ({ page }, use) => {
        await use(new NodeDetailsPage(page));
    },

    menu: async({ page }, use) => {
        await use(new Menu(page));
    },

    waitForAPI: async ({page}, use) => {
        await use((url, method, code) => 
            waitForAPIResponse(page, url, method, code) 
        )
    }
})

export { expect } from '@playwright/test'