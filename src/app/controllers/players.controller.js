import view from '@views/players.html';

export class PlayersController {

    constructor(app) {

        //import('@styles/bubbles.css');
        //import('@styles/styles.css');
        //import('@styles/players.css');
        import('@styles/style.css');
        
        const root = document.getElementById('root');
        root.innerHTML = view;

        document.getElementById('btn-singleplayer').addEventListener('click', e => {
            app.configuration.players = e.currentTarget.getAttribute('value');
        });

        document.getElementById('btn-multiplayer').addEventListener('click', e => {
            app.configuration.players = e.currentTarget.getAttribute('value');
        });

        localStorage.setItem('path', '/players');

        //setInterval(this.square, 150);
        
    }

    square() {
        let section = document.querySelector('.bubbles-circle');
        let square = document.createElement('span');
        let size = Math.random() * 50;
    
        square.style.width = 30 + size + 'px';
        square.style.height = 30 + size + 'px';
    
        square.style.top = Math.random() * innerHeight + 'px';
        square.style.left = Math.random() * innerWidth + 'px';
        section.appendChild(square);
    
        setTimeout(() => square.remove(), 5000);
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
