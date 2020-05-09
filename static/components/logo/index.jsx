import React from 'react';

import 'static/components/logo/logo.less';

import Link from 'static/components/link';

const Logo = () => (
    <div>
        <Link href="/standalone.html">
            <span className="logo" />
        </Link>
    </div>
);

export default Logo;
