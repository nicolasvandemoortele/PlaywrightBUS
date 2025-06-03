import { type Page, type Locator, expect } from '@playwright/test'

export class TeamsPage {

    private readonly page: Page;
    private readonly title: Locator;
    private readonly teams: Locator;
    private readonly addTeamButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.getByRole('heading');
        this.teams = page.locator('tbody tr');
        this.addTeamButton = page.getByRole('button', { name: 'Add New' });
    }

    async navigate() {
        await this.page.goto('/teams');
    }

    async assertTitle() {
        await expect(this.title).toHaveText('Teams');
    }

    async assertTeamListIsEmpty() {
        const teamsList = await this.teams;
        await expect(await teamsList.count()).toEqual(1)
        await expect(teamsList.first()).toHaveText('No teams')
        await expect(this.addTeamButton).toBeVisible();
    }
}