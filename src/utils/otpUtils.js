


export const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const getExpiryTime = (minutes = 5) => {
  const now = new Date();
  return new Date(now.getTime() + minutes * 60000);
};
