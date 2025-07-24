// ^ betekent begin van de string
// /^[A-Za-z0-9._%+-]+@/ betekent één of meer geldige tekens voor de @
// @ moet aanwezig zijn (+@ zegt dit)
// [A-Za-z0-9.-]+ één of meer geldige tekens in het domein gedeelte
// \. de punt moet tussen domein en tld
// [A-Za-z]{2,}$ betekent minstens 2 letters voor de tld en $ is einde van string
// (?!.*\.\.) betekent: twee punten achter elkaar is ongeldig
export function checkEmailValidity(email) {
  const regex =
    /^[A-Za-z0-9](?!.*\.\.)[A-Za-z0-9._%+-]*[A-Za-z0-9]?@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return regex.test(email);
}
