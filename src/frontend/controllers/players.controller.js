import view from '@views/players.html';

export class PlayersController {

    constructor(app) {
        const root = document.getElementById('root');
        root.innerHTML = view;
        //window.bubbles = setInterval(this.square, 150);
        this.bindEvents(app);
    }

    bindEvents(app) {
        document.getElementById('btn-singleplayer').addEventListener('click', event => {
            app.configuration.players = event.currentTarget.getAttribute('value');
        });

        document.getElementById('btn-multiplayer').addEventListener('click', event => {
            app.configuration.players = event.currentTarget.getAttribute('value');
        });
    }

    square() {
        const section = document.querySelector('.bubbles-circle');
        const square = document.createElement('span');
        const size = Math.random() * 50;
    
        square.style.width = 30 + size + 'px';
        square.style.height = 30 + size + 'px';
    
        square.style.top = Math.random() * innerHeight + 'px';
        square.style.left = Math.random() * innerWidth + 'px';
        section.appendChild(square);
    
        setTimeout(() => square.remove(), 5000);
    }

}
