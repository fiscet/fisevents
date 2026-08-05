import arcjet, {
  fixedWindow,
  slidingWindow,
  validateEmail,
} from "@arcjet/next";

export {
  fixedWindow,
  slidingWindow,
  validateEmail,
};

export default arcjet({
  key: process.env.ARCJET_KEY!,

  rules: [],
});
