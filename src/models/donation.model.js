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
    id_prood_type: { type: String },
    id_proof_number: { type: String },
    ocassion: { type: String },
    email: { type: String },
  },
  { timestamps: true }
);
const donation = model("donation", donationSchema);
export default donation;
