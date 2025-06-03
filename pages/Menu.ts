import { type Page, type Locator, expect } from '@playwright/test'
import { waitForAPIResponse } from '../helpers/utilities';

export class Menu {

    private readonly page: Page;
    private readonly teams: Locator;
    private readonly docs: Locator;
    private readonly users: Locator;
    private readonly tester: Locator;
    private readonly status: Locator;

    constructor(page: Page) {
        this.page = page;
        this.docs = page.getByRole('link', { name: 'Documentation'});
        this.teams = page.getByRole('link', { name: 'Teams'});
        this.users = page.getByRole('link', { name: 'Users'});
        this.tester = page.getByRole('link', { name: 'Event Tester'});
        this.status = page.getByRole('link', { name: 'Status'});
    }

    async openDocs() {
        await this.docs.click();
    }

    async openTeams() {
        const [response] = await Promise.all([
            waitForAPIResponse(this.page, '/api/user-groups'),
            await this.teams.click()
        ])
        await expect(response.ok()).toBeTruthy();
        const json = await response.json()
        await expect(json.length).toBeGreaterThan(1)
    }
}