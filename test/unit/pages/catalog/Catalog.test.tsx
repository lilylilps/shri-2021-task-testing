import React from "react";
import { Router } from "react-router";
import { Provider } from "react-redux";
import { createMemoryHistory } from "history";

import { it, describe, expect } from "@jest/globals";
import { render } from "@testing-library/react";

import {  initStore } from "../../../../src/client/store";
import { Catalog } from "../../../../src/client/pages/Catalog";
import { ExampleApi, CartApi } from "../../../../src/client/api";
import { CartItem } from '../../../../src/common/types';

import axios from 'axios';
import { Store } from "redux";
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('проверка catalog', () => {
    let api: ExampleApi;
    let cart: CartApi;
    let store: Store;

    beforeAll(() => {
        api = new ExampleApi('');
        cart = new CartApi();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        store = initStore(api, cart);
    });

    it('если в каталоге нет товаров, отображается Loading', () => {
        mockedAxios.get.mockResolvedValue({data: []});

        const history = createMemoryHistory({
            initialEntries: ['/catalog'],
            initialIndex: 0
        });

        const catalogPage = (
            <Router history={history}>
                <Provider store={store}>
                    <Catalog />
                </Provider>
            </Router>
        );

        const { getByText } = render(catalogPage);
        expect(getByText(/loading/i).textContent).toEqual('LOADING');
    })

    it('в каталоге отображаются товары, список которых приходит с сервера', async () => {
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

        const catalogPage = (
            <Router history={history}>
                <Provider store={store}>
                    <Catalog />
                </Provider>
            </Router>
        );

        render(catalogPage);
        const catalog = document.querySelector('.Catalog');
        const container = catalog.querySelectorAll('.row');
        const products = container[1];

        await (function (ms) {
            return new Promise((res) => setTimeout(() => res(1), ms));
        })(100);

        expect(products.children.length).toEqual(3);
    });

    it('если товар уже добавлен в корзину, в каталоге отображается сообщение об этом', async () => {
        mockedAxios.get.mockResolvedValue({
            data: [
                { id: 1, name: "shorts", price: 200 },
            ]
        });

        const product = {
            count: 1,
            name: "shorts",
            price: 200,
        } as CartItem;

        cart.setState({ 1: product });
        
        store = initStore(api, cart);

        const history = createMemoryHistory({
            initialEntries: ['/catalog'],
            initialIndex: 0
        });

        const catalogPage = (
            <Router history={history}>
                <Provider store={store}>
                    <Catalog />
                </Provider>
            </Router>
        );

        const { queryByText } = render(catalogPage);
        
        await (function (ms) {
            return new Promise((res) => setTimeout(() => res(1), ms));
        })(100);

        const cartBage = queryByText('Item in cart');
        
        expect(cartBage).not.toBeNull();
    });

    it('содержимое корзины сохраняется между перезагрузками страницы', async () => {
        mockedAxios.get.mockResolvedValue({
            data: [
                { id: 1, name: "shorts", price: 200 },
            ]
        });

        const product = {
            count: 1,
            name: "shorts",
            price: 200,
        } as CartItem;

        cart.setState({ 1: product });
        
        store = initStore(api, cart);

        const history = createMemoryHistory({
            initialEntries: ['/catalog'],
            initialIndex: 0
        });

        const catalogPage = (
            <Router history={history}>
                <Provider store={store}>
                    <Catalog />
                </Provider>
            </Router>
        );

        const { rerender } = render(catalogPage);

        await (function (ms) {
            return new Promise((res) => setTimeout(() => res(1), ms));
        })(100);
        
        const firstRenderState = cart.getState();

        rerender(catalogPage);
        const secondRenderState = cart.getState();

        expect(secondRenderState).toEqual(firstRenderState);
    });
});