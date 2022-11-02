import view from '@views/pause.html';

export class PauseController {

    constructor() {

        import('@styles/styles.css');
        import('@styles/pause.css');

        const root = document.getElementById('root');
        root.innerHTML = view;
        
    }

}