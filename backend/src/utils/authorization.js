
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"
import passport from "passport"
import database from "../database/models/database";
export const authorization = () => {

    passport.use(
        new JwtStrategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "tasmanianDevil"
        },
            (jwtpayload, done) => {

                database.user.findOne({ where: { id: jwtpayload.id } })
                    .then(user => {
                        {
                            console.group(user)
                            if (user) {

                                return done(null, user)
                            }
                            return done(null, false)
                        }
                    })
            }
        )
    )
}
