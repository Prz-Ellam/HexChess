import view from '../views/home.html';

export class HomeController {

    constructor() {
        
        import('../styles/home.css');
        import('../styles/styles.css');
        import('boxicons/css/boxicons.min.css');

        const root = document.getElementById('root');
        root.innerHTML = view;
        this.initController();

    }

    initController() {

        document.getElementsByClassName('loader-wrapper')[0].style.display = 'none';
        document.getElementsByClassName('home-content')[0].style.display = 'block';
        
    }

}
