import { model, Schema } from "mongoose";

const donationSchema = new Schema(
  {
    devotee: { type: String },
    phone: { type: String },
    address: { type: String },
    donation: { type: String },
    performance_date: { type: Date },
    transaction_id: { type: String },
    serial_no: { type: String },
    booking_id: { type: String },
    in_behalf_of: { type: String },
    amount: { type: Number },
    booked_on: { type: Date },
    id_proof_type: { type: String },
    id_proof_number: { type: String },
    occasion: { type: String },
    email: { type: String },
    gothram: { type: String },
    id_proof: { type: String },
    pincode: { type: String },
    state: { type: String },
    country: { type: String },
    paksham: { type: String },
    telugu_month: { type: String },
    sub_tidi: { type: String },
    payment_mode: { type: String }
  },
  { timestamps: true }
);
const donation = model("donation", donationSchema);
export default donation;
