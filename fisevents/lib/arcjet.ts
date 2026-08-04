import arcjet, {
  detectBot,
  fixedWindow,
  slidingWindow,
  validateEmail,
} from "@arcjet/next";

export {
  detectBot,
  fixedWindow,
  slidingWindow,
  validateEmail,
};

export default arcjet({
  key: process.env.ARCJET_KEY!,

  rules: [],
});
