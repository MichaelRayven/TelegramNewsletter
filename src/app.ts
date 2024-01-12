import express from "express"
import 'dotenv/config'

import passport from "@/auth/auth"
import authRouter from "@/routers/authRouter"
import secureRouter from "@/routers/secureRouter"

const app = express()

// Configure express
app.use(express.json())
app.use(express.urlencoded());

// Initiate passport
app.use(passport.initialize())

// Routes
app.use('/', authRouter)
app.use('/user', passport.authenticate('jwt', { session: false }), secureRouter);

app.listen(process.env.PORT, () => {
 console.log("Listening on port: " + process.env.PORT);
})