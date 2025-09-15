import express from "express";
import {  withdrawMoney, getTransactionHistory } from "../controllers/wallet.controller.js";

const router = express.Router();


router.post("/withdraw", withdrawMoney);
router.get("/transactions", getTransactionHistory);

export default router;