export default function cekNumber(value) {
  const number = Number(value);

  if (number && number > 0 && number < 100) {
    return true;
  }

  return false;
}
