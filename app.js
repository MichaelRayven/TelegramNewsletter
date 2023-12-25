import { Telegraf } from "telegraf"
import { message } from "telegraf/filters"
import 'dotenv/config'

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.on(message("text"), async (ctx) => {
  await ctx.telegram.sendMessage(ctx.message.chat.id, `You've send: ${ctx.message.text}`)
})

bot.launch()

process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))