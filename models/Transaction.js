import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    title: { type: String, required: true, unique:true },
    amount: { type: String, required: true },
    type: { type: String, required: true },
    date:{ type: Date, required: true },
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}
},{timestamps:true});

const Transaction = mongoose.model('Transaction', TransactionSchema);
 Transaction.syncIndexes();
export default Transaction;
