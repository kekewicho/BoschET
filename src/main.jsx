import ReactDOM from 'react-dom/client';
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import { OT } from "./module/OT/OT";

const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<OT />} />
          <Route path="/ordenes" element={<OT />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
};



ReactDOM.createRoot(document.getElementById('root')).render(<App />);
