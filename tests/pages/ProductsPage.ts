import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductsPage extends BasePage {
  pageTitleText = "Products";
  pageUrl = "/inventory.html";
  
  // Page locators
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly shoppingCartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  getProductId(productName: string) {
    return productName.toLowerCase().replace(/\s+/g, "-");
  }

  getAddToCartButton(productName: string) {
    return this.page.locator(`[data-test="add-to-cart-${this.getProductId(productName)}"]`);
  }

  getRemoveButton(productName: string) {
    return this.page.locator(`[data-test="remove-${this.getProductId(productName)}"]`);
  }

  async addProductToCart(productName: string) {
    await this.getAddToCartButton(productName).click();
  }

  async addProductsToCart(productNames: string[]) {
    for (const name of productNames) {
      await this.addProductToCart(name);
    }
  }

  async getCartCount() {
    const count = await this.cartBadge.count();
    if (count === 0) return 0;
    const text = await this.cartBadge.textContent();
    return text ? Number(text.trim()) : 0;
  }

  async viewCart() {
    await this.shoppingCartLink.click();
  }
}
