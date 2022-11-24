import view from '@views/scenario.html';

export class ScenarioController {

    constructor(app) {

        const root = document.getElementById('root');
        root.innerHTML = view;

        document.getElementById('btn-desert').addEventListener('click', function(e) {
            app.configuration.scenario = e.currentTarget.getAttribute('value');
        });

        document.getElementById('btn-forest').addEventListener('click', function(e) {
            app.configuration.scenario = e.currentTarget.getAttribute('value');
        });

        document.getElementById('btn-snow').addEventListener('click', function(e) {
            app.configuration.scenario = e.currentTarget.getAttribute('value');
        })
        
        localStorage.setItem('path', '/scenarios');
    }

}
