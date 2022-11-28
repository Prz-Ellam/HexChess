import view from '@views/signup.html';
import Swal from 'sweetalert2';
import { Router } from '../routes/router';

export class SignupController {

    constructor() {
        
        const root = document.getElementById('root');
        root.innerHTML = view;

        const form = document.getElementById('signup-form');
        form.addEventListener('submit', event => {
            event.preventDefault();

            console.log(event.target);
            const formData = new FormData(event.target);

            const formObject = {};
            formData.forEach((value, key) => formObject[key] = value);
            console.log(formObject);

            fetch('/api/v1/users', {
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
                    const router = new Router();
                    router.redirect('/');
                }
            });

        });

    }


}
