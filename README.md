# DCO Portal

This repository is for the DCO Portal service, and includes all components including the infrastructure-as-code and the applications.

tl;dr run these commands to get started:

```
npm ci
docker compose up
npm run db-generate
npm run db-migrate-dev
npm run db-seed
```

Then run the application with `npm run dev`.

This repository includes a basic structure and configuration files covering the common aspects of a service. This includes setup such as:

- ESlint
- Commitlint
- Prettier
- Husky
- Docker
- Prisma
