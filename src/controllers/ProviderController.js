import * as providerService from "../services/providerService.js";

export const serviceProvider = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      age,
      gender,
      first_language,
      second_language,
    } = req.body;

    console.log("body", req.body);

    const service_provider_id = req.session.service_provider_id;
    console.log("service_provider_id", service_provider_id);

    if (
      !first_name ||
      !last_name ||
      !email ||
      !age ||
      !gender ||
      !first_language ||
      !second_language
    ) {
      return res
        .status(400)
        .json({ status: 400, message: "all data are required" });
    }
    //checking alredy filled or not Personal Data

    const existProvider = await providerService.fetchProvider({
      service_provider_id,
    });
    console.log("exist data in Provider", existProvider);

    if (existProvider) {
      console.log("exist Provider ");
      await providerService.updateProvider({
        service_provider_id,
        first_name,
        last_name,
        email,
        age,
        gender,
        first_language,
        second_language,
      });
      res
        .status(200)
        .json({
          status: 200,
          message: "Provider Updated Personal Information successfully",
        });
    } else {
      const provider = await providerService.providerCreate({
        service_provider_id,
        first_name,
        last_name,
        email,
        age,
        gender,
        first_language,
        second_language,
      });
      res.status(201).json({
        status: 201,
        message: "Service Provider  Personal information save Successfully",
        provider,
      });
    }
  } catch (error) {
    console.error("Request  Error:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

export const getProvider = async (req, res) => {
  try {
    const service_provider_id = req.session.service_provider_id;
    const provider = await providerService.fetchProvider(service_provider_id);

    if (!provider || provider.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "No provider found ",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      data: provider,
    });
  } catch (error) {
    console.error("Error fetching provider photos:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error fetching provider photos",
      error: error.message,
    });
  }
};

export const updateProviderVerified = async (req, res) => {
  try {
    // add only what should be updated
    const { first_name, last_name, email, mobile_no } = req.body;
    const service_provider_id = req.session.service_provider_id;

    const updated = await providerService.updateVerifiedProvider({
      service_provider_id,
      first_name,
      last_name,
      email,
      mobile_no,
    });
    res
      .status(200)
      .json({
        status: 200,
        message: "Provider updated successfully",
        data: updated,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProvider = async (req, res) => {
  try {
    const service_provider_id = req.session.service_provider_id;

    await providerPhotoServices.deleteProviderPhoto({ service_provider_id });
    res
      .status(200)
      .json({ status: 200, message: "Photo deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};
