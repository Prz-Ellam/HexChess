import { ConfigurationController } from '../controllers/configuration.controller'
import { HomeController } from '../controllers/home.controller'
import { ScoreController } from '../controllers/score.controller'

const routes = {
    '404': '-1',
    '/': HomeController,
    '/configuration': ConfigurationController,
    '/dificulty': '5',
    '/pause': '4',
    '/scenarios': '6',
    '/score': ScoreController,
    '/game': '2'
}

export { routes }