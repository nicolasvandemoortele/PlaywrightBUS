import { type Page, type Locator, expect } from '@playwright/test'

export class LoginPage {

    private readonly page: Page;
    private readonly title: Locator;
    private readonly subtitle: Locator;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly signInButton: Locator;
    private readonly forgotPassword: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('h2');
        this.subtitle = page.locator('h2 + span');
        this.signInButton = page.getByRole('button', { name: 'Sign in'});
        this.emailInput = page.getByRole('textbox', { name: 'email'});
        this.passwordInput = page.getByRole('textbox', { name: 'password'});
        this.forgotPassword = page.getByRole('link', { name: 'Forgot password?'});
    }

    async navigate() {
        await this.page.goto('/');
    }

    async checkSubtitle(name: string) {
        await expect(this.subtitle).toHaveText(name, { ignoreCase: true });
    }

    async fillEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async signIn() {
        await this.signInButton.click();
        await this.page.waitForURL('/nodes');
    }
}