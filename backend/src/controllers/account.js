import {login,register,refreshToken} from "../models/account"

export const accountController = (app, passport) =>{

  app.post("/login", login);
  app.post("/register", register);
  app.post("/refreshToken",refreshToken)
}