import { BrowserRouter, Route, Routes } from "react-router";
import { ToastContainer, type ToastContainerProps } from "react-toastify";
import { AuthProvider } from "../context/index";
import AppLayout from "../layout/AppLayout";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Transactions from "../pages/Transactions";
import TransactionsForm from "../pages/TransactionsForm";
import PrivateRoutes from "../routes/PrivateRoutes";

const AppRoutes = () => {
  const toastConfig: ToastContainerProps = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    theme: "colored",
  };
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoutes />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transacoes" element={<Transactions />} />
              <Route path="/transacao/nova" element={<TransactionsForm />} />
            </Route>
          </Route>

          <Route path="*" element={<h2>Página não encontrada😕</h2>} />
        </Routes>
        <ToastContainer {...toastConfig} />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
