import { HashRouter, Routes, Route } from "react-router-dom";

import Header from "./components/header/Header";
import Hero from "./components/hero/Hero";
import About from "./components/about/About";
import Services from "./components/services/Services";
import Results from "./components/results/Results";
import Benefits from "./components/benefits/Benefits";
import Appointment from "./components/appointment/Appointment";
import Contact from "./components/contact/Contact";
import Footer from "./components/footer/Footer";

import Login from "./components/login/Login";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import Pacientes from "./pages/Pacientes";
import Servicos from "./pages/Servicos";
import Financeiro from "./pages/Financeiro";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import Perfil from "./pages/Perfil";

function Home() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Services />
      <Results />
      <Benefits />
      <Appointment />
      <Contact />
      <Footer />
    </>
  );
}

function PrivatePage({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <PrivatePage>
              <Dashboard />
            </PrivatePage>
          }
        />

        <Route
          path="/admin/agenda"
          element={
            <PrivatePage>
              <Agenda />
            </PrivatePage>
          }
        />

        <Route
          path="/admin/pacientes"
          element={
            <PrivatePage>
              <Pacientes />
            </PrivatePage>
          }
        />

        <Route
          path="/admin/servicos"
          element={
            <PrivatePage>
              <Servicos />
            </PrivatePage>
          }
        />

        <Route
          path="/admin/financeiro"
          element={
            <PrivatePage>
              <Financeiro />
            </PrivatePage>
          }
        />

        <Route
          path="/admin/relatorios"
          element={
            <PrivatePage>
              <Relatorios />
            </PrivatePage>
          }
        />

        <Route
          path="/admin/configuracoes"
          element={
            <PrivatePage>
              <Configuracoes />
            </PrivatePage>
          }
        />

        <Route
          path="/admin/perfil"
          element={
            <PrivatePage>
              <Perfil />
            </PrivatePage>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;