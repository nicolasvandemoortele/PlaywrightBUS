import { type Page, type Locator, expect } from '@playwright/test'
import { waitForAPIResponse } from '../helpers/utilities';

export class NodesPage {

    private readonly page: Page;
    private readonly title: Locator;
    private readonly search: Locator;
    private readonly teamFilter: Locator;
    private readonly emitFilter: Locator;
    private readonly filterEmit: Locator;
    private readonly filterReceive: Locator;
    private readonly filterBoth: Locator;
    private readonly nodePerPage: Locator;
    private readonly pageInput: Locator;
    private readonly previous: Locator;
    private readonly next: Locator;
    private readonly addNewButton: Locator;
    private readonly nodes: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('h2').first();
        this.search = page.getByRole('textbox', { name: 'Search' });
        this.teamFilter = page.getByText('All teams');
        this.emitFilter = page.getByText('Emits and receives events');
        this.filterEmit = page.getByRole('menuitem', { name: 'Emits events'});
        this.filterReceive = page.getByRole('menuitem', { name: 'Receives events'});
        this.filterBoth = page.getByRole('menuitem', { name: 'Emits and receives events'});
        this.nodePerPage = page.getByLabel('nodes per page:');
        this.pageInput = page.getByRole('textbox', { name: 'page of' });
        this.previous = page.getByRole('button', { name: 'previous '});
        this.next = page.getByRole('button', { name: 'next '});
        this.addNewButton = page.getByRole('button', { name: 'Add New'});
        this.nodes = page.locator('tbody tr');
    }

    async navigate() {
        const [response] = await Promise.all([
            waitForAPIResponse(this.page, '/api/nodes'),
            await this.page.goto('/nodes')
        ]);
        await expect(response.ok()).toBeTruthy();
        const json = await response.json();
        await expect(json.length).toBeGreaterThan(1);
    }

    async checkTitle() {
        await expect(this.title).toHaveText('Nodes', { ignoreCase: true });
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

    async getAllNodes() {
        return await this.nodes.all();
    }

    async searchNode(term: string) {
        await this.search.clear();
        await this.search.fill(term);
        await this.search.press('Enter');
    }

    async goToPage(pageNumber: string) {
        await this.pageInput.clear();
        await this.pageInput.fill(pageNumber);
        await this.pageInput.press('Enter');
    }

    async goToNextPage() {
        await this.next.click();
    }

    async goToPreviousPage() {
        await this.previous.click();
    }

    async selectTeam(team: string) {
        await this.teamFilter.click();
        await this.page.getByRole('menuitem', { name: team }).click();
    }

    /**
     * Filters node by emitting, receving or both
     * @param direction valid options: "emits", "receives", "both"
     */
    async filterBy(direction: string) {
        await this.emitFilter.click()
        switch (direction) {
            case 'emits':
                await this.filterEmit.click();
                break;
            case 'receives':
                await this.filterReceive.click();
                break;
            case 'both':
                await this.filterBoth.click();
                break;
            default:
                console.log('No such filter');
        }
    }

    async displayNodesPerPage(num: string) {
        await this.nodePerPage.selectOption(num);
    }

    async isOnLastPage() {
        const classAttr = await this.next.getAttribute('class');
        return classAttr?.includes('disabled');
    }

    async isOnFirstPage() {
        const classAttr = await this.previous.getAttribute('class');
        return classAttr?.includes('disabled');
    }

    async assertNodeListIsNotEmpty() {
        const nodesList = await this.nodes;
        await expect(await nodesList.count()).toBeGreaterThan(1);
        await expect(nodesList.first()).not.toHaveText('No nodes found');
    }

    async assertNodeListIsEmpty() {
        const nodesList = await this.nodes;
        await expect(nodesList).toHaveCount(1);
        await expect(nodesList).toHaveText('No nodes found');
    }
}