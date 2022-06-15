import React from 'react';
// import ClassKomponen from './ClassKomponen';
import Header from './Header';
import DaftarPasien from './DaftarPasien';
import Footer from './Footer';

function Layout() {
  return (
    <>
      <Header></Header>
      <DaftarPasien></DaftarPasien>
      <Footer></Footer>
    </>
  );
}

export default Layout;
