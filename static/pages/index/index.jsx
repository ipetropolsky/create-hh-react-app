import React, { useState } from 'react';
import { hot } from 'react-hot-loader/root';

import 'static/pages/index/index.less';
import 'static/components/link/link.less';

import Logo from 'static/components/logo';

const IndexPage = () => {
    const [value, setValue] = useState('');

    return (
        <>
            <h1>Index page</h1>
            <Logo />
            <input type="text" onChange={({ target: { value } }) => setValue(value)} value={value} />
            Input: {value}
            <p>
                <a className="link" href="/foo.html">
                    Go to Foo page
                </a>
            </p>
        </>
    );
};

export default hot(IndexPage);
