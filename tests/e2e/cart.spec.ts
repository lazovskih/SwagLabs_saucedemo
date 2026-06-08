import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { loadTestData, ProductData } from "../utilities/dataLoader";

const products = loadTestData<ProductData>("products");

test.describe("Shopping cart flow", () => {
  test("adds selected products to the cart and verifies cart contents", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAsStandardUser();

    const productsPage = new ProductsPage(page);
    await productsPage.addProductsToCart([products[0].Name, products[1].Name]);
    expect(await productsPage.getCartCount()).toBe(2);
    await productsPage.viewCart();

    const cartPage = new CartPage(page);
    expect(await cartPage.getPageTitle()).toBe("Your Cart");
    expect(await cartPage.getProductCount(products[0].Name)).toBe(1);
    expect(await cartPage.getProductCount(products[1].Name)).toBe(1);
    expect(await cartPage.getItemCount()).toBe(2);
  });

  test("button changes from 'Add to cart' to 'Remove' when clicked", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAsStandardUser();

    const productsPage = new ProductsPage(page);
    const productName = products[0].Name;

    const addToCartButton = productsPage.getAddToCartButton(productName);
    const removeButton = productsPage.getRemoveButton(productName);

    // Verify initial state
    await expect(addToCartButton).toBeVisible();
    await expect(removeButton).toBeHidden();

    // Click add to cart
    await addToCartButton.click();

    // Verify state changed
    await expect(addToCartButton).toBeHidden();
    await expect(removeButton).toBeVisible();
  });

  test("button changes from 'Remove' to 'Add to cart' when clicked", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAsStandardUser();

    const productsPage = new ProductsPage(page);

    // Loop through all products
    for (const product of products) {
      const addToCartButton = productsPage.getAddToCartButton(product.Name);
      const removeButton = productsPage.getRemoveButton(product.Name);

      // Add to cart first
      await addToCartButton.click();
      await expect(removeButton).toBeVisible();

      // Click remove
      await removeButton.click();

      // Verify state changed back
      await expect(removeButton).toBeHidden();
      await expect(addToCartButton).toBeVisible();
    }
  });

  test("cart badge updates quantity correctly when items are added and removed", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAsStandardUser();

    const productsPage = new ProductsPage(page);

    let expectedCount = 0;

    // Add all items and verify badge count increments
    for (const product of products) {
      const addToCartButton = productsPage.getAddToCartButton(product.Name);
      await addToCartButton.click();
      expectedCount++;
      
      await expect(productsPage.cartBadge).toBeVisible();
      await expect(productsPage.cartBadge).toHaveText(expectedCount.toString());
    }

    // Remove all items and verify badge count decrements
    for (const product of products) {
      const removeButton = productsPage.getRemoveButton(product.Name);
      await removeButton.click();
      expectedCount--;

      if (expectedCount === 0) {
        await expect(productsPage.cartBadge).toBeHidden();
      } else {
        await expect(productsPage.cartBadge).toHaveText(expectedCount.toString());
      }
    }
  });

  test("remove button on products page should not be present for items removed from cart", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAsStandardUser();

    const productsPage = new ProductsPage(page);
    
    // Add 3 items
    const itemsToAdd = [products[0].Name, products[1].Name, products[2].Name];
    await productsPage.addProductsToCart(itemsToAdd);

    // Open Cart
    await productsPage.viewCart();
    const cartPage = new CartPage(page);

    // Remove 2 items from the cart
    await cartPage.removeProduct(itemsToAdd[0]);
    await cartPage.removeProduct(itemsToAdd[1]);

    // Go back to products list
    await cartPage.continueShopping();

    // Verify the "Remove" button is NOT present for those removed items
    const removeButton1 = productsPage.getRemoveButton(itemsToAdd[0]);
    const removeButton2 = productsPage.getRemoveButton(itemsToAdd[1]);

    // Verify the "Remove" button is NOT present for those removed items
    await expect(removeButton1).toBeHidden();
    await expect(removeButton2).toBeHidden();
  });
});
