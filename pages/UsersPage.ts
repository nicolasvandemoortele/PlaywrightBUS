import { type Page, type Locator, expect } from '@playwright/test'

export class UsersPage {

    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('/users');
    }
}