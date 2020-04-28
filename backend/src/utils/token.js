import { sign } from "jsonwebtoken"
export const SECRET = "123456"


export const createToken = user => sign({id: user.oauthID},SECRET);
  