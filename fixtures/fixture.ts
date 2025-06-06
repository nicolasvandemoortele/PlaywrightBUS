import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { NodesPage } from '../pages/NodesPage';
import { waitForAPIResponse } from '../helpers/utilities';
import { NodeDetailsPage } from '../pages/NodeDetailsPage';
import { Menu } from '../pages/Menu';
import AxeBuilder from '@axe-core/playwright';
import { TeamsPage } from '../pages/TeamsPage';
import { StatusPage } from '../pages/StatusPage';
import { UsersPage } from '../pages/UsersPage';

export type AxeOptions = {
  defaultLevel: string[];
};

type BusFixture = {
    loginPage: LoginPage;
    nodesPage: NodesPage;
    nodeDetailsPage: NodeDetailsPage;
    teamsPage: TeamsPage;
    statusPage: StatusPage;
    usersPage: UsersPage;
    menu: Menu;
    waitForAPI;
    axeBuild;
}

export const test = base.extend<BusFixture & AxeOptions>({
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

    teamsPage: async ({ page }, use) => {
        await use(new TeamsPage(page));
    },

    statusPage: async ({ page }, use) => {
        await use(new StatusPage(page));
    },

    usersPage: async ({ page }, use) => {
        await use(new UsersPage(page));
    },

    menu: async({ page }, use) => {
        await use(new Menu(page));
    },

    waitForAPI: async ({page}, use) => {
        await use((url, method, code) => 
            waitForAPIResponse(page, url, method, code) 
        )
    },

    defaultLevel: [['wcag2a','wcag2aa','wcag21a','wcag21aa'], { option: true }],

    axeBuild: async ({ page, defaultLevel }, use) => {
        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(defaultLevel)
            .analyze();
        await use(accessibilityScanResults);
    },
})

export { expect } from '@playwright/test'