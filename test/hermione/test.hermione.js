const { assert } = require('chai');

describe('проверка статических страниц', async function () {

    it('главная страница', async function () {
        const browser = this.browser;
        await this.browser.url('/hw/store');
        await browser.assertView('plain', '.Application', {
            compositeImage: true,
        });
    });

    it('адаптивность главной страницы', async function () {
        await this.browser.setWindowSize(320, 896);
        const browser = this.browser;
        await this.browser.url('/hw/store');
        await browser.assertView('plain', '.Application', {
            allowViewportOverflow: true,
        });
    });

    it('страница контактов', async function () {
        const browser = this.browser;
        await this.browser.url('/hw/store/contacts');
        await browser.assertView('plain', '.Application', {
            compositeImage: true,
        });
    });

    it('адаптивность страницы контактов', async function () {
        await this.browser.setWindowSize(320, 896);
        const browser = this.browser;
        await this.browser.url('/hw/store/contacts');
        await browser.assertView('plain', '.Application', {
            allowViewportOverflow: true,
        });
    });

    it('страница доставки', async function () {
        await this.browser.setWindowSize(1024, 896);
        const browser = this.browser;
        await this.browser.url('/hw/store/delivery');
        await browser.assertView('plain', '.Application', {
            compositeImage: true,
        });
    });

    it('навигационное меню должно скрываться за "гамбургер"', async function () {
        await this.browser.setWindowSize(320, 896);
        const navigationToggler = await this.browser.$('.navbar-toggler');
        const navigationMenu = await this.browser.$('.navbar-collapse');
        
        assert.isFalse(await navigationMenu.isDisplayed());
        navigationToggler.click();
        assert.isTrue(await navigationMenu.isDisplayed());
    });

    it('перезагрузка корзины', async function () {
        await this.browser.setWindowSize(1024, 896);
        const browser = this.browser;
        await this.browser.url('/hw/store/catalog');

        const catalogProducts = await this.browser.$('.ProductItem')
        await catalogProducts.waitForExist();

        const productDetailsLink = await this.browser.$('.card-link');
        await this.browser.url(await productDetailsLink.getAttribute('href'));

        const addToCartButton = await this.browser.$('.ProductDetails-AddToCart');
        await addToCartButton.click();
        await this.browser.url('/hw/store/cart');

        await browser.assertView('plain', '.Application', {
            allowViewportOverflow: true,
        });

        await browser.refresh();
        await browser.assertView('refreshed', '.Application', {
            allowViewportOverflow: true,
        });
    });
});