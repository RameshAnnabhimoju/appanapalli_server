import donation from "../models/donation.model.js";
import xlsx from "xlsx";
import { getEndDate, getStartDate } from "../utils/dateUtils.js";



export const addMultipleDonations = (request, response) => {
  try {
    const workbook = xlsx.read(request?.file?.buffer, {
      type: "buffer",
      cellDates: true,
    });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);
    const preparedJsonData = jsonData?.map((data) => {
      if (data?.performance_date) {
        data.performance_date = new Date(data.performance_date);
      }
      if (data?.booked_on) {
        data.booked_on = new Date(data?.booked_on);
      }
      return data;
    });
    donation
      .insertMany(preparedJsonData)
      .then(() => {
        return response
          .status(200)
          .json({ message: "donations added successfully", type: "success" });
      })
      .catch((error) => {
        return response.status(400).json({
          error: error.message,
          message: "error adding multiple donations",
          type: "fail",
        });
      });
  } catch (error) {
    console.log("[add donation error] ", error);
    return response.status(400).json({
      error: error.message,
      message: "something went wrong, please try again!",
      type: "fail",
    });
  }
};

export const updateMultipleDonations = (request, response) => {
  try {
    const workbook = xlsx.read(request?.file?.buffer, {
      type: "buffer",
      cellDates: true,
    });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);
    const preparedJsonData = jsonData?.map((data) => {
      if (data?.performance_date) {
        data.performance_date = new Date(data.performance_date);
      }
      if (data?.booked_on) {
        data.booked_on = new Date(data?.booked_on);
      }
      return data;
    });
    let bulkUpdateArray = [];
    preparedJsonData?.forEach((data) => {
      bulkUpdateArray.push({
        updateOne: { filter: { booking_id: data?.booking_id }, update: data },
      });
    });
    donation
      .bulkWrite(bulkUpdateArray, { ordered: false })
      .then(() => {
        return response
          .status(200)
          .json({ message: "donations updated successfully", type: "success" });
      })
      .catch((error) => {
        return response.status(400).json({
          error: error.message,
          message: "error updating multiple donations",
          type: "fail",
        });
      });
  } catch (error) {
    console.log("[add donation error] ", error);
    return response.status(400).json({
      error: error.message,
      message: "something went wrong, please try again!",
      type: "fail",
    });
  }
};

// export const updateDonation = (request, response) => {
//   try {
//     const {
//       body,
//       body: { booking_id },
//     } = request;
//     if (!booking_id) {
//       return response.status(400).json({
//         message: "invalid booking_id, please send avalid booking_id",
//         type: "fail",
//       });
//     }
//     donation
//       ?.findOneAndUpdate(booking_id, body)
//       .then((data) => {
//         return response.status(200).json({
//           message: "donation fetched sucessfully",
//           data,
//           type: "success",
//         });
//       })
//       .catch((error) => {
//         return response.status(400).json({
//           error: error.message,
//           message: "error updating donation",
//           type: "fail",
//         });
//       });
//   } catch (error) {
//     console.log("[add donation error] ", error);
//     return response.status(400).json({
//       error: error.message,
//       message: "something went wrong, please try again!",
//       type: "fail",
//     });
//   }
// };
// export const addDonation = (request, response) => {
//   try {
//     const { body } = request;
//     if (body?.performance_date) {
//       body.performance_date = new Date(body.performance_date);
//     }
//     if (body?.booked_on) {
//       body.booked_on = new Date(body?.booked_on);
//     }
//     donation
//       .create(body)
//       .then((data) => {
//         return response.status(200).json({
//           message: "donation added successfully",
//           data,
//           type: "success",
//         });
//       })
//       .catch((error) => {
//         return response.status(400).json({
//           error: error.message,
//           message: "error adding donation",
//           type: "fail",
//         });
//       });
//   } catch (error) {
//     console.log("[add donation error] ", error);
//     return response.status(400).json({
//       error: error.message,
//       message: "something went wrong, please try again!",
//       type: "fail",
//     });
//   }
// };

export const manageDonation = (request, response) => {
  try {
    const { body, body: { _id } } = request;

    // Convert dates to `Date` objects if present
    if (body?.performance_date) {
      body.performance_date = new Date(body.performance_date);
    }
    if (body?.booked_on) {
      body.booked_on = new Date(body?.booked_on);
    }

    // If `id` is provided, attempt to update the existing donation
    if (_id) {
      donation
        .findOneAndUpdate({ _id }, body, { new: true }) // `{ new: true }` returns the updated document
        .then((data) => {
          if (!data) {
            return response.status(404).json({
              message: "Donation not found for the given id",
              type: "fail",
            });
          }
          return response.status(200).json({
            message: "Donation updated successfully",
            data,
            type: "success",
          });
        })
        .catch((error) => {
          return response.status(400).json({
            error: error.message,
            message: "Error updating donation",
            type: "fail",
          });
        });
    } else {
      // If no `id`, create a new donation
      donation
        .create(body)
        .then((data) => {
          return response.status(200).json({
            message: "Donation added successfully",
            data,
            type: "success",
          });
        })
        .catch((error) => {
          return response.status(400).json({
            error: error.message,
            message: "Error adding donation",
            type: "fail",
          });
        });
    }
  } catch (error) {
    console.log("[manageDonation error] ", error);
    return response.status(400).json({
      error: error.message,
      message: "Something went wrong, please try again!",
      type: "fail",
    });
  }
};


export const getDonations = (request, response) => {
  try {
    const { page, limit, fromDate, toDate, ...rest } = request.query;
    const startDate = new Date(getStartDate(fromDate));
    const endDate = new Date(getEndDate(toDate));
    if (startDate > endDate) {
      return response.status(400).json({
        error: "Error fetching donations",
        message: "start date cannot be greater than end date.",
        type: "fail",
      });
    }
    const limitStep = parseInt(limit, 10) || 10;
    const skipStep = parseInt(page, 10) - 1 || 0 * limitStep;
    const filter = { ...rest, booked_on: { ...(fromDate && { $gte: fromDate }), ...(toDate && { $lte: toDate }) } };

    Promise.all([
      donation.countDocuments(filter),
      donation.find(filter).skip(skipStep).limit(limitStep)
    ])
      .then(([totalCount, data]) => {
        if (data.length === 0 || totalCount === 0) {
          return response.status(200).json({
            message: "no donations exist",
            data,
            totalCount,
            type: "fail",
          });
        }
        return response.status(200).json({
          message: "donation fetched successfully",
          data,
          totalCount,
          type: "success",
        });
      })
      .catch((error) => {
        return response.status(400).json({
          error: error.message,
          message: "error fetching donation",
          type: "fail",
        });
      });
  } catch (error) {
    console.log("[add donation error] ", error);
    return response.status(400).json({
      error: error.message,
      message: "something went wrong, please try again!",
      type: "fail",
    });
  }
};
