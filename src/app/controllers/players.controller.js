import view from '../views/players.html';

export class PlayersController {

    constructor(app) {

        import('../styles/bubbles.css');
        import('../styles/styles.css');
        import('../styles/players.css');

        const root = document.getElementById('root');
        root.innerHTML = view;

        document.getElementById('btn-singleplayer').addEventListener('click', function(e) {
            app.configuration.players = e.currentTarget.getAttribute('value');
        });

        document.getElementById('btn-multiplayer').addEventListener('click', function(e) {
            app.configuration.players = e.currentTarget.getAttribute('value');
        });

        localStorage.setItem('path', '/players');
        
    }

}