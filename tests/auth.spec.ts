import { test } from '../fixtures/fixture';

test.describe('Authentication', () => {

    test.use({ storageState: { cookies: [], origins: [] } })

    const envName = process.env.ENV_NAME ? process.env.ENV_NAME : 'dev';

    test('Subtitle correspond to the environment', {
        tag: ['@production','@staging','@dev']
    }, async({ loginPage }) => {
        await loginPage.checkSubtitle(envName)
    })
})