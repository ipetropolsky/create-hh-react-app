import React from 'react';

import 'static/components/logo/logo.less';
import 'static/components/link/link.less';

const Logo = () => (
    <a href="/foo.html" className="link">
        <span className="logo"></span>
    </a>
);

export default Logo;
