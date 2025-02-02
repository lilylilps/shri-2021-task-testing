import React from "react";
import renderer from 'react-test-renderer';

import { it, describe, expect } from "@jest/globals";

import { Form } from "../../../../src/client/components/Form";
import { render, fireEvent } from "@testing-library/react";
import events from "@testing-library/user-event";

describe('проверка компонента form', () => {
    const onSubmit = jest.fn();

    it('snapshot', () => {
        const tree = renderer.create(<Form onSubmit={onSubmit} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
    
    it('данные не введены', () => {
        const form = <Form onSubmit={onSubmit} />

        const { getByRole } = render(form);

        const submitButton = getByRole('button', { name: /checkout/i });
        events.click(submitButton);

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('введено невалидное имя', () => {
        const form = <Form onSubmit={onSubmit} />

        const { getByRole, getByLabelText } = render(form);

        const nameInput = getByLabelText('Name');
        fireEvent.change(nameInput, {target: {value: ' '}});

        const submitButton = getByRole('button', { name: /checkout/i });
        events.click(submitButton);

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('введен невалидный номер телефона', () => {
        const form = <Form onSubmit={onSubmit} />

        const { getByRole, getByLabelText } = render(form);

        const phoneInput = getByLabelText('Phone');
        fireEvent.change(phoneInput, {target: {value: '8333'}});

        const submitButton = getByRole('button', { name: /checkout/i });
        events.click(submitButton);

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('введен невалидный адрес', () => {
        const form = <Form onSubmit={onSubmit} />

        const { getByRole, getByLabelText } = render(form);

        const addressInput = getByLabelText('Address');
        fireEvent.change(addressInput, {target: {value: ' '}});

        const submitButton = getByRole('button', { name: /checkout/i });
        events.click(submitButton);

        expect(onSubmit).not.toHaveBeenCalled();
    })
});