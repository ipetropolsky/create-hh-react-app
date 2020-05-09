import React from 'react';
import { hot } from 'react-hot-loader/root';

import 'static/globals/defaults.less';

import Link from 'static/components/link';

import { useHMR } from 'config';

const StandalonePage = () => (
    <>
        <h1>Standalone page</h1>
        <Link href="/">Back to index!</Link>
    </>
);

export default useHMR ? hot(StandalonePage) : StandalonePage;
