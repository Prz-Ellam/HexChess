import view from '@views/login.html';
import { Router } from '@routes/router';
import Swal from 'sweetalert2';

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
            window.location.href = '/';
            //const router = new Router();
            //router.redirect('/');
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
                        Swal.fire({
                            icon: 'error',
                            title: '¡Error!',
                            background: '#1B1B36',
                            buttonsStyling: false,
                            text: res.message,
                            customClass: {
                                title: 'title-style',
                                confirmButton: 'btn button button-anim btn-next',
                            },
                        });

                    }
                    else {

                    //const router = new Router();
                    //router.redirect('/');
                    window.location.href = '/';
                    }
                });

        });
    }

}
