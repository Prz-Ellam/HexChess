import { Application } from './core/application';

import '@fontsource/silkscreen'
import 'boxicons/css/boxicons.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import '@styles/style.css';
import './assets/favicon.ico';
import './assets/images/cover-photo.png';

var app = null;

window.addEventListener('click', () => {
    //const audio = new Audio('https://manzdev.github.io/codevember2017/assets/eye-tiger.mp3');
    //audio.play();
});

window.addEventListener('load', () => {
    app = new Application();
});

