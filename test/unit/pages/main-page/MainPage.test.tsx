import React from "react";
import renderer from 'react-test-renderer';
import { Provider } from "react-redux";

import { it, expect } from "@jest/globals";

import { initStore } from "../../../../src/client/store";
import { Home } from "../../../../src/client/pages/Home";
import { ExampleApi, CartApi } from "../../../../src/client/api";
import { Store } from "redux";

let api: ExampleApi;
let cart: CartApi;
let store: Store;

beforeAll(() => {
    api = new ExampleApi('');
    cart = new CartApi();
    store = initStore(api, cart);
});

it('snapshot', () => {
    const tree = renderer.create(
        <Provider store={store}>
            <Home />
        </Provider>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});