const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const emailService = require("../services/email.service");
const accountModel = require("../models/account.model");
const mongoose = require("mongoose");


async function createTransaction(req, res) {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if( !fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({ message: "Missing required fields: fromAccount, toAccount, amount, idempotencyKey" });
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount,
    });

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    });

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message: "Invalid FromAccount or ToAccount. Please provide valid account IDs."
        })
    }

    /**
     * - 2.validate idempotencyKey.
     */ 
    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey,
    });

    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status === "COMPLETED"){
           return res.status(200).json({
                message: "Transaction already processed successfully",
                transaction: isTransactionAlreadyExists
            })
        }

        if(isTransactionAlreadyExists.status==="PENDING"){
           return res.status(200).json({
                message: "Transaction is already in progress. Please wait for completion.",
            })
        }

        if(isTransactionAlreadyExists.status==="FAILED"){
            return res.status(500).json({
                message: "Transaction processing failed previously, please retry"
            })
        }

        if(isTransactionAlreadyExists.status==="REVERSED"){
            return res.status(500).json({
                message: "Transaction was reversed, please retry"
            })
        }
    }

    /**
     * - 3. create transaction with status
    */
    if(fromUserAccount.status!=="active" || toUserAccount.status!=="active"){
        return res.status(400).json({
            message: "Both fromAccount and toAccount must be active to process the transaction"
        })
    }

    /**
     * - 4. Drive sender balance from ledger
     */ 
    const balance = await fromUserAccount.getBalance()
    if(balance < amount){
        return res.status(400).json({
            message: `Insufficient balance. current balance is ${balance}. requested amount is ${amount}`
        })
    }

    /**
     * - 5. Process transaction (PENDING -> COMPLETED/FAILED)
     */ 
    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = await transactionModel.create({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        type: "DEBIT"
    }, { session });

    const debitLedgerEntry = await ledgerModel.create({
        account: fromAccount,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    }, { session });

    const creditledgerEntry = await ledgerModel.create({
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    }, { session });

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();


    /**
     * - 10. send email notification
    */ 
   await emailService.sendTransactionEmail(req.user.eamil, req.user.name, amount, toUserAccount._id);

    return res.status(201).json({
        message: "Transaction processed successfully",
        transaction
    })
}


async function createInitialFundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body;

    if( !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({ message: "Missing required fields: toAccount, amount, idempotencyKey" });
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    })

    if(!toUserAccount){
        return res.status(400).json({
            message: "Invalid ToAccount. Please provide valid account ID."
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id,
    })

    if(!fromUserAccount){
        return res.status(400).json({
            message: "System user account not found for the authenticated user."
        })
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = new transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING",
    });

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    }], { session });

    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    }], { session });

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
        message: "Initial funds transaction processed successfully",
        transaction
    })

}

module.exports = { createTransaction, createInitialFundsTransaction }