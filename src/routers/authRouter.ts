import { Router } from "express";
import passport from "@/auth/auth";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { UserModel } from "@/interface/types";
import { IVerifyOptions } from "passport-local";

const router = Router();

router.post('/signup', passport.authenticate(
  'signup',
  { session: false }),
  async (req, res, next) => {
    return res.json({
      message: 'Signup successful',
      user: req.user
    });
  }
)

router.post('/login', async (req, res, next) => {
  passport.authenticate(
    'login',
    async (err: Error, user: UserModel, info: IVerifyOptions) => {
      try {
        if (err || !user) {
          const error = new Error('An error occurred.');
          return next(error);
        }
        req.login(
          user,
          { session: false },
          async (error) => {
            if (error) return next(error);
            const body = { id: user.id, email: user.email, username: user.username };
            const token = jwt.sign({ user: body }, process.env.JWT_SECRET || "");
            return res.json({ token });
          }
        );
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
})

router.get('/logout', (req, res) => {
  req.logout((err) => {});
  res.redirect('/');
});

export default router