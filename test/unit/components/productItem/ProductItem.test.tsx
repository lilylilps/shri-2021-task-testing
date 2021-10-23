import React from "react";
import renderer from 'react-test-renderer';
import { Router } from "react-router";
import { Provider } from "react-redux";
import { createMemoryHistory } from "history";

import { it, describe, expect } from "@jest/globals";

import { initStore } from "../../../../src/client/store";
import { ProductItem } from "../../../../src/client/components/ProductItem";
import { ExampleApi, CartApi } from "../../../../src/client/api";


import { Store } from "redux";

describe('проверка компонента productItem', () => {

    let api: ExampleApi;
    let cart: CartApi;
    let store: Store;

    beforeAll(() => {
        api = new ExampleApi('');
        cart = new CartApi();
        store = initStore(api, cart);
    });

    const product = {
        id: 1,
        name: "shorts",
        price: 200,
    }

    it('snapshot', () => {
        const history = createMemoryHistory({
            initialEntries: ['/catalog'],
            initialIndex: 0
        });

        const tree = renderer.create(
            <Router history={history}>
                <Provider store={store}>
                    <ProductItem product={product} />
                </Provider>
            </Router>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});