export function checkTokenValidity(exp) {
  const currentTime = Date.now() / 1000;
  return exp && exp > currentTime;
}
