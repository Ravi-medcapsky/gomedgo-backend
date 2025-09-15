export const secondsDifference = (date1, date2) => {
  return (date2 - date1) / 1000; // difference in seconds
};

export const canWithdraw = (lastCreditTime) => {
  const secondsPassed = secondsDifference(new Date(lastCreditTime), new Date());
  return secondsPassed >= 50; // allow after 50 seconds
};

