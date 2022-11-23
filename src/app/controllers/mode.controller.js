import view from '@views/mode.html';

export class ModeController {

    constructor(app) {

        //import('@styles/bubbles.css');
        //import('@styles/styles.css');
        //import('@styles/mode.css');
        import('@styles/style.css');

        const root = document.getElementById('root');
        root.innerHTML = view;

        document.getElementById('btn-checkmate').addEventListener('click', function(e) {
            app.configuration.mode = e.currentTarget.getAttribute('value');
        });

        document.getElementById('btn-coldwar').addEventListener('click', function(e) {
            app.configuration.mode = e.currentTarget.getAttribute('value');
        });
        
        localStorage.setItem('path', '/mode');
    }

}
