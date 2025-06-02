import { test as setup } from '../fixtures/fixture'
import { request } from '@playwright/test'
import path from 'path'

const authFile = path.join(__dirname, '../.auth/user.json')

setup('Log user in', async({ page, loginPage }) => {
    const email = process.env.USERNAME ? process.env.USERNAME : ''
    const password = process.env.PASSWORD ? process.env.PASSWORD : ''

    await loginPage.fillEmail(email)
    await loginPage.fillPassword(password)
    await loginPage.signIn()

    await page.context().storageState({ path: authFile });
})