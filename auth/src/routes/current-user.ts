import express from "express";
import {currentUser} from '@wealthface/common'

const router = express.Router();

router.get("/api/users/currentUser",  currentUser, (req, res) => {
  //!req.session || !req.session.jwt is equal to
  res.send({currentUser: req.currentUser || null});
});

export { router as currentUserRouter };
