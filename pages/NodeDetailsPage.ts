import { type Page, type Locator, expect } from '@playwright/test'

export class NodeDetailsPage {

    private readonly page: Page;
    private readonly title: Locator;
    private readonly nameInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.getByRole('heading', { name: 'Details and settings' });
        this.nameInput = page.locator('input[name=name]');
    }

    async checkTitle() {
        await expect(this.title).toBeVisible();
    }

    async assertName(name: string) {
        await expect(this.nameInput).toHaveValue(name);
    }
}