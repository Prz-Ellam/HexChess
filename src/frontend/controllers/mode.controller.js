import view from '@views/mode.html';

export class ModeController {

    constructor(app) {
        const root = document.getElementById('root');
        root.innerHTML = view;
        this.bindEvents(app);
    }

    bindEvents(app) {
        document.getElementById('btn-checkmate').addEventListener('click', event => {
            app.configuration.mode = event.currentTarget.getAttribute('value');
        });

        document.getElementById('btn-coldwar').addEventListener('click', event => {
            app.configuration.mode = event.currentTarget.getAttribute('value');
        });
    }

}
