import { test, expect } from '@playwright/test'

test.describe('Auth API tests', () => {

    const apiBaseUrl = process.env.API_GW;
    test.use({
        baseURL: apiBaseUrl
    });

    test('Successful API login', {}, async({ request }) => {
        const username = process.env.USERNAME;
        const password = process.env.PASSWORD;
        const response = await request.post('v1/admin/api/users/login', {
            data: {
                email: username,
                password: password
            }
        })
        await expect(response).toBeOK();
        expect(await response.json()).toHaveProperty('token');
    })

    test('Unsuccessful login through API', {}, async({ request }) => {
        const response = await request.post('v1/admin/api/users/login', {
            data: {
                email: 'Wrongusername',
                password: 'Wrongpassword'
            }
        })

        await expect(response).not.toBeOK()
        expect(await response.status()).toEqual(404)
    })
})

test.describe('Authenticated API tests', () => {

    let apiContext;
    const apiBaseUrl = process.env.API_GW;
    test.use({
        baseURL: apiBaseUrl
    });

    test.beforeAll('Authenticate', async({ request, playwright }) => {
        const username = process.env.USERNAME;
        const password = process.env.PASSWORD;
        const response = await request.post('v1/admin/api/users/login', {
            data: {
                email: username,
                password: password
            }
        })
        await expect(response).toBeOK();
        expect(await response.json()).toHaveProperty('token');
        const json = await response.json();
        apiContext = await playwright.request.newContext({
            extraHTTPHeaders: {
                'x-api-key': json.token
            }
        })
    })

    test('Get the nodes', async({}) => {
        const response = await apiContext.get('v1/admin/api/nodes');
        await expect(response).toBeOK();
        const json = await response.json();
        expect(json.length).toBeGreaterThan(1);
    })
})
