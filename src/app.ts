import { Telegraf } from "telegraf"
import { message } from "telegraf/filters"
import express from "express"
import 'dotenv/config'

import passport from "@/auth/auth"
import authRouter from "@/routers/authRouter"
import secureRouter from "@/routers/secureRouter"

// const bot = new Telegraf(process.env.BOT_TOKEN)
const app = express()

// Configure express
app.use(express.json())
app.use(express.urlencoded());

// Initiate passport
app.use(passport.initialize())

// Routes
app.use('/', authRouter)
app.use('/user', passport.authenticate('jwt', { session: false }), secureRouter);

// bot.command("start", async (ctx) => {
//   await registerSubscriber(ctx.message.from.id, ctx.message.from.username, ctx.message.chat.id, ctx.botInfo.id)
// })

// bot.on(message("text"), async (ctx) => {
//   await ctx.telegram.sendMessage(ctx.message.chat.id, `You've send: ${ctx.message.text}`)
// })

// app.use(await bot.createWebhook({domain: process.env.DOMAIN}))

app.listen(process.env.PORT, () => {
 console.log("Listening on port: " + process.env.PORT);
})