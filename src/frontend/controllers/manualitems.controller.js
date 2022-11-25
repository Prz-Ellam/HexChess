import view from '../views/manualItems.html';

export class ManualItemsController {

    constructor() {

      // import('@styles/bubbles.css');
        import('@styles/style.css');
       // import('@styles/configuration.css');

        const root = document.getElementById('root');
        root.innerHTML = view;
    }


}