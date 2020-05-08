import React from 'react';
import { hot } from 'react-hot-loader/root';

import 'static/styles/foo.less';

const FooPage = () => (
    <>
        <h1>Foo page</h1>
        <a className="link" href="/">
            Back to index
        </a>
    </>
);

export default hot(FooPage);
