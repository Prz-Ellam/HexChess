import { Application } from '@core/application';

import '@fontsource/silkscreen'
import 'boxicons/css/boxicons.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import '@styles/style.css';
import '@styles/stars.css';
import '@assets/favicon.ico';
import '@assets/images/cover-photo.png';

window.addEventListener('load', () => {
    new Application();
});

