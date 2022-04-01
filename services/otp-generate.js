const otpGenerator = require("otp-generator");

const generateOtp = () => {
  return otpGenerator.generate(6, {
    upperCase: false,
    alphabets: false,
    specialChars: false,
  });
};

module.exports = {
  generateOtp,
};
