import React from 'react';
import { render } from 'react-dom';

import StandalonePage from 'static/pages/standalone/index';

const root = document.createElement('div');
document.body.appendChild(root);

render(<StandalonePage />, root);
