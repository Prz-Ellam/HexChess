import view from '@views/game.html';

export class GameController {

    constructor(app) {

        const root = document.getElementById('root');
        root.innerHTML = view;
        
        app.create();

    }

    create() {

        
    }

}
