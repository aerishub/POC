import Navbar from "./Navbar";
import React from "react";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }) {
  return (
    <React.Fragment>
      <Navbar />
      {children}
      <Toaster toastOptions={{ position: "bottom-center" }} />
    </React.Fragment>
  );
}
