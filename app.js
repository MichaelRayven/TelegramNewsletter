import { Telegraf } from "telegraf"
import { message } from "telegraf/filters"
import express from "express"
import passport from "passport"
import LocalStrategy from "passport-local"
import expressSession from "express-session"
import 'dotenv/config'
import { authenticateUser, getUserById, registerUser } from "./userDatabase.js"
import { getSubscribersByBotId, registerSubscriber } from "./subscriberDatabase.js"

const bot = new Telegraf(process.env.BOT_TOKEN)
const app = express()

// Configure express
app.use(express.json())
app.use(express.urlencoded());
app.use(expressSession({
  secret: process.env.SECRET_KEY, 
  resave: false,
  saveUninitialized: false,
}))

// Initiate passport
app.use(passport.initialize())
app.use(passport.session())

// Setting up local strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (username, password, done) => {
  const result = await authenticateUser(username, password);
  if (result.successful) {
    return done(null, { id: result.data.id, email: result.data.email })
  } else {
    return done(null, false, { message: result.error })
  }
}))

// Serialization and Deserialization
passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
  const result = await getUserById(id)
  done(null, { id: result.data.id, email: result.data.email })
})

// Login route
app.post('/login',
  passport.authenticate('local', { authInfo: true, failureMessage: true, failureRedirect: "/logout" }),
  (req, res) => {
    res.redirect('/');
  }
);

// Logout route
app.get('/logout', (req, res) => {
  console.log(req.session.messages);
  // req.logout();
  // res.redirect('/');
});

// Register route
app.post('/register', async (req, res) => {
  const result = await registerUser(req.body.email, req.body.password);
  if (result.successful) {
    res.status(200).send("Successful")
  } else {
    res.status(401).send(result.error)
  }
});

// Protected routes
app.post('/sendMessage', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      res.send(`Hello, ${req.user.email}!`);
      const result = await getSubscribersByBotId(bot.botInfo?.id)
      console.log(result);
      if (result.successful) {
        for (const sub of result.data) {
          console.log(sub);
          await bot.telegram.sendMessage(sub.chatId, req.body.message)
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  } else {
    res.redirect('/login');
  }
});

bot.command("start", async (ctx) => {
  await registerSubscriber(ctx.message.from.id, ctx.message.from.username, ctx.message.chat.id, ctx.botInfo.id)
})

bot.on(message("text"), async (ctx) => {
  await ctx.telegram.sendMessage(ctx.message.chat.id, `You've send: ${ctx.message.text}`)
})

app.use(await bot.createWebhook({domain: process.env.DOMAIN})).listen(process.env.PORT, () => {
 console.log("Listening on port: " + process.env.PORT);
})

// process.once("SIGINT", () => bot.stop("SIGINT"))
// process.once("SIGTERM", () => bot.stop("SIGTERM"))