import React, { useState } from 'react';
import { hot } from 'react-hot-loader/root';

import 'static/globals/defaults.less';

import { useHMR } from 'config';
import Link from 'static/components/link';
import Logo from 'static/components/logo';

const IndexPage = () => {
    const [value, setValue] = useState('');

    return (
        <>
            <h1>Create HH React App</h1>
            <Logo />
            <input type="text" onChange={({ target: { value } }) => setValue(value)} value={value} /> Input value:{' '}
            {value}
            <p>
                <Link href="/standalone.html">Go to standalone page</Link>
            </p>
        </>
    );
};

export default useHMR ? hot(IndexPage) : IndexPage;
