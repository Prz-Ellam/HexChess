import view from '@views/players.html';

export class PlayersController {

    constructor(app) {

        import('@styles/bubbles.css');
        import('@styles/styles.css');
        import('@styles/players.css');

        const root = document.getElementById('root');
        root.innerHTML = view;

        document.getElementById('btn-singleplayer').addEventListener('click', e => {
            app.configuration.players = e.currentTarget.getAttribute('value');
        });

        document.getElementById('btn-multiplayer').addEventListener('click', e => {
            app.configuration.players = e.currentTarget.getAttribute('value');
        });

        localStorage.setItem('path', '/players');
        
    }

}


const playerComponent = {
    html: view,
    events: {
        'click': {
            '#btn-singleplayer': e => {
                app.configuration.players = e.currentTarget.getAttribute('value');
                // singleplayer
            },
            '#btn-multiplayer': e => {
                app.configuration.players = e.currentTarget.getAttribute('value');
                // multiplayer
            }
        }
    },
    styles: [
        '../styles/bubbles.css',
        '../styles/styles.css',
        '../styles/players.css'
    ]
}