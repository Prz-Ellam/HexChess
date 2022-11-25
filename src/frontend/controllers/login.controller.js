import view from '@views/login.html';

export class LoginController {

    constructor() {

        const root = document.getElementById('root');
        root.innerHTML = view;

        this.bindEvents();

    }

    bindEvents() {

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
                    alert(JSON.stringify(res));
                });

        });
    }


}
