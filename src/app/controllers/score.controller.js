import view from '@views/score.html';

export class ScoreController {

    constructor() {

        import('@styles/score.css');
        import('@styles/stars.css');

        const root = document.getElementById('root');
        root.innerHTML = view;
        //this.initController();

        document.getElementsByClassName('loader-wrapper')[0].style.display = 'none';
        document.getElementsByClassName('container-box')[0].style.display = 'block';
        
    }

}