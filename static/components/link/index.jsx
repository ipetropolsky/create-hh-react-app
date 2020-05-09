import React from 'react';
import PropTypes from 'prop-types';

import 'static/components/link/link.less';

import { publicPath } from 'config';

const Link = ({ children, href }) => {
    const url = href[0] === '/' ? `${publicPath}${href}` : href;
    return (
        <a className="link" href={url}>
            {children}
        </a>
    );
};

Link.propTypes = {
    children: PropTypes.node,
    href: PropTypes.string,
};

export default Link;
