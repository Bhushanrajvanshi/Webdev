const mongoose = require("mongoose");
const ledgerModel = require("./ledger.model");

const accountSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Account must be associated with a user"],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["active", "inactive", "suspended"],
            message: "Status must be either active, inactive, or suspended"
        },
        default: "active"
    },
    currency: {
        type: String,
        required: [true, "Currency is required for creating an account"],
        default: "INR"
    }
}, { timestamps: true });

accountSchema.index({ user: 1, status: 1});

accountSchema.methods.getBalance = async function() {
    const balanceData = await ledgerModel.aggregate([
        { $match: {account: this._id} },
        {
            $group: {
                _id: null,
                totalDebit: {
                    $sum: {
                        $cond: [
                            {$eq: ["$transaction.type", "DEBIT"]},
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit: {
                    $sum: {
                        $cond: [
                            {$eq: ["$transaction.type", "CREDIT"]},
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                balance: { $subtract: ["$totalCredit", "$totalDebit"] }
            }
        }
    ])

    return balanceData.length > 0 ? balanceData[0].balance : 0;
}



const accountModel = mongoose.model("Account", accountSchema);
module.exports = accountModel;