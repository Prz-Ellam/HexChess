import view from '@views/dificulty.html';

export class DificultyController {

    constructor(app) {
        
        const root = document.getElementById('root');
        root.innerHTML = view;

        document.getElementById('btn-easy').addEventListener('click', function(e) {
            app.configuration.dificulty = e.currentTarget.getAttribute('value');
        });

        document.getElementById('btn-hard').addEventListener('click', function(e) {
            app.configuration.dificulty = e.currentTarget.getAttribute('value');
        });
        
        localStorage.setItem('path', '/dificulty');
    }

}
