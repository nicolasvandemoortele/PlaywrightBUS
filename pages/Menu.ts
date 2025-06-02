import { type Page, type Locator, expect } from '@playwright/test'

export class Menu {

    private readonly page: Page;
    private readonly teams: Locator;
    private readonly docs: Locator;

    constructor(page: Page) {
        this.page = page;
        this.docs = page.getByRole('link', { name: 'Documentation'});
    }

    async openDocs() {
        await this.docs.click();
    }
}