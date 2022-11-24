import { ConfigurationController } from '@controllers/configuration.controller'
import { HomeController } from '@controllers/home.controller'
import { ScoreController } from '@controllers/score.controller'
import { PauseController } from '@controllers/pause.controller'
import { DificultyController } from '@controllers/dificulty.controller'
import { ScenarioController } from '@controllers/scenario.controller'
import { PlayersController } from '@controllers/players.controller'
import { ModeController } from '@controllers/mode.controller'
import { GameController } from '@controllers/game.controller'
import { SignupController } from '../controllers/signup.controller'
import { LoginController } from '@controllers/login.controller'

const routes = {
    '/': HomeController,
    '/configuration': ConfigurationController,
    '/dificulty': DificultyController,
    '/mode': ModeController,
    '/pause': PauseController,
    '/scenarios': ScenarioController,
    '/score': ScoreController,
    '/players': PlayersController,
    '/game': GameController,
    '/signup': SignupController,
    '/login': LoginController
}

export { routes }