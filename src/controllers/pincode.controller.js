import pincodeModel from "../models/pincode.model.js";
export const getPincodeAddress = (request, response) => {
    try {
        const { pincode } = request.query;
        if (!pincode) {
            return response.status(400).json({
                error: "Error fetching address",
                message: "Pincode is required.",
                type: "fail",
            });
        }
        pincodeModel
            .findOne({ pincode })
            .then((data) => {
                if (!data) {
                    return response.status(200).json({
                        message: "No address found for the given pincode",
                        data,
                        type: "fail",
                    });
                }
                return response.status(200).json({
                    message: "Address fetched successfully",
                    data,
                    type: "success",
                });
            })
            .catch((error) => {
                return response.status(400).json({
                    error: error.message,
                    message: "Error fetching address",
                    type: "fail",
                });
            });
    } catch (error) {
        console.log("[getPincodeAddress error] ", error);
        return response.status(500).json({
            error: error.message,
            message: "Something went wrong, please try again!",
            type: "fail",
        });
    }
};