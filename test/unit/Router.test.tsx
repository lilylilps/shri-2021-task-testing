import React from "react";
// import { BrowserRouter } from "react-router-dom";
import { Router } from "react-router";
import { Provider } from "react-redux";
import { createMemoryHistory } from "history";

import { it, describe, expect } from "@jest/globals";
import { render } from "@testing-library/react";
import events from "@testing-library/user-event";

import { initStore } from "../../src/client/store";
import { Application } from "../../src/client/Application";
import { ExampleApi, CartApi } from "../../src/client/api";

import axios from 'axios';
import { Store } from "redux";
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('проверка роутинга', () => {
    let api: ExampleApi;
    let cart: CartApi;
    let store: Store;

    beforeAll(() => {
        api = new ExampleApi('');
        cart = new CartApi();
        store = initStore(api, cart);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('работает переход на главную страницу', () => {
        const history = createMemoryHistory({
            initialEntries: ['/'],
            initialIndex: 0
        });

        const application = (
            <Router history={history}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </Router>
        );

        const { getByRole, getByText } = render(application);
        events.click(getByRole('link', { name: /example store/i }));
        const greeting = getByText(/welcome to example store!/i);

        expect(greeting.textContent).toEqual("Welcome to Example store!");
    });

    it('работает переход на страницу Catalog', async () => {
        mockedAxios.get.mockResolvedValue({
            data: [
                { id: 1, name: "shorts", price: 200 },
                { id: 2, name: "pants", price: 300 },
                { id: 3, name: "shoes", price: 500 },
            ]
        });

        const history = createMemoryHistory({
            initialEntries: ['/catalog'],
            initialIndex: 0
        });

        const application = (
            <Router history={history}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </Router>
        );

        const { getByRole } = render(application);
        events.click(getByRole('link', { name: /catalog/i }));
        const header = getByRole('heading', { name: /catalog/i });

        await (function (ms) {
            return new Promise((res) => setTimeout(() => res(1), ms));
        })(100);

        expect(header.textContent).toEqual("Catalog");
    });

    it('работает переход на страницу Delivery', () => {
        const history = createMemoryHistory({
            initialEntries: ['/delivery'],
            initialIndex: 0
        });

        const application = (
            <Router history={history}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </Router>
        );

        const { getByRole } = render(application);
        events.click(getByRole('link', { name: /delivery/i }));
        const header = getByRole('heading', { name: /delivery/i });

        expect(header.textContent).toEqual("Delivery");
    });

    it('работает переход на страницу Contacts', () => {
        const history = createMemoryHistory({
            initialEntries: ['/contacts'],
            initialIndex: 0
        });

        const application = (
            <Router history={history}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </Router>
        );

        const { getByRole } = render(application);
        events.click(getByRole('link', { name: /contacts/i }));
        const header = getByRole('heading', { name: /contacts/i });

        expect(header.textContent).toEqual("Contacts");
    });

    it('работает переход на страницу Cart', () => {
        const history = createMemoryHistory({
            initialEntries: ['/cart'],
            initialIndex: 0
        });

        const application = (
            <Router history={history}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </Router>
        );

        const { getByRole } = render(application);
        events.click(getByRole('link', { name: /cart/i }));
        const header = getByRole('heading', { name: /shopping cart/i });

        expect(header.textContent).toEqual("Shopping cart");
    });

    it('по клику на ссылку details работает переход на страницу товара', async () => {
        mockedAxios.get.mockResolvedValue({
            data: [
                { id: 1, name: "shorts", price: 200 },
            ]
        });

        const history = createMemoryHistory({
            initialEntries: ['/catalog'],
            initialIndex: 0
        });

        const application = (
            <Router history={history}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </Router>
        );

        const { getByRole } = render(application);

        await (function (ms) {
            return new Promise((res) => setTimeout(() => res(1), ms));
        })(100);
        
        const detailsLink = getByRole("link", { name: /details/i });
        events.click(detailsLink);

        expect(history.location.pathname).toEqual("/catalog/1");
        
    });

    it('при выборе элемента из меню гамбургера, меню должно закрываться', async () => {
        const history = createMemoryHistory({
            initialEntries: ['/'],
            initialIndex: 0
        });

        const application = (
            <Router history={history}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </Router>
        );

        const { getByRole } = render(application);

        await events.click(getByRole('link', {name: /contacts/i}));

        const closedMenu = !!document.querySelector('.navbar-collapse.collapse');
        expect(closedMenu).toBeTruthy();
    });
})