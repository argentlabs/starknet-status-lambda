# Starknet Status Caching Lambda

This lambda is used to cache the status of checkly services. This is useful as the checkly API is slow, has API keys and has a requests limit.
By using this lambda and vercel we can cache the status of the services and use them in the frontend.
We use `stale-while-revalidate` to cache the status for 10 seconds, and still serve the stale data when refetching the cache. To learn more about stale-while-revalidate, see [vercel docs](https://vercel.com/docs/concepts/edge-network/caching#stale-while-revalidate).

## Production

Feel free to use the hosted endpoint of this lambda in your dapp:

```
GET https://starknet-status.vercel.app/api/status
```

## Development

If you want to develop this lambda locally, you can use:

```
npx vercel dev
```

For further informations about this command, see [vercel docs](https://vercel.com/docs/cli#commands/dev).

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fargentlabs%2Fstarknet-status-lambda&env=ENDPOINT,HEADERS&envDescription=ENDPOINT%20EXAMPLE%3A%20https%3A%2F%2Fapi.checklyhq.com%2Fv1%2Fcheck-statuses%20HEADER%20EXAMPLE%3A%20%7B%22Authorization%22%3A%20%22Bearer%20API_KEY_HERE%22%2C%20%22X-Checkly-Account%22%3A%20%22ACCOUNT_ID_HERE%22%7D)

Vercel will ask you to input the required environment variables `ENDPOINT` and `HEADERS`

- `ENDPOINT:` https://api.checklyhq.com/v1/check-statuses
- `HEADERS:` {"Authorization": "Bearer API_KEY_HERE", "X-Checkly-Account": "ACCOUNT_ID_HERE"}
