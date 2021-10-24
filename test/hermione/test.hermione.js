const { assert } = require('chai');

describe('проверка статических страниц', async function () {
  it('главная страница', async function () {
    const browser = this.browser;
    await this.browser.url("/hw/store");
    await browser.assertView("plain", ".Application", {
      compositeImage: true,
    });

  });
  it('страница контактов', async function () {
    const browser = this.browser;
    await this.browser.url("/hw/store/contacts");
    await browser.assertView("plain", ".Application", {
      compositeImage: true,
    });
  });

  it('страница доставки', async function () {
    const browser = this.browser;
    await this.browser.url("/hw/store/delivery");
    await browser.assertView("plain", ".Application", {
      compositeImage: true,
    });
  });
});