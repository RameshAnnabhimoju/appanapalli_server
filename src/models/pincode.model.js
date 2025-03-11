import { model, Schema } from "mongoose";

const pincodeSchema = new Schema(
    {
        circlename: { type: String },
        regionname: { type: String },
        divisionname: { type: String },
        officename: { type: String },
        pincode: { type: Number },
        officetype: { type: String },
        delivery: { type: String },
        district: { type: String },
        statename: { type: String },
        latitude: { type: Number },
        longitude: { type: Number },
    },
);
const pincode = model("pincode", pincodeSchema);
export default pincode;
