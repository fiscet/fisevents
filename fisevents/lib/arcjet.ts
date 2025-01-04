import arcjet, {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
  validateEmail,
  slidingWindow,
} from "@arcjet/next";

export {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
  validateEmail,
};

export default arcjet({
  key: process.env.ARCJET_KEY!,

  rules: [],
});