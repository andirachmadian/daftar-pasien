export default function cekNameCapitalize(e) {
  if (e.target.value) {
    const value = e.target.value;
    const splited = value.split(' ');
    const arrayGabung = [];

    splited.forEach((value, index) => {
      const text = value[0].toUpperCase();
      const sisa = value.substr(1);
      const gabung = text + sisa;
      arrayGabung.push(gabung);
    });

    const result = arrayGabung.join(' ');

    return result;
  }

  return '';
}
