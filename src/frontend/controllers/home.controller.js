import view from '@views/home.html';
import { Router } from '@routes/router';
export class HomeController {

    constructor() {
        const root = document.getElementById('root');
        root.innerHTML = view;
        this.bindEvents();
    }

    bindEvents() {
        if (localStorage.getItem('settings') === null) {
            const settings = {
                fov: 60,
                shadows: true,
                antialias: true,
                encoding: 'srgb',
                volume: 0.5
            }
            localStorage.setItem('settings', JSON.stringify(settings));
        }

        document.getElementsByClassName('loader-wrapper')[0].style.display = 'none';
        document.getElementsByClassName('home-container')[0].style.display = 'block';
        
        // TODO: Btn-exit
        const btnExit = document.getElementById('btn-user');
        btnExit.addEventListener('click', event => {

            event.preventDefault();

            fetch('/api/v1/auth', {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(res => {
                    window.location.href = '/';
                    //const router = new Router();
                    //router.redirect('/');
                });

        });
    }

}
