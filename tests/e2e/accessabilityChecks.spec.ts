import { test, expect } from "../fixtures";
import { AxeBuilder } from "@axe-core/playwright";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutStepOnePage } from "../pages/CheckoutStepOnePage";
import { CheckoutStepTwoPage } from "../pages/CheckoutStepTwoPage";
import { loadTestData, ProductData, ShippingData } from "../utilities/dataLoader";
import { LoginPage } from "tests/pages/LoginPage";
import { navigateAndVerifyHeader } from "tests/utilities/navigation";

test.describe("Accessibility checks", () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutStepOnePage: CheckoutStepOnePage;
  let checkoutStepTwoPage: CheckoutStepTwoPage;
  let products: ProductData[];
  let shippingInfo: ShippingData[];
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutStepOnePage = new CheckoutStepOnePage(page);
    checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    products = loadTestData<ProductData>("products");
    shippingInfo = loadTestData<ShippingData>("shipping");
    loginPage = new LoginPage(page);

    // Navigate directly to the products page using the pre-authenticated state
    await productsPage.open();
  });

  test("Accessibility check: checkout flow", async ({}) => {
    test.step("product page", async () => {
      // Navigate directly to the products page using the pre-authenticated state
      // await productsPage.open(); // TODO: Remove this line if not needed

      // Perform accessibility check on the products page
      const accessibilityScanProductPage = await new AxeBuilder({ page: productsPage.page }).analyze();
      expect(accessibilityScanProductPage.violations, "Accessibility violations found: product page").toEqual([]);
    });

    test.step("cart page", async ({}) => {
      // Add products to cart
      await productsPage.addProductToCart(products[2].Name);
      expect(await productsPage.getCartCount()).toBe(1);

      // View cart
      await productsPage.viewCart();

      expect(await cartPage.getPageTitle()).toBe("Your Cart");

      // Perform accessibility check on the products page
      const accessibilityScanCartPage = await new AxeBuilder({ page: cartPage.page }).analyze();
      expect(accessibilityScanCartPage.violations, "Accessibility violations found: cart page").toEqual([]);
    });
    test.step("Checkout page 1", async ({}) => {
      // Navigate directly to the products page using the pre-authenticated state
      // await productsPage.open(); // TODO: Remove this line if not needed

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

      // Perform accessibility check on the products page
      const accessibilityScanCheckoutPage1 = await new AxeBuilder({ page: cartPage.page }).analyze();
      expect(accessibilityScanCheckoutPage1.violations, "Accessibility violations found: Checkout page 1").toEqual([]);
    });

    test.step("Checkout page 2", async ({}) => {
      // Navigate directly to the products page using the pre-authenticated state
      // await productsPage.open(); // TODO: Remove this line if not needed

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

      // Perform accessibility check on the products page
      const accessibilityScanCheckoutPage2 = await new AxeBuilder({ page: cartPage.page }).analyze();
      expect(accessibilityScanCheckoutPage2.violations, "Accessibility violations found: Checkout page 2").toEqual([]);

      // Finish order
      await checkoutStepTwoPage.finishOrder();
      expect(await checkoutStepTwoPage.getCompleteHeaderText()).toBe("Thank you for your order!");
    });
  });
});
