
import passport from "passport"

import { accountController } from '../controllers/account'
import { projectController } from '../controllers/project'
import { userController } from '../controllers/user'
import { userProjectController } from '../controllers/userProject'

export const router = (app) => {


    accountController(app, passport.authenticate('jwt', { session: false }));
    projectController(app, passport.authenticate('jwt', { session: false }));
    userController(app, passport.authenticate('jwt', { session: false }));
    userProjectController(app, passport.authenticate('jwt', { session: false }));

    
} 