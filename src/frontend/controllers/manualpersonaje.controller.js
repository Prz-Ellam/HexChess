import view from '../views/manualPersonajes.html';

export class ManualPersonajeController {

    constructor() {

      // import('@styles/bubbles.css');
        import('@styles/style.css');
       // import('@styles/configuration.css');

        const root = document.getElementById('root');
        root.innerHTML = view;
    }


}
