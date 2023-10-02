# Frontend application

## Useful commands

```sh
npm i # Install all dependencies
npm run dev # Start development server
```

Make sure to reuse the same `OPVIOUS_TOKEN` environment variable you used to
register the model defined in the `specification` folder so that it can be
picked up by the frontend.


## Relevant sources

All the optimization-related code is contained in the [`/solve` API
route](pages/api/solve.ts). It interfaces with the Opvious API using the
[TypeScript SDK](https://www.opvious.io/sdk.ts/modules/opvious.html).
