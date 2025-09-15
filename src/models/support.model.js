export const supportModel = {
  createTicket: `
    INSERT INTO UserHelpAndSupport (userId, subject, message, attachment)
    OUTPUT INSERTED.*
    VALUES (@userId, @subject, @message, @attachment)
  `,

  getHistoryByUserId: `
    SELECT * FROM UserHelpAndSupport WHERE userId = @userId ORDER BY createdAt DESC
  `
};
