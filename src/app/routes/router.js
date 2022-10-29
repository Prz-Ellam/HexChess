import { routes } from "./routes";

export class Router {

    constructor() {

        window.onpopstate = this.resolve;
        window.route = this.routing;

    }

    routing(event) {
        event = event || window.event;
        event.preventDefault();
        window.history.pushState({}, "", event.target.href);
        this.resolve();
    } 

    resolve() {

        const path = window.location.pathname;
        const route = routes[path] || routes['404'];

        
        const controller = new route();

    }

}