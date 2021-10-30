import React from 'react';
import { Helmet } from 'react-helmet';
import { cn } from '@bem-react/classname';

const bem = cn('Test1');

export const Test1: React.FC = () => {
    return (
        <div className={bem()}>
            <Helmet title="Test1" />
                <h1>Test1</h1>
                <p>
                    No description, website, or topics provided. Just to add tag
                </p>
        </div>
    );
}
