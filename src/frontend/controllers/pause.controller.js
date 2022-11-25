import view from '@views/pause.html';

export class PauseController {

    constructor() {

        const root = document.getElementById('root');
        root.innerHTML = view;
        
    }

}