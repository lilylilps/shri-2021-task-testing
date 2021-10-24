import React from "react";
import renderer from 'react-test-renderer';
import { Router } from "react-router";
import { Provider } from "react-redux";
import { createMemoryHistory } from "history";

import { it, describe, expect } from "@jest/globals";
import { render } from "@testing-library/react";
import events from "@testing-library/user-event";


import { initStore } from "../../../../src/client/store";
import { ProductDetails } from "../../../../src/client/components/ProductDetails";
import { ExampleApi, CartApi } from "../../../../src/client/api";

import { Store } from "redux";
import { Product } from "../../../../src/common/types";

describe('проверка productDetails', () => {
    let api: ExampleApi;
    let cart: CartApi;
    let store: Store;
    let product: Product;

    beforeAll(() => {
        api = new ExampleApi('');
        cart = new CartApi();
        product = {
            id: 1,
            name: "shorts",
            price: 200,
            description: 'super shorts',
            material: 'denim',
            color: 'blue',
        };
    });

    beforeEach(() => {
        cart.setState(null);
        store = initStore(api, cart);
    });

    it('snapshot', () => {
        const tree = renderer.create(
            <Provider store={store}>
                <ProductDetails product={product} />
            </Provider>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('по клику на Add to cart появляется "Item in cart" и меняется количество товаров в корзине', () => {
        const history = createMemoryHistory({
            initialEntries: ['/catalog/1'],
            initialIndex: 0
        });

        const productPage = (
            <Router history={history}>
                <Provider store={store}>
                    <ProductDetails product={product} />
                </Provider>
            </Router>
        );

        const { getByRole, queryByText } = render(productPage);

        events.click(getByRole('button', { name: /add to cart/i }));

        let cartList = cart.getState();
        let count = cartList[1].count;
        expect(count).toEqual(1);

        const cartBage = queryByText('Item in cart');
        expect(cartBage).not.toBeNull();

        events.click(getByRole('button', { name: /add to cart/i }));
        cartList = cart.getState();
        count = cartList[1].count;
        
        expect(count).toEqual(2);
    });
});