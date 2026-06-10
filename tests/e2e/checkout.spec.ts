import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutStepOnePage } from "../pages/CheckoutStepOnePage";
import { CheckoutStepTwoPage } from "../pages/CheckoutStepTwoPage";
import { loadTestData, ProductData, ShippingData } from "../utilities/dataLoader";

test.describe("Checkout flow", () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutStepOnePage: CheckoutStepOnePage;
  let checkoutStepTwoPage: CheckoutStepTwoPage;
  let products: ProductData[];
  let shippingInfo: ShippingData[];

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutStepOnePage = new CheckoutStepOnePage(page);
    checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    products = loadTestData<ProductData>("products");
    shippingInfo = loadTestData<ShippingData>("shipping");
  });

  test("completes checkout for a selected product", async ({ page }) => {
    // Login as standard user
    const loginPage = new LoginPage(page);
    await loginPage.loginAsStandardUser();

    // Add products to cart
    await productsPage.addProductToCart(products[2].Name);
    expect(await productsPage.getCartCount()).toBe(1);

    // View cart
    await productsPage.viewCart();

    expect(await cartPage.getPageTitle()).toBe("Your Cart");

    // Start checkout
    await cartPage.startCheckout();

    // Fill shipping information
    expect(await checkoutStepOnePage.getPageTitle()).toBe("Checkout: Your Information");

    // Fill shipping information and continue to overview page
    await checkoutStepOnePage.fillShippingInformation(shippingInfo[0]);
    expect(await checkoutStepTwoPage.getPageTitle()).toBe("Checkout: Overview");

    // Finish order
    await checkoutStepTwoPage.finishOrder();
    expect(await checkoutStepTwoPage.getCompleteHeaderText()).toBe("Thank you for your order!");
  });

  test("completes checkout and verify totals for multiple selected products", async ({ page }) => {
    // Login as standard user
    const loginPage = new LoginPage(page);
    await loginPage.loginAsStandardUser();

    // Navigate to Products page
    productsPage.open();

    await productsPage.addProductsToCart([products[1].Name, products[2].Name]);
    expect(await productsPage.getCartCount()).toBe(2);

    await productsPage.viewCart();

    expect(await cartPage.getPageTitle()).toBe(cartPage.pageTitleText);
    await cartPage.startCheckout();

    const checkoutPageTitle = await checkoutStepOnePage.getPageTitle();
    expect(checkoutPageTitle).toBe(checkoutStepOnePage.pageTitleText);

    await checkoutStepOnePage.fillShippingInformation(shippingInfo[0]);

    expect(await checkoutStepTwoPage.getPageTitle()).toBe(checkoutStepTwoPage.pageTitleText);

    const actualSubtotal = parseFloat(await checkoutStepTwoPage.getSubtotal());
    const expectedSubtotal = parseFloat((products[1].Price + products[2].Price).toFixed(2));

    expect(actualSubtotal, "Verify subtotal is correct").toEqual(expectedSubtotal);

    const actualTax = parseFloat(await checkoutStepTwoPage.getTax());
    const expectedTotal = parseFloat((expectedSubtotal + actualTax).toFixed(2));
    const actualTotal = parseFloat(await checkoutStepTwoPage.getTotal());

    expect(actualTotal, "Verify total is correct").toEqual(expectedTotal);
  });
});
