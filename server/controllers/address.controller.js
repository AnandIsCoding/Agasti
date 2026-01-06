// controllers/address.controller.js
import Address from "../models/address.model.js";
import { StatusCodes } from "http-status-codes";

// Add a new address

export const addAddress = async (req, res) => {
  try {
    const { address_line, city, state, pincode, country, mobile, status } =
      req.body;

    // 2️⃣ Create new address
    const newAddress = await Address.create({
      userId: req.user._id,
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
      status,
    });

    // 3️⃣ Reset user's address array to only this new address
    req.user.address = [newAddress._id];
    await req.user.save();

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    console.error("Error in addAddress:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Could not add address",
    });
  }
};

// Get addresses of logged-in user
export const getAddresses = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all addresses for user, latest first
    const addresses = await Address.find({ userId }).sort({ createdAt: -1 });

    return res.status(StatusCodes.OK).json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("Error in getAddresses:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Could not fetch addresses",
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, userId: req.user._id },
      { $set: req.body }, // ✅ update only fields
      { new: true, runValidators: true },
    );

    if (!updatedAddress) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Update address error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Could not update address",
    });
  }
};
