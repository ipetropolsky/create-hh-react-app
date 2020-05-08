import React from 'react';
import { render } from 'react-dom';

import IndexPage from 'static/pages/index';

const root = document.createElement('div');
document.body.appendChild(root);

render(<IndexPage />, root);
