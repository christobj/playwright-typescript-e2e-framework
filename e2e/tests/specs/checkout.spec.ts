import { test, expect } from '../support/fixtures';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { registerNewUser } from '../support/auth.helper';

test.describe('Checkout', () => {
  test('completes checkout as a newly registered user', async ({ page, testData }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await registerNewUser(page, testData);

    const productsPage = new ProductsPage(page);
    await productsPage.goto();
    await productsPage.addFirstProductToCart();
    await expect(productsPage.continueShoppingButton).toBeVisible();
    await productsPage.continueShoppingButton.click();

    const cartPage = new CartPage(page);
    await cartPage.goto();
    await cartPage.proceedToCheckout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.orderCommentTextarea.fill('Please deliver during business hours. Thanks!');
    await checkoutPage.placeOrder();

    await checkoutPage.fillPaymentDetails({
      nameOnCard: testData.user!.name,
      cardNumber: '4111111111111111',
      cvc: '123',
      expiryMonth: '12',
      expiryYear: '2030',
    });
    await checkoutPage.confirmPayment();

    await expect(checkoutPage.orderPlacedHeading).toContainText('Order Placed!');
  });
});
