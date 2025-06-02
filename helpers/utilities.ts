import { type Page } from '@playwright/test'    

export const waitForAPIResponse = async (
        page: Page, 
        url: string, 
        method: string = 'GET', 
        code: number = 200,
    ) => {
        return page.waitForResponse(
            (res) => 
                res.url().includes(url)
                && res.request().method() === method
                && res.status() === code
        );
    }