# Photon Pictures Warehouse Frontend

Site location: [warehouse.uiucphoton.site](https://warehouse.uiucphoton.site)

Minimalist warehouse management & presentation system frontend for Photon Pictures at UIUC, serves as the unified platform for organization members to browse all loanable filming kits provided by Photon Pictures and send borrow requests.

<p float="left">
  <img width="250" alt="Screenshot1" src="https://user-images.githubusercontent.com/30245379/191823325-cfce2c55-98c3-4561-b193-82c0bd359521.png">
  <img width="250" alt="Screenshot2" src="https://user-images.githubusercontent.com/30245379/191823337-b51b257e-6531-47de-8337-f14bda042857.png">
  <img width="250" alt="Screenshot3" src="https://user-images.githubusercontent.com/30245379/191823466-82fcce94-9679-4141-8c6d-dae19db0e778.png">
</p>

## ✨ Features

* 🎨 Minimalist design
* 📚 Strightforward user experience
* 🌋 Fast page respond with SWR
* 📱 Responsive design on all pages
* ⚙️ Backend & Email integration

## 🖥 Technologies

* Language: [TypeScript](https://www.typescriptlang.org)
* UI Framework: [React.js](https://reactjs.org)
* Component Library: [Ant Design UI](https://ant.design)
* Application Framework: [Next.js](https://nextjs.org)
* Backend Service (not part of this repo): [Sanity](https://www.sanity.io)
* Email Sercice (not part of this repo): [SendGrid](https://sendgrid.com)

## 📦 Usage

**IMPORTANT: If you need to develop locally, make sure to create a file named .env.local in the root directory to configure variables including:**

```shell
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_TOKEN=
SENDGRID_API_KEY=
SENDGRID_EMAIL=
SENDGRID_EMAIL_NAME=
SENDGRID_TEMPLATE_ID=
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
