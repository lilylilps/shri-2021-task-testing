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
        await this.browser.assertView('plain', '.Application', {
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
        await this.browser.assertView('plain', '.Application', {
            allowViewportOverflow: true,
        });
    });

    it('страница доставки', async function () {
        const browser = this.browser;
        await this.browser.url('/hw/store/delivery');
        await browser.assertView('plain', '.Application', {
            compositeImage: true,
        });
    });

    it('адаптивность страницы доставки', async function () {
        await this.browser.setWindowSize(320, 896);
        const browser = this.browser;
        await this.browser.url('/hw/store/delivery');
        await this.browser.assertView('plain', '.Application', {
            allowViewportOverflow: true,
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
});