import { type Page, type Locator, expect } from '@playwright/test'

export class NodeDetailsPage {

    private readonly page: Page;
    private readonly title: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.getByRole('heading', { name: 'Details and settings'})
    }

    async checkTitle() {
        await expect(this.title).toBeVisible();
    }
}