export default function changeStatusColor(value) {
  if (value === 'Positif') {
    return 'has-text-danger';
  } else if (value === 'Negatif') {
    return 'has-text-success';
  } else {
    return 'has-text-grey';
  }
}
