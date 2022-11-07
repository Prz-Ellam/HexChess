import { routes } from "./routes";

export class Router {

    constructor(application) {

        this.application = application;
        window.onpopstate = () => { this.resolve() };
        window.route = this.routing;
        //window.onbeforeunload = this.close;

    }

    routing(event) {
        //localStorage.removeItem('path');
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
        //if (path === '/') {
        //    path = localStorage.getItem('path') || window.location.pathname;
        //    window.history.pushState(null, null, path);
        //}
        
        const route = routes[path] || routes['404'];
        const controller = new route(this.application);

        const a = document.body.querySelectorAll('a');
        a.forEach(a => {
            a.addEventListener('click', e => this.routing(e));
        });

    }

    close(e) {
        e = e || window.event;

        if (e) {
            e.returnValue = '';
        }

        return '';
    }

}