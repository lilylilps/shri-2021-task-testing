import React from "react";
import { Router } from "react-router";
import { Provider } from "react-redux";
import { createMemoryHistory } from "history";

import { it, describe, expect } from "@jest/globals";
import { screen, render,  within, fireEvent } from "@testing-library/react";
import events from "@testing-library/user-event";

import { addToCart, initStore } from "../../../../src/client/store";
import { Application } from "../../../../src/client/Application";
import { Cart } from "../../../../src/client/pages/Cart";
import { ExampleApi, CartApi } from "../../../../src/client/api";
import { Product } from '../../../../src/common/types';

import axios from 'axios';
import { Store } from "redux";
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('проверка cart', () => {
    let api: ExampleApi;
    let cart: CartApi;
    let store: Store;

    beforeAll(() => {
        api = new ExampleApi('');
        cart = new CartApi();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        cart.setState(null);
        store = initStore(api, cart);
    });

    it('если корзина пустая, в ней появляется ссылка на страницу с каталогом', () => {
        mockedAxios.get.mockResolvedValue({data: []});

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

        const { getByText, getByRole } = render(application);

        const view = getByText(/cart is empty\. please select products in the \./i);

        const link = within(view).getByRole('link', { name: /catalog/i });
        events.click(link);

        const header = getByRole('heading', { name: /catalog/i });
        expect(header.textContent).toEqual("Catalog");
    });

    it('в шапке рядом со ссылкой на корзину отображается количество не повторяющихся товаров в ней', async () => {
        const firstProduct = {
            id: 1,
            name: "shorts",
            price: 200,
        } as Product;

        const secondProduct = {
            id: 2,
            name: "pants",
            price: 600,
        } as Product;

        mockedAxios.get.mockResolvedValue({
            data: [
                firstProduct,
                secondProduct,
            ]
        });

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
        store.dispatch(addToCart(firstProduct));
        await (function (ms) {
            return new Promise((res) => setTimeout(() => res(1), ms));
        })(100);

        let cartLink = getByRole('link', { name: /cart \(1\)/i });
        expect(cartLink.textContent).toEqual('Cart (1)');

        store.dispatch(addToCart(secondProduct));
        await (function (ms) {
            return new Promise((res) => setTimeout(() => res(1), ms));
        })(100);

        cartLink = getByRole('link', { name: /cart \(2\)/i });
        expect(cartLink.textContent).toEqual('Cart (2)');

        store.dispatch(addToCart(secondProduct));
        await (function (ms) {
            return new Promise((res) => setTimeout(() => res(1), ms));
        })(100);

        cartLink = getByRole('link', { name: /cart \(2\)/i });
        expect(cartLink.textContent).toEqual('Cart (2)');
    });

    it('в корзине отображается таблица с добавленными в нее товарами', async () => {
        const firstProduct = {
            id: 1,
            name: "shorts",
            price: 200,
        } as Product;

        const secondProduct = {
            id: 2,
            name: "pants",
            price: 600,
        } as Product;

        const thirdProduct = {
            id: 3,
            name: "boots",
            price: 800,
        } as Product;

        mockedAxios.get.mockResolvedValue({
            data: [
                firstProduct,
                secondProduct,
                thirdProduct
            ]
        });

        const history = createMemoryHistory({
            initialEntries: ['/cart'],
            initialIndex: 0
        });

        const cartPage = (
            <Router history={history}>
                <Provider store={store}>
                    <Cart />
                </Provider>
            </Router>
        );

        const { getByRole } = render(cartPage);

        store.dispatch(addToCart(firstProduct));
        store.dispatch(addToCart(secondProduct));

        await (function (ms) {
            return new Promise((res) => setTimeout(() => res(1), ms));
        })(100);

        let table = getByRole('table');
        let rows = table.children[1];
        expect(rows.children.length).toEqual(2);

        store.dispatch(addToCart(thirdProduct));

        await (function (ms) {
            return new Promise((res) => setTimeout(() => res(1), ms));
        })(100);

        table = getByRole('table');
        rows = table.children[1];
        expect(rows.children.length).toEqual(3);
    });

    it('для каждого товара отображаются название, цена, количество, стоимость, и общая сумма заказа', async () => {
        const firstProduct = {
            id: 1,
            name: "shorts",
            price: 200,
        } as Product;

        const secondProduct = {
            id: 2,
            name: "pants",
            price: 600,
        } as Product;

        mockedAxios.get.mockResolvedValue({
            data: [
                firstProduct,
                secondProduct,
            ]
        });

        const history = createMemoryHistory({
            initialEntries: ['/cart'],
            initialIndex: 0
        });

        const cartPage = (
            <Router history={history}>
                <Provider store={store}>
                    <Cart />
                </Provider>
            </Router>
        );

        const { getByRole } = render(cartPage);

        store.dispatch(addToCart(firstProduct));

        await (function (ms) {
            return new Promise((res) => setTimeout(() => res(1), ms));
        })(100);

        let table = getByRole('table');
        let rows = table.children[1];
        let firstItem = rows.children[0];
        let firstItemName = firstItem.children[1];
        let firstItemPrice = firstItem.children[2];
        let firstItemCount = firstItem.children[3];
        let firstItemTotalPrice = firstItem.children[4];

        let footer = table.children[2];
        let orderPrice = footer.children[0];
        let totalOrderPrice = orderPrice.children[1];

        expect(firstItemName.textContent).toEqual('shorts');
        expect(firstItemPrice.textContent).toEqual('$200');
        expect(firstItemCount.textContent).toEqual('1');
        expect(firstItemTotalPrice.textContent).toEqual('$200');

        expect(totalOrderPrice.textContent).toEqual('$200');


        store.dispatch(addToCart(firstProduct));

        await (function (ms) {
            return new Promise((res) => setTimeout(() => res(1), ms));
        })(100);

        table = getByRole('table');
        rows = table.children[1];
        firstItem = rows.children[0];
        firstItemCount = firstItem.children[3];
        firstItemTotalPrice = firstItem.children[4];

        footer = table.children[2];
        orderPrice = footer.children[0];
        totalOrderPrice = orderPrice.children[1];

        expect(firstItemCount.textContent).toEqual('2');
        expect(firstItemTotalPrice.textContent).toEqual('$400');

        expect(totalOrderPrice.textContent).toEqual('$400');

        store.dispatch(addToCart(secondProduct));

        await (function (ms) {
            return new Promise((res) => setTimeout(() => res(1), ms));
        })(100);

        table = getByRole('table');
        rows = table.children[1];
        let secondItem = rows.children[1];
        let secondItemName = secondItem.children[1];
        let secondItemPrice = secondItem.children[2];
        let secondItemCount = secondItem.children[3];
        let secondItemTotalPrice = secondItem.children[4];

        footer = table.children[2];
        orderPrice = footer.children[0];
        totalOrderPrice = orderPrice.children[1];

        expect(secondItemName.textContent).toEqual('pants');
        expect(secondItemPrice.textContent).toEqual('$600');
        expect(secondItemCount.textContent).toEqual('1');
        expect(secondItemTotalPrice.textContent).toEqual('$600');

        expect(totalOrderPrice.textContent).toEqual('$1000');
    });

    it('по нажатию на кнопку "очистить корзину" все товары удаляются', async () => {
        const firstProduct = {
            id: 1,
            name: "shorts",
            price: 200,
        } as Product;

        const secondProduct = {
            id: 2,
            name: "pants",
            price: 600,
        } as Product;

        mockedAxios.get.mockResolvedValue({
            data: [
                firstProduct,
                secondProduct,
            ]
        });

        const history = createMemoryHistory({
            initialEntries: ['/cart'],
            initialIndex: 0
        });

        const cartPage = (
            <Router history={history}>
                <Provider store={store}>
                    <Cart />
                </Provider>
            </Router>
        );

        const { queryByRole, getByRole } = render(cartPage);

        store.dispatch(addToCart(firstProduct));
        store.dispatch(addToCart(secondProduct));

        await (function (ms) {
            return new Promise((res) => setTimeout(() => res(1), ms));
        })(100);

        let table = getByRole('table');
        let rows = table.children[1];
        expect(rows.children.length).toEqual(2);

        events.click(getByRole('button', { name: /clear shopping cart/i }));

        const catalogLink = queryByRole('link', { name: /catalog/i });
        
        expect(queryByRole('table')).toBeNull();
        expect(catalogLink).not.toBeNull();
    });

    it('успешное оформление заказа',async () => {
        const firstProduct = {
            id: 1,
            name: "shorts",
            price: 200,
        } as Product;
    
        const secondProduct = {
            id: 2,
            name: "pants",
            price: 600,
        } as Product;
    
        mockedAxios.get.mockResolvedValue({
            data: [
                firstProduct,
                secondProduct,
            ]
        });

        mockedAxios.post.mockResolvedValue({
            data:
                { id: 55 }
            
        });
    
        const history = createMemoryHistory({
            initialEntries: ['/cart'],
            initialIndex: 0
        });
    
        const cartPage = (
            <Router history={history}>
                <Provider store={store}>
                    <Cart />
                </Provider>
            </Router>
        );
    
        const { getByLabelText, getByRole, getByText } = render(cartPage);
    
        store.dispatch(addToCart(firstProduct));
        store.dispatch(addToCart(secondProduct));
            
        await (function (ms) {
            return new Promise((res) => setTimeout(() => res(1), ms));
        })(100);

        const nameInput = getByLabelText('Name');
        fireEvent.change(nameInput, {target: {value: 'lil'}});

        const phoneInput = getByLabelText('Phone');
        fireEvent.change(phoneInput, {target: {value: '83344433333'}});

        const addressInput = getByLabelText('Address');
        fireEvent.change(addressInput, {target: {value: 'mosc'}});

        const submitButton = getByRole('button', { name: /checkout/i });
        events.click(submitButton);

        await (function (ms) {
            return new Promise((res) => setTimeout(() => res(1), ms));
        })(100);

        expect(getByText('55')).not.toBeNull();

    });
});