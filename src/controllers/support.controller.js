import { createSupportTicket, getSupportHistory } from "../services/support.service.js";

export const createTicket = async (req, res) => {
  const response = await createSupportTicket(req.body);
  return res.status(response.status).json(response);
};

export const getHistory = async (req, res) => {
  const { userId } = req.params;
  const response = await getSupportHistory(userId);
  return res.status(response.status).json(response);
};
