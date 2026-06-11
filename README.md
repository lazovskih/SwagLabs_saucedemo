# 🛒 SauceDemo – Playwright Automation Demo Project

A demo end-to-end test automation project for the [SauceDemo](https://www.saucedemo.com) website — a simple e-commerce application designed specifically for testing practice. The project is built with [Playwright](https://playwright.dev/) and TypeScript.

---

## 📹 Video Recording

> 🎬 **Watch the test execution demo on YouTube:** [https://youtu.be/UbdB-XWtiXM](https://youtu.be/UbdB-XWtiXM)

---

## 📋 About the Project

This project demonstrates automated E2E testing of key user flows on the [www.saucedemo.com](https://www.saucedemo.com) website, including:

- 🔐 User authentication (login / logout)
- 🛍️ Adding and removing items from the shopping cart
- 💳 Checkout flow (customer details → order summary → order confirmation)

The tests are written using the **Page Object Model (POM)** pattern for maintainability and clarity.

### Tech Stack

| Tool                                  | Version           |
| ------------------------------------- | ----------------- |
| [Playwright](https://playwright.dev/) | ^1.59.1           |
| TypeScript                            | via `@types/node` |
| Node.js                               | LTS               |
| dotenv                                | ^17.4.2           |

### CI/CD

Tests are automatically executed on every push and pull request to the `main` / `master` branch via **GitHub Actions**. Test credentials are stored securely as GitHub Secrets in the `TEST` environment.

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Git](https://git-scm.com/)
- A SauceDemo account — use the standard credentials provided at [www.saucedemo.com](https://www.saucedemo.com)

---

## 🚀 Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/lazovskih/SwagLabs_saucedemo.git
cd online_store_playwright
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Install Playwright browsers

```bash
npx playwright install --with-deps
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```bash
cp .env.example .env   # if an example file is available, otherwise create manually
```

Add your credentials to `.env`:

```env
STANDARD_USER=set_username
DEMO_PASSWORD=set_password
URL=https://www.saucedemo.com
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## ▶️ Running Tests

### Run all tests (headless)

```bash
npm test
```

or equivalently:

```bash
npx playwright test
```

### Run tests in headed mode (browser visible)

```bash
npm run test:headed
```

### Run tests with the interactive Playwright UI

```bash
npx playwright test --ui
```

### Run a specific test file

```bash
npx playwright test tests/e2e/cart.spec.ts
npx playwright test tests/e2e/checkout.spec.ts
```

### Run tests on a specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

---

## 📊 Viewing the Test Report

After a test run, open the HTML report with:

```bash
npm run test:report
```

or:

```bash
npx playwright show-report
```

---

## 📁 Project Structure

```
sauselabsdemo/
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions CI workflow
├── data/
│   └── products.json               # External test data (products)
├── tests/
│   ├── e2e/
│   │   ├── cart.spec.ts            # Cart tests
│   │   └── checkout.spec.ts        # Checkout flow tests
│   ├── pages/                      # Page Object Model classes
│   │   ├── BasePage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutPage.ts
│   │   ├── LoginPage.ts
│   │   └── ProductsPage.ts
│   └── utilities/
│       └── dataLoader.ts           # Helper to load test data
├── playwright.config.ts            # Playwright configuration
├── package.json
├── .env                            # Local environment variables (not committed)
├── .env.example                    # Environment variable template
└── README.md
```

---

## 🌐 Target Application

- **URL:** [https://www.saucedemo.com](https://www.saucedemo.com)
- **Type:** Demo e-commerce web application
- **Purpose:** QA automation practice

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
