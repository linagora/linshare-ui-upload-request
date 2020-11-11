export function isPasswordValid(str) {
  //eslint-disable-next-line
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{12,})/.test(str);
}