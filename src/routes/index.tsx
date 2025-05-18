import { CommonLayout } from "@/components/layout/CommonLayout";
import { MainLayout } from "@/components/layout/MainLayout";
import PublicLayout from "@/layouts/PublicLayout";
import Addresses from "@/pages/Addresses";
import Anonymous from "@/pages/Anonymous";
import Dashboard from "@/pages/Dashboard";
import FAQ from "@/pages/FAQ";
import FactsSubfacts from "@/pages/FactsSubfacts";
import ForgotPassword from "@/pages/ForgotPassword";
import Geop from "@/pages/Geop";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Municipalities from "@/pages/Municipalities";
import NewReport from "@/pages/NewReport";
import Notifications from "@/pages/Notifications";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import RenewPassword from "@/pages/RenewPassword";
import Reports from "@/pages/Reports";
import ReportsAnalytics from "@/pages/ReportsAnalytics";
import SuccessAnonymous from "@/pages/SuccessAnonymous";
import SuccessReport from "@/pages/SuccessReport";
import Users from "@/pages/Users";
import MyReports from "@/pages/common/MyReports";
import CommonNewReport from "@/pages/common/NewReport";
import ProfileCommon from "@/pages/common/ProfileCommon";
import Settings from "@/pages/common/Settings";
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Oops!</h1>
        <p className="text-gray-600">Página não encontrada</p>
      </div>
    </div>
  );
};

export const createRouter = () =>
  createBrowserRouter([
    {
      element: <PublicLayout />, // ✅ aplica tema claro
      children: [
        { path: "/", element: <Index /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/forgot-password", element: <ForgotPassword /> },
        { path: "/renew-password", element: <RenewPassword /> },
        { path: "/anonymous", element: <Anonymous /> },
        { path: "/anonymous/success", element: <SuccessAnonymous /> },
        { path: "/faq", element: <FAQ /> },
      ],
    },

    // Rota protegida para Operadores e Administradores
    {
      path: "/dashboard",
      element: <PrivateRoute allowedRoles={["operador", "adm"]} />,
      children: [
        {
          path: "",
          element: (
            <MainLayout>
              <Dashboard />
            </MainLayout>
          ),
        },
        {
          path: "nova-denuncia",
          element: (
            <MainLayout>
              <NewReport />
            </MainLayout>
          ),
        },
        {
          path: "nova-denuncia/success",
          element: (
            <MainLayout>
              <SuccessReport />
            </MainLayout>
          ),
        },
        {
          path: "denuncias",
          element: (
            <MainLayout>
              <Reports />
            </MainLayout>
          ),
        },
        {
          path: "relatorios",
          element: (
            <MainLayout>
              <ReportsAnalytics />
            </MainLayout>
          ),
        },
        {
          path: "perfil",
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          ),
        },
        {
          path: "configuracoes",
          element: (
            <MainLayout>
              <Settings />
            </MainLayout>
          ),
        },
        {
          path: "notificacoes",
          element: (
            <MainLayout>
              <Notifications />
            </MainLayout>
          ),
        },
      ],
    },
    // Rota protegida para Administradores
    {
      path: "/dashboard",
      element: <PrivateRoute allowedRoles={["adm"]} />,
      children: [
        {
          path: "usuarios",
          element: (
            <MainLayout>
              <Users />
            </MainLayout>
          ),
        },
        {
          path: "logradouros",
          element: (
            <MainLayout>
              <Addresses />
            </MainLayout>
          ),
        },
        {
          path: "geop",
          element: (
            <MainLayout>
              <Geop />
            </MainLayout>
          ),
        },
        {
          path: "municipios",
          element: (
            <MainLayout>
              <Municipalities />
            </MainLayout>
          ),
        },
        {
          path: "fatos-subfatos",
          element: (
            <MainLayout>
              <FactsSubfacts />
            </MainLayout>
          ),
        },
      ],
    },

    // Rota protegida para Usuários Comuns
    {
      path: "/comum",
      element: <PrivateRoute allowedRoles={["comum"]} />,
      children: [
        {
          path: "",
          element: (
            <CommonLayout>
              <MyReports />
            </CommonLayout>
          ),
        },
        {
          path: "nova-denuncia",
          element: (
            <CommonLayout>
              <CommonNewReport />
            </CommonLayout>
          ),
        },
        {
          path: "nova-denuncia/success",
          element: (
            <CommonLayout>
              <SuccessReport />
            </CommonLayout>
          ),
        },
        {
          path: "minhas-denuncias",
          element: (
            <CommonLayout>
              <MyReports />
            </CommonLayout>
          ),
        },
        {
          path: "perfil",
          element: (
            <CommonLayout>
              <ProfileCommon />
            </CommonLayout>
          ),
        },
        {
          path: "configuracoes",
          element: (
            <CommonLayout>
              <Settings />
            </CommonLayout>
          ),
        },
        {
          path: "notificacoes",
          element: (
            <CommonLayout>
              <Notifications />
            </CommonLayout>
          ),
        },
      ],
    },

    { path: "*", element: <ErrorPage /> },
  ]);
