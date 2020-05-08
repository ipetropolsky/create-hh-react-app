import React from 'react';
import { hot } from 'react-hot-loader/root';

import 'static/globals/defaults.less';
import 'static/components/link/link.less';

const StandalonePage = () => (
    <>
        <h1>Standalone page</h1>
        <a className="link" href="/">
            Back to index
        </a>
    </>
);

export default hot(StandalonePage);
