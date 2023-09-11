const {
    ClientBuilder,
    createAuthForClientCredentialsFlow,
    createHttpClient,
} = require('@commercetools/sdk-client-v2')
const { createApiBuilderFromCtpClient } = require('@commercetools/platform-sdk')
const fetch = require('node-fetch')

const projectKey = process.env.PROJECT_KEY
const scopes = [
    process.env.CT_SCOPES,
];
const authMiddlewareOptions = {
    host: 'https://auth.us-central1.gcp.commercetools.com',
    projectKey,
    credentials: {
        clientId: process.env.CT_CLIENT_ID,
        clientSecret: process.env.CT_SECRET_KEY,
    },
    oauthUri: process.env.adminAuthUrl || '',
    scopes: scopes,
    fetch,
}

const httpMiddlewareOptions = {
    host: 'https://api.us-central1.gcp.commercetools.com',
    fetch,
}

const client = new ClientBuilder()
    .withProjectKey(projectKey)
    .withMiddleware(createAuthForClientCredentialsFlow(authMiddlewareOptions))
    .withMiddleware(createHttpClient(httpMiddlewareOptions))
    .withUserAgentMiddleware()
    .build()

const apiRoot = createApiBuilderFromCtpClient(client)
export async function getProjectDetails() {
    return apiRoot.withProjectKey({ projectKey }).get().execute()
}

export default async function getProducts() {
    return apiRoot.withProjectKey({ projectKey }).products().get().execute()
}
