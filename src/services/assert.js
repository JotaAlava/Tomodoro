export default function (condition, errorName) {
  if (!condition) {
    throw Error(errorName);
  }
}
