import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const horarios = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState("");
  const [form, setForm] = useState({
    patient_name: "",
    whatsapp: "",
    service: "",
    notes: "",
  });

  async function loadAppointments() {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_time", { ascending: true });

    if (!error) setAppointments(data);
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  const appointmentsToday = appointments.filter(
    (item) => item.appointment_date === selectedDate
  );

  const totalPending = appointments.filter((item) => item.status === "pendente").length;
  const totalConfirmed = appointments.filter((item) => item.status === "confirmado").length;
  const totalCanceled = appointments.filter((item) => item.status === "cancelado").length;

  async function updateStatus(id, status) {
    await supabase.from("appointments").update({ status }).eq("id", id);
    loadAppointments();
  }

  async function createManualAppointment(e) {
    e.preventDefault();

    await supabase.from("appointments").insert([
      {
        ...form,
        appointment_date: selectedDate,
        appointment_time: selectedHour,
        status: "pendente",
        confirmed: false,
      },
    ]);

    setModalOpen(false);
    setForm({
      patient_name: "",
      whatsapp: "",
      service: "",
      notes: "",
    });
    setSelectedHour("");
    loadAppointments();
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  function getAppointmentByHour(hour) {
    return appointmentsToday.find((item) => item.appointment_time === hour);
  }

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-icon">+</div>
          <div>
            <h2>Clínica Premium</h2>
            <span>Painel Administrativo</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a className="active">Agenda</a>
          <a>Pacientes</a>
          <a>Serviços</a>
          <a>Configurações</a>
        </nav>

        <button className="sidebar-logout" onClick={logout}>Sair</button>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-top">
          <div>
            <span>Agenda profissional</span>
            <h1>Agenda do dia</h1>
            <p>Visualize horários livres, pendentes, confirmados e cancelados.</p>
          </div>

          <input
            type="date"
            className="date-picker"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <span>No dia</span>
            <strong>{appointmentsToday.length}</strong>
            <p>Consultas</p>
          </div>

          <div className="stat-card">
            <span>Pendentes</span>
            <strong>{totalPending}</strong>
            <p>Aguardando confirmação</p>
          </div>

          <div className="stat-card">
            <span>Confirmadas</span>
            <strong>{totalConfirmed}</strong>
            <p>Consultas aprovadas</p>
          </div>

          <div className="stat-card">
            <span>Canceladas</span>
            <strong>{totalCanceled}</strong>
            <p>Consultas recusadas</p>
          </div>
        </div>

        <section className="agenda-panel">
          <div className="agenda-header">
            <h2>Horários de {selectedDate}</h2>
            <p>Clique em um horário livre para adicionar um agendamento manual.</p>
          </div>

          <div className="agenda-list">
            {horarios.map((hora) => {
              const agendamento = getAppointmentByHour(hora);

              return (
                <div
                  className={`agenda-slot ${agendamento ? "busy" : "free"}`}
                  key={hora}
                >
                  <div className="slot-hour">{hora}</div>

                  {agendamento ? (
                    <div className="slot-content">
                      <div>
                        <h3>{agendamento.patient_name}</h3>
                        <p>{agendamento.service}</p>
                        <small>{agendamento.whatsapp}</small>
                      </div>

                      <span className={`status ${agendamento.status}`}>
                        {agendamento.status}
                      </span>

                      <div className="slot-actions">
                        <button onClick={() => updateStatus(agendamento.id, "confirmado")}>
                          Confirmar
                        </button>

                        <button
                          className="cancel"
                          onClick={() => updateStatus(agendamento.id, "cancelado")}
                        >
                          Cancelar
                        </button>

                        <a
                          href={`https://wa.me/55${agendamento.whatsapp}`}
                          target="_blank"
                          className="whatsapp-btn"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="free-button"
                      onClick={() => {
                        setSelectedHour(hora);
                        setModalOpen(true);
                      }}
                    >
                      Horário livre +
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {modalOpen && (
        <div className="modal-bg">
          <form className="modal" onSubmit={createManualAppointment}>
            <h2>Novo agendamento</h2>
            <p>{selectedDate} às {selectedHour}</p>

            <input
              type="text"
              placeholder="Nome do paciente"
              value={form.patient_name}
              onChange={(e) => setForm({ ...form, patient_name: e.target.value })}
              required
            />

            <input
              type="tel"
              placeholder="WhatsApp"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              required
            />

            <select
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              required
            >
              <option value="">Escolha o serviço</option>
              <option value="Emagrecimento">Emagrecimento</option>
              <option value="Reeducação Alimentar">Reeducação Alimentar</option>
              <option value="Composição Corporal">Composição Corporal</option>
              <option value="Consulta Online">Consulta Online</option>
            </select>

            <textarea
              placeholder="Observações"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />

            <button type="submit">Salvar agendamento</button>
            <button type="button" className="close-modal" onClick={() => setModalOpen(false)}>
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Dashboard;