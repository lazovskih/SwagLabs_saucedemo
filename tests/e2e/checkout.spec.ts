import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { loadTestData, ProductData } from "../utilities/dataLoader";

test.describe("Checkout flow", () => {
  test("completes checkout for a selected product", async ({ page }) => {
    // Login as standard user
    const loginPage = new LoginPage(page);
    await loginPage.loginAsStandardUser();

    // Add products to cart
    const productsPage = new ProductsPage(page);
    const products = loadTestData<ProductData>("products");
    
    await productsPage.addProductToCart(products[2].Name);
    expect(await productsPage.getCartCount()).toBe(1);

    // View cart
    await productsPage.viewCart();

    const cartPage = new CartPage(page);
    expect(await cartPage.getPageTitle()).toBe("Your Cart");

    // Start checkout
    await cartPage.startCheckout();

    // Fill shipping information
    const checkoutPage = new CheckoutPage(page);
    expect(await checkoutPage.getPageTitle()).toBe("Checkout: Your Information");

    // Fill shipping information and continue to overview page
    await checkoutPage.fillShippingInformation("Jane", "Doe", "90210");
    expect(await checkoutPage.getPageTitle()).toBe("Checkout: Overview");

    // Finish order
    await checkoutPage.finishOrder();
    expect(await checkoutPage.getCompleteHeaderText()).toBe("Thank you for your order!");
  });
});
