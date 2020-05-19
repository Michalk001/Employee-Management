import { login, register, refreshToken, changePassword } from "../models/account"

export const accountController = (app, passport) => {

  app.post("/account/login", login);
  app.post("/account/register", register);
  app.post("/account/refreshToken", refreshToken)
  app.put("/account/changePassword/:id", changePassword)
}