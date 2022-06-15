import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cekAngka from '../helpers/cekNumber';
import cekName from '../helpers/cekNameCapitalize';
import changeColor from '../helpers/changeStatusColor';
import filterData from '../helpers/filterDataStatistik';
export default function DaftarPasien(props) {
  // default value dari state
  const defaultData = {
    nama: '',
    umur: '',
    kota: '',
    status: '',
  };

  // State
  const [form, setForm] = useState(defaultData);
  const [dataPasien, setDataPasien] = useState([]);
  const [isValidUmur, setIsValidUmur] = useState(true);
  const [isButtonActive, setButtonActive] = useState(false);
  const [sortMethod, setSortMethod] = useState({
    nama: '',
    umur: '',
  });
  const [isWarning, setIsWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [city, setCity] = useState([]);
  const [isLoadingCity, setIsLoadingCity] = useState(true);
  const [status, setStatus] = useState([]);
  const [isLoadingStatus, setLoadingStatus] = useState(true);
  const [region, setRegion] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [loadingRegion, setLoadingRegion] = useState(true);
  // digunakan untuk mengecek apakah ada perubahan di state form,
  // kalau ada perubahan maka button akan disable atau enable
  useEffect(() => {
    if (form.nama && form.kota && form.status) {
      setButtonActive(false);
    } else {
      setButtonActive(true);
    }
  }, [form]);

  // get Status API
  useEffect(() => {
    const getStatus = async () => {
      try {
        setLoadingStatus(true);
        const resp = await axios.get('https://private-737d1c-sekolahfe.apiary-mock.com/patient-status-list');
        setStatus(resp.data);
        setLoadingStatus(false);
      } catch (error) {
        setLoadingStatus(false);
        console.log(error);
      }
    };
    getStatus();
  }, []);

  //get List City API
  useEffect(() => {
    async function getListCity() {
      const url = 'https://private-737d1c-sekolahfe.apiary-mock.com/city-list';
      await axios
        .get(url)
        .then((response) => {
          const listCity = response.data;
          setCity(listCity);
        })
        .catch((error) => {
          setIsWarning(true);
        })
        .finally(() => {
          setIsLoadingCity(false);
        });
    }
    getListCity();

    async function getRegion() {
      const url = 'https://corona.lmao.ninja/v2/continents';
      await axios
        .get(url)
        .then((response) => {
          const list = response.data;
          setRegion(list);
        })
        .catch((error) => {
          setIsWarning(true);
        })
        .finally(() => {
          setLoadingRegion(false);
        });
    }
    getRegion();

    // async function getPasienListAxios() {
    //   const url = 'https://private-737d1c-sekolahfe.apiary-mock.com/patient-list';
    //   await axios
    //     .get(url)
    //     .then((response) => {
    //       const list = response.data;
    //       // set state 'setDataPasien'
    //       setDataPasien(list);
    //     })
    //     .catch((error) => {
    //       setIsWarning(true);
    //     })
    //     .finally(() => {
    //       setIsLoading(false);
    //     });
    // }
    // getPasienListAxios();

    // getpasien dengan fetch
    async function getPasienList() {
      const url = 'https://private-737d1c-sekolahfe.apiary-mock.com/patient-list';
      await fetch(url)
        .then((response) => {
          if (response.ok === true) {
            return response.json();
          } else {
            setIsWarning(true);
          }
        })
        .then((responseJson) => {
          setDataPasien(responseJson);
        })
        .finally(() => {
          setIsLoading(false);
        });

      // const json = await response.json();
      // if (response.ok === true) {
      //   setDataPasien(json);
      // } else {
      //   // console.log('warning');
      //   // setIsWarning(true);
      // }
    }
    getPasienList();
  }, []); // untuk inisialisasi pertama dan dipanggil cuma 1x gunakan empty []

  // untuk mengubah form
  const setFormData = (e, param) => {
    const { value } = e.target;

    // kalau input formnya adalah umur, maka jalakan function untuk mengecek validasi number
    if (param === 'umur') {
      setIsValidUmur(cekAngka(value));
    }
    // ganti state form
    setForm({
      ...form,
      [param]: value,
    });
  };

  // untuk menambah data ke list
  const pushData = () => {
    setDataPasien((prevState) => {
      return [...prevState, form];
    });

    setForm(() => defaultData);
  };

  // untuk menghapus data dari list
  const deleteData = (index) => {
    const newField = [...dataPasien];
    newField.splice(index, 1);

    setDataPasien(newField);
  };

  // untuk menampilkan isi dari pilihan status
  // const arrayOption = ['Positif', 'Negatif', 'Belum Diketahui'];
  const statusOption = status.map((value, index) => (
    <option key={`list-status-${index}`} value={value}>
      {value}
    </option>
  ));

  // untuk menampilkan isi dari pilihan kota
  // const arrayOptionKota = ['Jakarta Pusat', 'Jakarta Barat', 'Jakarta Timur', 'Jakarta Selatan', 'Jakarta Utara'];
  const statusOptionKota = city.map((value, index) => (
    <option key={`list-kota-${index}`} value={value}>
      {value}
    </option>
  ));

  // untuk mengubah nama
  const ubahNama = (e) => {
    const text = cekName(e);
    // set state form baru
    setForm({
      ...form,
      nama: text,
    });
  };

  // sorting data
  const sortingData = (param) => {
    // const sortBy = sortMethod[param] === '' || sortMethod[param] === 'asc' ? 'desc' : 'asc';
    let sortBy;
    // pemanggilan objek bisa dengan dot notation atau [], [] digunakan kalau kita punya dinamic property name
    if (sortMethod[param] === '' || sortMethod[param] === 'asc') {
      sortBy = 'desc';
    } else {
      sortBy = 'asc';
    }

    // jalankan javascript function sort ascending / descending
    const sorting = dataPasien.sort((firstEl, secondEl) => {
      if (sortBy === 'desc') {
        // menentukan state mana yg aktif
        let obj;
        if (param === 'nama') {
          obj = {
            nama: 'desc',
            umur: '',
          };
        } else {
          obj = {
            umur: 'desc',
            nama: '',
          };
        }
        // set sort method
        setSortMethod({
          ...sortMethod,
          ...obj,
        });

        if (firstEl[param] < secondEl[param]) {
          return -1;
        } else {
          return 1;
        }
      } else {
        setSortMethod({
          ...sortMethod,
          [param]: 'asc',
        });

        if (secondEl[param] < firstEl[param]) {
          return -1;
        } else {
          return 1;
        }
      }
    });

    setDataPasien([...sorting]);
  };

  const selectRegion = (e) => {
    const { value } = e.target;
    const filtered = region.filter((val) => val.continent === value)[0];
    setSelectedData(filtered);
    return filtered;
  };

  return (
    <>
      <div className='container'>
        <div className='columns is-multiline'>
          <div className='column is-full'>
            <div className='box'>
              <div className='columns'>
                <div className='column is-3'>
                  <div className='field'>
                    <div className='control'>
                      <div className={isLoadingCity === false ? 'select is-primary is-fullwidth' : 'select is-fullwidth is-loading'}>
                        <select id='status' onChange={(e) => selectRegion(e)} defaultValue={'default'}>
                          <option value='default' disabled>
                            Region
                          </option>
                          {region.map((value, index) => (
                            <option key={`region-${index}`} value={value.continent}>
                              {value.continent}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {loadingRegion === false && selectedData !== null && (
                <nav className='level'>
                  <div className='level-item has-text-centered'>
                    <div>
                      <p className='heading'>Jumlah Kasus</p>
                      <p className='title'>{selectedData.cases}</p>
                    </div>
                  </div>
                  <div className='level-item has-text-centered'>
                    <div>
                      <p className='heading'>Positif</p>
                      <p className='title'>{selectedData.active}</p>
                    </div>
                  </div>
                  <div className='level-item has-text-centered'>
                    <div>
                      <p className='heading'>Meninggal</p>
                      <p className='title'>{selectedData.deaths}</p>
                    </div>
                  </div>
                  <div className='level-item has-text-centered'>
                    <div>
                      <p className='heading'>Sembuh</p>
                      <p className='title'>{selectedData.recovered}</p>
                    </div>
                  </div>
                  <div className='level-item has-text-centered'>
                    <div>
                      <p className='heading'>Kasus Hari Ini</p>
                      <p className='title'>{selectedData.todayCases}</p>
                    </div>
                  </div>
                  <div className='level-item has-text-centered'>
                    <div>
                      <p className='heading'>Meninggal Hari Ini</p>
                      <p className='title'>{selectedData.todayDeaths}</p>
                    </div>
                  </div>
                </nav>
              )}
            </div>
          </div>
          <div className='column is-full'>
            <div className='box'>
              <div className='box form'>
                <div className='columns is-multiline'>
                  <div className='column is-one-fifth'>
                    <div className='field'>
                      <div className='control'>
                        <input value={form.nama} onChange={(e) => setFormData(e, 'nama')} onBlur={(e) => ubahNama(e)} className='input is-primary' type='text' placeholder='Nama Pasien' id='nama' />
                      </div>
                    </div>
                  </div>
                  <div className='column is-one-fifth'>
                    <div className='field'>
                      <div className='control'>
                        <input value={form.umur} onChange={(e) => setFormData(e, 'umur')} className={isValidUmur ? 'input is-primary' : 'input is-danger'} type='text' placeholder='Umur' id='umur' />
                      </div>
                    </div>
                  </div>
                  <div className='column is-one-fifth is-medium'>
                    <div className='field'>
                      <div className='control'>
                        <div className={isLoadingCity === false ? 'select is-primary is-fullwidth' : 'select is-fullwidth is-loading'}>
                          <select id='status' onChange={(e) => setFormData(e, 'kota')} defaultValue={'default'}>
                            <option value='default' disabled>
                              Kota
                            </option>
                            {statusOptionKota}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='column is-one-fifth is-medium'>
                    <div className='field'>
                      <div className='control'>
                        <div className={isLoadingStatus === false ? 'select is-primary is-fullwidth' : 'select is-fullwidth is-loading'}>
                          <select id='status' onChange={(e) => setFormData(e, 'status')} defaultValue={'default'}>
                            <option value='default' disabled>
                              Status
                            </option>
                            {statusOption}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='column is-one-fifth'>
                    <div className='field'>
                      <div className='control'>
                        <button onClick={pushData} disabled={isButtonActive || !isValidUmur} className={isButtonActive || !isValidUmur ? 'button is-fullwidth' : 'button is-primary is-fullwidth'}>
                          Tambah Pasien
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {isWarning && <div className='notification is-danger'>Gagal Memuat API!</div>}

              <nav className='level'>
                <div className='level-item has-text-centered'>
                  <div>
                    <p className='heading'>Pasien</p>
                    <p className='title'>{dataPasien.length}</p>
                  </div>
                </div>
                <div className='level-item has-text-centered'>
                  <div>
                    <p className='heading'>Positif</p>
                    <p className='title'>{filterData(dataPasien, 'Positif')}</p>
                  </div>
                </div>
                <div className='level-item has-text-centered'>
                  <div>
                    <p className='heading'>Negatif</p>
                    <p className='title'>{filterData(dataPasien, 'Negatif')}</p>
                  </div>
                </div>
                <div className='level-item has-text-centered'>
                  <div>
                    <p className='heading'>Belum Diketahui</p>
                    <p className='title'>{filterData(dataPasien, 'Belum Diketahui')}</p>
                  </div>
                </div>
              </nav>

              <table className='table is-fullwidth is-hoverable'>
                <thead>
                  <tr>
                    <th width='8%'>#</th>
                    <th width='25%'>
                      <span className='has-text-primary is-clickable' onClick={() => sortingData('nama')}>
                        Pasien
                        {sortMethod.nama === 'asc' && (
                          <span className='icon has-text-primary'>
                            <i className=' fas fa-sort-down'></i>
                          </span>
                        )}
                        {sortMethod.nama === 'desc' && (
                          <span className='icon has-text-primary'>
                            <i className=' fas fa-sort-up'></i>
                          </span>
                        )}
                      </span>
                    </th>
                    <th width='15%'>
                      <span className='has-text-primary is-clickable' onClick={() => sortingData('umur')}>
                        Umur
                        {sortMethod.umur === 'asc' && (
                          <span className='icon has-text-primary'>
                            <i className=' fas fa-sort-down'></i>
                          </span>
                        )}
                        {sortMethod.umur === 'desc' && (
                          <span className='icon has-text-primary'>
                            <i className=' fas fa-sort-up'></i>
                          </span>
                        )}
                      </span>
                    </th>
                    <th width='22%'>Kota</th>
                    <th width='20%'>Status</th>
                    <th width='10%'></th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td className='has-text-centered' colSpan='6'>
                        <span className='icon'>
                          <i className='fas fa-spinner fa-pulse'></i>
                        </span>
                      </td>
                    </tr>
                  ) : (
                    dataPasien.map((value, index) => (
                      <tr key={`list-nama-${index}`}>
                        <td>{index + 1}</td>
                        <td>{value.nama}</td>
                        <td>{value.umur}</td>
                        <td>{value.kota}</td>
                        <td className={changeColor(value.status)}>{value.status}</td>
                        <td>
                          <span className='delete is-medium' onClick={() => deleteData(index)}></span>
                        </td>
                      </tr>
                    ))
                  )}

                  {isLoading === false && dataPasien.length === 0 && (
                    <tr>
                      <td colSpan='6' className='has-text-centered'>
                        Tidak Ada Data!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// TUGAS
// 1. ubah status jadi dropdown
// 2. geser tombol submit sejajar dengan status
// 3. tambahkan kolom pada table yg isinya action 'delete'
// 4. pilih kota jadi dropdown khusus jakarta
// 5. validasi nama huruf besar di awal (capitalize)
// 6. sorting umur
// 7. ascending dan descending
// 8. buat fungsi thousand separator angka
// 9. saat pilih region maka munculkan dropdown baru berisi negara2 yang ada di region tersebut
