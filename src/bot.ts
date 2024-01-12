import { getSubscriberGroupByCode } from "./repository/subscriberGroupRepository";
import { createSubscriber } from "@/repository/subscriberRepository";
import { Bot } from "grammy";
import "dotenv/config"

const bot = new Bot(process.env.BOT_TOKEN || "")

bot.command("start", async ctx => {
  if (ctx.from?.id && ctx.from?.username) {
    const subscriber = await createSubscriber(ctx.from?.id, ctx.chat.id, ctx.from?.username)

    if (subscriber.successful) {
      const group = await getSubscriberGroupByCode(ctx.match)

      if (group.successful) {
        await subscriber.data.addGroup(group.data.id)
      }
    }
  }
  
  ctx.reply("Hello there!")
})

bot.on("message", ctx => {
  ctx.reply(`Echo: ${ctx.message.text}`)
})

bot.start()

export default bot