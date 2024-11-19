import './css/App.css';
import './css/index.css'
import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './Home';
import VoucherCheck from './voucherCheck';
import VoucherManagement from './voucherManagement';
import VoucherList from './voucherList';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element ={<Home/>}/>
        <Route path="/voucher-check" element ={<VoucherCheck/>}/>
        <Route path="/voucher-management" element ={<VoucherManagement/>}/>
        <Route path="/voucher-list" element ={<VoucherList/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
