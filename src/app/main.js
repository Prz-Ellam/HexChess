import { Application } from './core/application';

var app = null;

window.addEventListener('load', () => {
    app = new Application();
    app.run();
});