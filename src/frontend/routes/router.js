import { routes } from '@routes/routes';
import getCookie from '../helpers/cookies';

export class Router {

    constructor(application) {

        this.application = application;
        window.onpopstate = () => { this.resolve() };
        window.route = this.routing;
        //window.onbeforeunload = this.close;

    }

    routing(event) {
        event = event || window.event;
        event.preventDefault();
        window.history.pushState({}, '', event.currentTarget.href);
        this.resolve();
    }

    redirect(uri) {
        window.history.pushState({}, '', uri);
        this.resolve();
    }

    resolve() {

        const path = window.location.pathname;

        //const auth = getCookie('Authorization');

        const auth = document.cookie.split(';').find(row => row.startsWith('Authorization'))?.split('=')[1];
        if (!auth && (path !== '/login' && path !== '/signup')) {
            this.redirect('/login');
            return;
        }

        const route = routes[path];
        new route(this.application);

        const a = document.body.querySelectorAll('a');
        a.forEach(a => {
            a.addEventListener('click', e => this.routing(e));
        });

    }

    close(event) {
        event = event || window.event;

        if (event) {
            event.returnValue = '';
        }

        return '';
    }

}