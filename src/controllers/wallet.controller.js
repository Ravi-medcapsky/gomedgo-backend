import {  withdrawMoneyService, getTransactionHistoryService } from "../services/wallet.service.js";



export const withdrawMoney = async (req, res) => {
    try {
        const { amount } = req.body;
        const service_provider_id = req.session.service_provider_id
        if ( !amount) return res.status(400).json({ message: " amount required" });

        const result = await withdrawMoneyService(service_provider_id, amount);
        res.status(200).json({ message: "Withdrawal successful", ...result, status:200 });
    } catch (error) {
        res.status(400).json({ message: error.message, status:400 });
    }
};

export const getTransactionHistory = async (req, res) => {
    try {
         const service_provider_id = req.session.service_provider_id
        const transactions = await getTransactionHistoryService(service_provider_id);
        res.status(200).json({transactions, status:200});
    } catch (error) {
        res.status(400).json({ message: error.message, status:400 });
    }
};
