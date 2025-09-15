import ProviderSupportModel from "../models/ProviderSupport.model.js";
import ProviderSupportHelper from "../helper/ProviderSupport.helper.js";

export default class ProviderSupportService {
  static async raiseTicket(data) {
    ProviderSupportHelper.validateTicketData(data);
    const ticket = await ProviderSupportModel.createSupportTicket(data);
    return ticket;
  }

  static async getHistory(providerId) {
    if (!providerId) throw new Error("ProviderId is required");
    const history = await ProviderSupportModel.getSupportHistory(providerId);
    return history;
  }
}
