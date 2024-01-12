import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"
import { authenticateUser, getUserById, registerUser } from "@/repository/userRepository"
import "dotenv/config";

// Setting up local strategy
passport.use('signup', new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const username = req.body?.username
  const result = await registerUser(email.toLowerCase(), username, password);

  if (result.successful) {
    return done(null, result.data)
  } else {
    return done(null, false, { message: result.error })
  }
}))

passport.use('login', new LocalStrategy({
  usernameField: 'email',
}, async (email: string, password: string, done) => {
  const result = await authenticateUser(email.toLowerCase(), password);
  
  if (result.successful) {
    return done(null, result.data)
  } else {
    return done(null, false, { message: result.error })
  }
}))

// Setting up jwt strategy
passport.use(new JwtStrategy({
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, async (token, done) => {
  try {
    return done(null, token.user);
  } catch (error) {
    done(null, false, { message: error });
  }
}))

// User serialization and deserialization for sessions
passport.serializeUser((user, done) => {
  done(null, user);
})

passport.deserializeUser((id: number, done) => {
  getUserById(id).then((result) => {
    done(result.error, result.data)
  })
})

export default passport
