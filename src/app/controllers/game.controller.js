import view from '@views/game.html';

export class GameController {

    constructor(app) {

        //import('@styles/home.css');
        //import('@styles/styles.css');
        import('@styles/style.css');

        const root = document.getElementById('root');
        root.innerHTML = view;
        
        app.create();

    }

}
