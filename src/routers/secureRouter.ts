import { Router } from "express";
import "dotenv/config";

const router = Router();

// router.post('/sendMessage', async (req, res) => {
//   try {
//     res.send(`Hello, ${req.user.email}!`);
//     const result = await getSubscribersByBotId(bot.botInfo?.id)
//     console.log(result);
//     if (result.successful) {
//       for (const sub of result.data) {
//         console.log(sub);
//         await bot.telegram.sendMessage(sub.chatId, req.body.message)
//       }
//     }
//   } catch (error) {
//     console.error(error.message);
//   }
// });

export default router;