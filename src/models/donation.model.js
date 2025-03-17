import { model, Schema } from "mongoose";

const donationSchema = new Schema(
  {
    devotee: { type: String },
    phone: { type: String },
    address: { type: String },
    donation: { type: String },
    performance_date: { type: Date },
    recept_no: { type: String, unique: true, required: true, dropDups: true, sparse: true },
    in_behalf_of: { type: String },
    amount: { type: Number },
    booked_on: { type: Date },
    occasion: { type: String },
    email: { type: String },
    gothram: { type: String },
    pincode: { type: String },
    state: { type: String },
    city: { type: String },
    district: { type: String },
    region: { type: String },
    country: { type: String },
    paksham: { type: String },
    telugu_month: { type: String },
    tidi: { type: String },
  },
  { timestamps: true }
);
const donation = model("donation", donationSchema);
export default donation;
