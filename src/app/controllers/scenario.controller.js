import view from '../views/scenario.html';

export class ScenarioController {

    constructor(app) {

        import('../styles/bubbles.css');
        import('../styles/styles.css');
        import('../styles/scenario.css');

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
        
    }

}