// src/utils/shopifyConfig.js
// import { createAdminApiClient } from '@shopify/admin-api-client';

const shopifyConfig = {
 storeDomain: import.meta.env.VITE_SHOPIFY_STORE,
storefrontAccessToken: import.meta.env.VITE_SHOPIFY_TOKEN,
  apiVersion: '2024-01'
};

// Storefront Client for customer-facing operations
export const storefrontClient = {
  async query(query, variables = {}) {
    const response = await fetch(
      `https://${shopifyConfig.storeDomain}/api/${shopifyConfig.apiVersion}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': shopifyConfig.storefrontAccessToken,
        },
        body: JSON.stringify({ query, variables }),
      }
    );
    return response.json();
  }
};

export default shopifyConfig;