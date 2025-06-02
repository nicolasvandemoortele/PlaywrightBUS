import { type Page, type Locator, expect } from '@playwright/test'
import { waitForAPIResponse } from '../helpers/utilities';

export class NodesPage {

    private readonly page: Page;
    private readonly title: Locator;
    private readonly search: Locator;
    private readonly teamFilter: Locator;
    private readonly emitFilter: Locator;
    private readonly nodePerPage: Locator;
    private readonly pageInput: Locator;
    private readonly previous: Locator;
    private readonly next: Locator;
    private readonly addNewButton: Locator;
    private readonly nodes: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('h2').first();
        this.search = page.getByRole('textbox', { name: 'Search' })
        this.teamFilter = page.getByText('All teams');
        this.emitFilter = page.getByText('Emits and receives events');
        this.nodePerPage = page.getByLabel('nodes per page:')
        this.pageInput = page.getByRole('textbox', { name: 'page of' })
        this.previous = page.getByRole('button', { name: 'previous '});
        this.next = page.getByRole('button', { name: 'next '});
        this.addNewButton = page.getByRole('button', { name: 'Add New'});
        this.nodes = page.locator('tbody tr');
    }

    async navigate() {
        const promise = waitForAPIResponse(this.page, '/nodes')
        await this.page.goto('/nodes');
        await promise;
    }

    async checkTitle() {
        await expect(this.title).toHaveText('Nodes', { ignoreCase: true })
    }

    async checkPageElements() {
        await expect(this.search).toBeVisible();
        await expect(this.teamFilter).toBeVisible();
        await expect(this.emitFilter).toBeVisible();
        await expect(this.nodePerPage).toBeVisible();
        await expect(this.pageInput).toBeVisible();
        await expect(this.previous).toBeVisible();
        await expect(this.next).toBeVisible();
        await expect(this.addNewButton).toBeVisible();
    }

    async getNodes() {
        return await this.nodes;
    }
}