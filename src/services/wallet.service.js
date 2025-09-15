import { getWalletByUser, createWallet, updateWalletBalance,getWalletMinus } from "../models/wallet.model.js";
import { addTransaction, getTransactions } from "../models/transaction.model.js";
import { canWithdraw } from "../helpers/wallet.helper.js";

export const creditMoneyService = async (service_provider_id,balance) => {

      console.log("service_provider_id service",service_provider_id);
        console.log("balance service",balance)
    let wallet = await getWalletByUser(service_provider_id);
    if (!wallet) {
        await createWallet(service_provider_id,balance);
        wallet = await getWalletByUser(service_provider_id);
    }
    console.log("wallet",wallet)
    console.log("wallet_id",wallet.id )
    const newBalance = parseFloat(wallet.balance) + parseFloat(balance);
    await updateWalletBalance(wallet.id, newBalance);
    await addTransaction(wallet.id, "credit", balance);

    return { balance: newBalance };
};
export const get = async (service_provider_id) => {

      console.log("service_provider_id service",service_provider_id);
      
    let wallet = await getWalletByUser(service_provider_id);
 

    return wallet;
};

export const minus = async (service_provider_id,medcapsky_cost) => {

      console.log("service_provider_id service",service_provider_id);
      
    let walletminus = await getWalletMinus(service_provider_id,medcapsky_cost);
 

    return walletminus;
};

export const withdrawMoneyService = async (service_provider_id, amount) => {
    const wallet = await getWalletByUser(service_provider_id);
    if (!wallet) throw new Error("Wallet not found");

    const transactions = await getTransactions(wallet.id);
    const lastCredit = transactions.find(t => t.type === "credit");
    if (!lastCredit) throw new Error("No credit found");

    if (!canWithdraw(lastCredit.created_at)) {
        throw new Error("Withdrawal allowed only after 24 hours from last credit");
    }

    if (wallet.balance < amount) throw new Error("Insufficient balance");

    const newBalance = parseFloat(wallet.balance) - parseFloat(amount);
    await updateWalletBalance(wallet.id, newBalance);
    await addTransaction(wallet.id, "debit", amount);

    return { balance: newBalance };
};

export const getTransactionHistoryService = async (service_provider_id) => {
    const wallet = await getWalletByUser(service_provider_id);
    if (!wallet) throw new Error("Wallet not found");

    const transactions = await getTransactions(wallet.id);
    return transactions;
};
