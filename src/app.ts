import express from "express"
import 'dotenv/config'

import cors from "cors"
import passport from "@/auth/auth"
import authRouter from "@/routers/authRouter"
import secureRouter from "@/routers/secureRouter"
import { apiVersion } from "./config/config"

const app = express()

// Configure express
app.use(express.json())
app.use(express.urlencoded());
app.use(cors())

// Initiate passport
app.use(passport.initialize())

// Routes
app.use(`/${apiVersion}/user`, authRouter)
app.use(`/${apiVersion}/user`, passport.authenticate('jwt', { session: false }), secureRouter);

app.listen(process.env.PORT, () => {
 console.log("Listening on port: " + process.env.PORT);
})