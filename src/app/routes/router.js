import { routes } from "./routes";

export class Router {

    constructor(application) {

        this.application = application;
        window.onpopstate = this.resolve;
        window.route = this.routing;

    }

    routing(event) {
        event = event || window.event;
        event.preventDefault();
        window.history.pushState(null, null, event.currentTarget.href);
        this.resolve();
    }

    resolve() {

        const path = window.location.pathname;
        const route = routes[path] || routes['404'];
        const controller = new route(this.application);

        const a = document.body.querySelectorAll('a');
        a.forEach(a => {
            a.addEventListener('click', e => this.routing(e));
        });


    }

}