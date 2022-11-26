import view from '@views/signup.html';
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
                if (res.status) {
                    const router = new Router();
                    router.redirect('/');
                }
            });

        });

    }


}
