import express from "express";
import session from "express-session";
import authRoutes from "./routes/auth.routes.js";
import providerPhotoRoutes from "./routes/providerPhoto.routes.js";
import providerRoutes from "./routes/provider.routes.js";
import providerAddressRoutes from "./routes/providerAddress.routes.js";
import providerDocumentRoutes from "./routes/providerDocument.routes.js";
import providerPaymentAssetsRoutes from "./routes/providerPaymentAssets.routes.js";
import providerStatusTrackingRoutes from "./routes/providerStatusTracking.routes.js";
import messageToAdmineRoutes from "./routes/message.route.js";
import providerWalletRoutes from "./routes/providerWallet.js";
import appointment from "./routes/appointment.routes.js";
import review from "./routes/review.routes.js"

import dotenv from 'dotenv';
dotenv.config();


import userRoutes from "./routes/user.routes.js";
import userBookingRoutes from "./routes/userBooking.routes.js"

const app = express();
app.use(express.json());

app.use(
  session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/photo", providerPhotoRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/address", providerAddressRoutes);
app.use("/api/document", providerDocumentRoutes);
app.use("/api/payment", providerPaymentAssetsRoutes);
app.use("/api/wallet",providerWalletRoutes)

app.use("/api/status", providerStatusTrackingRoutes);


app.use("/api/user", userRoutes);
app.use("/api/userBooking",userBookingRoutes);
app.use("/api/appointment",appointment);
app.use("/api/reviw",review)


app.use("/api/messageToAdmine",messageToAdmineRoutes)

export default app;
