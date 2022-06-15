function jumlahStatistik(data, status) {
  if (data.length) {
    const jumlah = data.filter((val) => {
      return val.status === status;
    });
    return jumlah.length;
  } else {
    return 0;
  }
}

export default jumlahStatistik;
