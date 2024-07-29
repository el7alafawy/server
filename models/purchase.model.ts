import mongoose,{Document,Model,Schema} from "mongoose";

export interface IItem extends Document
{
    itemId:string;
    quantity:number;
    totalPrice:number;
}
export interface IPurchase extends Document
{
    items:IItem[];
    userId:string;
    payment_info:object;
}
const purchaseSchema = new Schema<IPurchase>({
    items:[Object],
    userId:
    {
        type:String,
        required:true,
    },
    payment_info:
    {
        type:Object,
        // required:true
    },
},{timestamps:true})

const PurchaseModel :Model<IPurchase> = mongoose.model("Purchase",purchaseSchema);
export default PurchaseModel;