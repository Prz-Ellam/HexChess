export class GameController {

    constructor(app) {

        const root = document.getElementById('root');
        root.innerHTML = '';
        
        app.create();
        app.run();

    }

}