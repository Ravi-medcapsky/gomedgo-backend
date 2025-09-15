import ProviderSupportService from "../services/ProviderSupport.service.js";

export default class ProviderSupportController {
  static async raiseTicket(req, res) {
    try {
      const ticket = await ProviderSupportService.raiseTicket(req.body);
      res.status(201).json({
        success: true,
        message: "Support ticket created successfully",
        data: ticket
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getHistory(req, res) {
    try {
      const { providerId } = req.params;
      const history = await ProviderSupportService.getHistory(providerId);
      res.status(200).json({
        success: true,
        message: "Support history fetched successfully",
        data: history
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
