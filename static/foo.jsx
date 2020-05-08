import React from 'react';
import { render } from 'react-dom';

import FooPage from 'static/pages/foo/index';

const root = document.createElement('div');
document.body.appendChild(root);

render(<FooPage />, root);
