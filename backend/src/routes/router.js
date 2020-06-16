
import passport from "passport"

import { accountController } from '../controllers/account'
import { projectController } from '../controllers/project'
import { userController } from '../controllers/user'
import { userProjectController } from '../controllers/userProject'
import { messageController } from '../controllers/message'


export const router = (app,io) => {


    accountController(app, passport.authenticate('jwt', { session: false }));
    projectController(app, passport.authenticate('jwt', { session: false }));
    userController(app, passport.authenticate('jwt', { session: false }));
    userProjectController(app, passport.authenticate('jwt', { session: false }));
    messageController(app, passport.authenticate('jwt', { session: false }),io);

    
} 