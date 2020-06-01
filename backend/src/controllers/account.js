import { login, register, refreshToken, changePassword } from "../models/account"

export const accountController = (app, passport) => {

  app.post("/account/login", login);
  app.post("/account/register",passport, register);
  app.post("/account/refreshToken",passport, refreshToken)
  app.put("/account/changePassword/:id",passport, changePassword)
}