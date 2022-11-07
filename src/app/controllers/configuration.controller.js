import view from '@views/configuration.html';

export class ConfigurationController {

    constructor() {

        import('@styles/bubbles.css');
        import('@styles/styles.css');
        import('@styles/configuration.css');

        const root = document.getElementById('root');
        root.innerHTML = view;
        this.initController();
    }

    initController() {

        document.getElementsByClassName('loader-wrapper')[0].style.display = 'none';
        document.getElementsByClassName('content')[0].style.display = 'block';
        
        
        document.getElementById('btn-graficos').addEventListener('click', function(e) {
            document.getElementsByClassName('audio')[0].style.display = 'none';
            document.getElementsByClassName('graficos')[0].style.display = 'block';
        });
        
        document.getElementById('btn-audio').addEventListener('click', function(e) {
            document.getElementsByClassName('audio')[0].style.display = 'block';
            document.getElementsByClassName('graficos')[0].style.display = 'none';
        });

    }

}
