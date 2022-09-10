# Photon Pictures Warehouse Front

## Introduction

This project is the frontend of the warehouse management system. 

## Usage

**IMPORTANT: If you need to develop locally, make sure to create a file named .env.local in the root directory to configure variables including:**

```shell
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_TOKEN=
SENDGRID_API_KEY=
```

The file .env.local will not be uploaded to GitHub, and the variables should be set during deployment.

This project is initialized with PNPM. To install all dependencies, run:

```shell
pnpm install
```

To start the development server, run:

```shell
pnpm run dev
```

The project does not support static build. To create an optimized production build, run:

```shell
pnpm run build
```

Then run the following command to start the production server:

```shell
next
```
