import { Application } from './core/application';

import '@fontsource/silkscreen'
import 'boxicons/css/boxicons.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import '@styles/bubbles.css';
import '@styles/styles.css';
import '@styles/players.css';
import '@styles/dificulty.css';
import '@styles/home.css';
import '@styles/mode.css';

var app = null;

window.addEventListener('click', () => {
    //const audio = new Audio('https://manzdev.github.io/codevember2017/assets/eye-tiger.mp3');
    //audio.play();
})

window.addEventListener('load', () => {
    app = new Application();
});

