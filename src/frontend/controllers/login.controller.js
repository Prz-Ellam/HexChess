import view from '@views/login.html';
import { Router } from '@routes/router';

export class LoginController {

    constructor() {

        const root = document.getElementById('root');
        root.innerHTML = view;

        this.bindEvents();

    }

    bindEvents() {

        const btnGuess = document.getElementById('btn-guess');
        btnGuess.addEventListener('click', event => {
            document.cookie = 'Authorization=guest';
            const router = new Router();
            router.redirect('/');
        });

        const form = document.getElementById('login-form');
        form.addEventListener('submit', event => {
            event.preventDefault();

            console.log(event.target);
            const formData = new FormData(event.target);

            const formObject = {};
            formData.forEach((value, key) => formObject[key] = value);
            
            fetch('/api/v1/auth', {
                method: 'POST',
                body: JSON.stringify(formObject),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
                .then(res => res.json())
                .then(res => {
                    if (!res.status) {
                        alert(JSON.stringify(res));
                    }

                    const router = new Router();
                    router.redirect('/');
                    
                });

        });
    }

}
