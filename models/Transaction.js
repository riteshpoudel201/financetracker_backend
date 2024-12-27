import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: String, required: true },
    type: { type: String, required: true },
    date:{ type: Date, required: true },
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}
},{timestamps:true});

TransactionSchema.index({title:1, userId:1,date:1},{ unique:true});
const Transaction = mongoose.model('Transaction', TransactionSchema);
 Transaction.syncIndexes();
export default Transaction;
