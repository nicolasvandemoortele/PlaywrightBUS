import { test, expect } from '@playwright/test'

test.describe('Event Bus Events API', () => {

    let apiContext;
    const apiBaseUrl = process.env.API_GW;
    const username = process.env.NODE_USERNAME;
    const password = process.env.NODE_PASSWORD;
    const node_id = process.env.NODE_UUID;
    const date = new Date;
    const isoTimestamp = date.toISOString();

    test.use({
        baseURL: apiBaseUrl
    });

    test.beforeAll(async ({ request, playwright }) => {
        const response = await request.post('v1/login', {
            data: {
                username: username,
                password: password,
                node_id: node_id
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

    test('Send an event to the bus', async({}) => {
        const response = await apiContext.post('v1/events', {
            data: [
                {
                    events: [
                        "HTTPResponse"
                    ],
                    from: node_id,
                    reference: "200",
                    created_at: isoTimestamp,
                    version: "2.0.0",
                    route: "",
                    payload: {
                        code: 200
                    }
                }
            ]
        })

        await expect(response).toBeOK();
    })
})