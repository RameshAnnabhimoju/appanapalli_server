import donation from "../models/donation.model.js";
import xlsx from "xlsx";
import { getEndDate, getStartDate } from "../utils/dateUtils.js";
import mongoose from "mongoose";

export const manageMultipleDonations = async (request, response) => {
  try {
    const workbook = xlsx.read(request?.file?.buffer, {
      type: "buffer",
      cellDates: true,
    });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    // console.log("Parsed Excel Data:", jsonData); // Debugging

    if (!jsonData.length) {
      return response.status(400).json({
        error: "No valid data found in the uploaded Excel file",
        type: "fail",
      });
    }

    // Transform data before inserting/updating
    const preparedJsonData = jsonData.map((data) => ({
      booking_id: data['Booking ID'] || new mongoose.Types.ObjectId(),
      devotee: data.Devotee || null,
      phone: data.Phone || null,
      address: data.Address || null,
      donation: data.Donation || null,
      performance_date: data["Performance Date"] ? new Date(data["Performance Date"]) : null,
      transaction_id: data["Transaction ID"] || null,
      serial_no: data["Serial No"] || null,
      booked_on: data["Booked On"] ? new Date(data["Booked On"]) : null,
      email: data.Email || null,
      gothram: data.Gothram || null,
      pincode: data.Pincode || null,
      state: data.State || null,
      country: data.Country || null,
      payment_mode: data["Payment Mode"] || null,
      in_behalf_of: data["In Behalf Of"] || null,
      amount: data.Amount ? Number(data.Amount) : null,
      id_proof_type: data["ID Proof Type"] || null,
      id_proof_number: data["ID Proof Number"] || null,
      occasion: data.Occasion || null,
      id_proof: data["ID Proof"] || null,
      paksham: data.Paksham || null,
      telugu_month: data["Telugu Month"] || null,
      sub_tidi: data["Sub Tidi"] || null,
    }));

    // console.log("Transformed Data Before Insert:", preparedJsonData); // Debugging

    let bulkOperations = preparedJsonData.map((data) => ({
      updateOne: {
        filter: { booking_id: data.booking_id },
        update: { $set: data },
        upsert: true, // Insert if not found
      },
    }));

    await donation.bulkWrite(bulkOperations, { ordered: false });

    return response.status(200).json({
      message: "Donations managed successfully (added or updated)",
      type: "success",
    });
  } catch (error) {
    console.log("[manage donations error]", error);
    return response.status(400).json({
      error: error.message,
      message: "Something went wrong, please try again!",
      type: "fail",
    });
  }
};

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

export const downloadExcel = (request, response) => {
  try {
    const { fromDate, toDate, ...rest } = request.query;
    const startDate = new Date(getStartDate(fromDate));
    const endDate = new Date(getEndDate(toDate));

    if (startDate > endDate) {
      return response.status(400).json({
        error: "Error fetching donations",
        message: "Start date cannot be greater than end date.",
        type: "fail",
      });
    }

    const filter = {
      ...rest,
      booked_on: {
        ...(fromDate && { $gte: fromDate }),
        ...(toDate && { $lte: toDate }),
      },
    };

    donation
      .find(filter)
      .then((data) => {
        if (data.length === 0) {
          return response.status(200).json({
            message: "No donations exist",
            data,
            type: "fail",
          });
        }
        // console.log("data", data);
        // Convert data to a JSON-friendly format
        const jsonData = data.map((item) => ({
          Devotee: item.devotee,
          Phone: item.phone,
          Address: item.address,
          Donation: item.donation,
          "Performance Date": item.performance_date?.toISOString().split("T")[0],
          "Transaction ID": item.transaction_id,
          "Serial No": item.serial_no,
          "Booking ID": item.booking_id,
          "In Behalf Of": item.in_behalf_of,
          Amount: item.amount,
          "Booked On": item.booked_on?.toISOString().split("T")[0],
          Email: item.email,
          Gothram: item.gothram,
          Pincode: item.pincode,
          State: item.state,
          Country: item.country,
          "Payment Mode": item.payment_mode,
        }));

        // Create an Excel sheet and workbook
        const worksheet = xlsx.utils.json_to_sheet(jsonData);

        // Define column widths
        worksheet['!cols'] = [
          { wch: 20 }, // Devotee
          { wch: 15 }, // Phone
          { wch: 30 }, // Address
          { wch: 25 }, // Donation
          { wch: 15 }, // Performance Date
          { wch: 20 }, // Transaction ID
          { wch: 10 }, // Serial No
          { wch: 15 }, // Booking ID
          { wch: 20 }, // In Behalf Of
          { wch: 10 }, // Amount
          { wch: 15 }, // Booked On
          { wch: 25 }, // Email
          { wch: 20 }, // Gothram
          { wch: 10 }, // Pincode
          { wch: 15 }, // State
          { wch: 15 }, // Country
          { wch: 15 }, // Payment Mode
        ];
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Donations");

        // Write workbook to a buffer
        const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

        // Send the buffer as a downloadable file
        response.setHeader("Content-Disposition", "attachment; filename=donations.xlsx");
        response.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        return response.status(200).send(buffer);
      })
      .catch((error) => {
        return response.status(400).json({
          error: error.message,
          message: "Error fetching donations",
          type: "fail",
        });
      });
  } catch (error) {
    console.log("[downloadExcel error] ", error);
    return response.status(400).json({
      error: error.message,
      message: "Something went wrong, please try again!",
      type: "fail",
    });
  }
};

