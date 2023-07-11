import React, { useState } from "react";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";

import SignupComponent from "./components/login/SignupComponent";
import Header from "./components/common/Header";
import PdfViewPage from "./pages/PdfViewPage";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// toast.configure();

function App() {
  // const [modalIsOpen, setModalIsOpen] = useState(false);

  // const modalOpenHandler = () => {
  //   setModalIsOpen(true);
  // };
  // const modalCloseHandler = () => {
  //   setModalIsOpen(false);
  // };

  return (
    <RecoilRoot>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route exact path="/" element={<LoginPage />} />
            <Route exact path="/dashboard" element={<DashboardPage />} />
            <Route exact path="/pdfview" element={<PdfViewPage />} />
            <Route exact path="/signup" element={<SignupComponent />} />
          </Routes>
        </div>
        <ToastContainer style={{ position: "fixed", zIndex: "1000" }} />
      </Router>
    </RecoilRoot>
  );
}

export default App;
