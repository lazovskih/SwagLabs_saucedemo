import { test, expect } from "../fixtures/auth.fixture";
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
    // Navigate directly to the products page using the pre-authenticated state
    await productsPage.open();
  });

  test("completes checkout for a selected product", async ({ page }) => {
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
    // Add multiple products to cart
    await productsPage.addProductsToCart([products[1].Name, products[2].Name]);
    expect(await productsPage.getCartCount()).toBe(2);

    // View cart
    await productsPage.viewCart();

    // Verify cart page title, then start checkout
    expect(await cartPage.getPageTitle()).toBe(cartPage.pageTitleText);
    await cartPage.startCheckout();

    // Verify checkout step one page title
    const checkoutPageTitle = await checkoutStepOnePage.getPageTitle();
    expect(checkoutPageTitle).toBe(checkoutStepOnePage.pageTitleText);

    // Fill shipping information and continue to overview page
    await checkoutStepOnePage.fillShippingInformation(shippingInfo[0]);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); // Scroll to bottom to ensure all elements are visible

    // Verify checkout step two page title
    expect(await checkoutStepTwoPage.getPageTitle()).toBe(checkoutStepTwoPage.pageTitleText);

    // Verify subtotal, tax, and total amounts
    const actualSubtotal = parseFloat(await checkoutStepTwoPage.getSubtotal());
    const expectedSubtotal = parseFloat((products[1].Price + products[2].Price).toFixed(2));

    expect(actualSubtotal, "Verify subtotal is correct").toEqual(expectedSubtotal);

    // Calculate expected total based on subtotal and tax, then verify total
    const actualTax = parseFloat(await checkoutStepTwoPage.getTax());
    const expectedTotal = parseFloat((expectedSubtotal + actualTax).toFixed(2));
    const actualTotal = parseFloat(await checkoutStepTwoPage.getTotal());

    expect(actualTotal, "Verify total is correct").toEqual(expectedTotal);
  });
});
