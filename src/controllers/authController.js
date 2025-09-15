import * as otpService from "../services/otpService.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
import * as userModel from "../models/user.model.js";
import { providerModel } from "../models/provider.model.js";
import { verifyOrRegisterServiceProvider } from '../models/otpVerification.model.js';
import session from "express-session";
console.log("JWT_SECRET:", process.env.JWT_SECRET);



export const requestOtp = async (req, res) => {
  try {
    const { identifier, type, role } = req.body;

    if (!identifier || !type || !role) {
      return res
        .status(400)
        .json({status:400, message: "Identifier, type, and role are required" });
    }

    if (!["email", "mobile"].includes(type)) {
      return res
        .status(400)
        .json({status:400,message: "Type must be either 'email' or 'mobile'" });
    }

    if (!["user", "provider"].includes(role)) {
      return res
        .status(400)
        .json({status:400, message: "Role must be 'user' or 'provider'" });
    }

    req.session.identifier_session = identifier;
    req.session.type_session = type;
    req.session.role_session = role; // Store role in session

    const otp = await otpService.sendOtp(identifier, type);
    return res.status(200).json({ status: 200,message: "OTP sent successfully", otp });
  } catch (error) {
    console.error("Request OTP Error:", error);
    res.status(500).json({ message: "Internal server error",status:500 });
  }
};
export const requestOtpresend = async (req, res) => {
  try {
     
    const identifier = req.session.identifier_session ;
    const type = req.session.type_session ;
    const role = req.session.role_session ; 


    if (!identifier || !type || !role) {
      return res
        .status(400)
        .json({status:400, message: "Identifier, type, and role are required" });
    }

    if (!["email", "mobile"].includes(type)) {
      return res
        .status(400)
        .json({status:400,message: "Type must be either 'email' or 'mobile'" });
    }

    if (!["user", "provider"].includes(role)) {
      return res
        .status(400)
        .json({status:400, message: "Role must be 'user' or 'provider'" });
    }

   

    const otp = await otpService.sendOtp(identifier, type);
    return res.status(200).json({ status: 200,message: "OTP sent successfully", otp });
  } catch (error) {
    console.error("Request OTP Error:", error);
    res.status(500).json({ message: "Internal server error",status:500 });
  }
};




export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const identifier = req.session.identifier_session;
    const type = req.session.type_session;
    const role = req.session.role_session;

    if (!otp) {
      return res.status(400).json({ status: 400, message: "OTP is required" });
    }

    if (!identifier || !type || !role) {
      return res.status(400).json({
        status: 400,
        message: "Session expired. Please request OTP again.",
      });
    }

    const isValid = await otpService.verifyOtp(identifier, otp);
    if (!isValid) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid or expired OTP" });
    }

    let userOrProvider;

    if (role === "user") {
      // Check if user exists, else create
      userOrProvider = await userModel.findByIdentifier(identifier);
      if (!userOrProvider) {
        userOrProvider = await userModel.createUser({ identifier });
      }
      req.session.user_id = userOrProvider.id;
      console.log("Stored user_id in session:", req.session.user_id);
    } else if (role === "provider") {
      // Check if provider exists
      let provider = await providerModel.fetchRegisteredServiceProviderIdByMobile(identifier );

      if (!provider) {
        console.log("Provider not registered completely");

        const { newprovider, isRegistered, DBmessage } =
          await verifyOrRegisterServiceProvider({ identifier, type });

        req.session.service_provider_id = newprovider.id;
        console.log('session exited stored in req.session.service_provider_id ', req.session.service_provider_id)

        if (!isRegistered) {
          return res.status(401).json({
            DBmessage,
            status: 401,
          });
        }

        userOrProvider = newprovider; // assign new provider
      } else {
        // Existing provider
        req.session.service_provider_id = provider.id;
        console.log('session exited stored in req.session.service_provider_id ', req.session.service_provider_id)
        userOrProvider = provider; // assign existing provider
      }
    }

    // Generate token once user/provider is resolved
    const token = jwt.sign(
      { id: userOrProvider.id || userOrProvider.u_id, identifier },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Only one response from here
    return res.status(200).json({
      message: "OTP verified successfully",
      status: 200,
      token,
      user: userOrProvider,
      role,
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

//Logout

export const Logout = async (req, res) => {
  try {
    // Optional: get session info before destroying
    const identifier = req.session.identifier_session;
    const type = req.session.type_session;
    const role = req.session.role_session;

    // Destroy the session
    req.session.destroy(err => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ success: false, message: "Logout failed." });
      }

      // Optional: clear the cookie if you're using one
      res.clearCookie('connect.sid'); // or your session cookie name

      return res.status(200).json({
        success: true,
        message: "Logged out successfully.",
        data: { identifier, type, role } // Optional: return for reference
      });
    });
  } catch (error) {
    console.error("Unexpected logout error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};
