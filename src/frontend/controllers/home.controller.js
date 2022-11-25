import view from '@views/home.html';
export class HomeController {

    constructor() {
        
        const root = document.getElementById('root');
        root.innerHTML = view;
        
        
        this.bindEvents();

    }

    bindEvents() {

        document.getElementsByClassName('loader-wrapper')[0].style.display = 'none';
        document.getElementsByClassName('home-content')[0].style.display = 'block';
        /*
        document.getElementById('fab').addEventListener('click', event => {
            shareScore(100);
        });
        */

        
          
          
          //shareScore(100);
        
    }

}

