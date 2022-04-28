Starknet Status Caching Lambda
===

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
