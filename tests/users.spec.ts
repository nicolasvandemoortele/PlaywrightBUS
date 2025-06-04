import { test } from '../fixtures/fixture'

test.describe('Users page tests', () => {

    test('Navigate to users page', async({ usersPage }) => {
        await usersPage.navigate();
    })
})