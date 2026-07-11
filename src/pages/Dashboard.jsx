import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { supabase } from "../supabase/client";
import "./Dashboard.css";

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true });

      if (error) {
        console.error("Erro ao carregar agendamentos:", error);
        setLoading(false);
        return;
      }

      setAppointments(data || []);
      setLoading(false);
    }

    loadDashboard();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const todayAppointments = appointments.filter(
    (item) => item.appointment_date === today
  );

  const pending = appointments.filter(
    (item) => item.status === "pendente"
  ).length;

  const confirmed = appointments.filter(
    (item) => item.status === "confirmado"
  ).length;

  const canceled = appointments.filter(
    (item) => item.status === "cancelado"
  ).length;

  const upcomingAppointments = appointments
    .filter(
      (item) =>
        item.appointment_date >= today &&
        item.status !== "cancelado"
    )
    .slice(0, 5);

  function formatDate(date) {
    if (!date) return "";

    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }

  return (
    <AdminLayout
      title="Visão geral"
      subtitle="Acompanhe os principais dados e próximos atendimentos"
    >
      <section className="overview-stats">
        <article className="overview-card">
          <span>Consultas hoje</span>
          <strong>{todayAppointments.length}</strong>
          <p>Agendamentos para o dia atual</p>
        </article>

        <article className="overview-card">
          <span>Pendentes</span>
          <strong>{pending}</strong>
          <p>Aguardando confirmação</p>
        </article>

        <article className="overview-card">
          <span>Confirmadas</span>
          <strong>{confirmed}</strong>
          <p>Consultas confirmadas</p>
        </article>

        <article className="overview-card">
          <span>Canceladas</span>
          <strong>{canceled}</strong>
          <p>Agendamentos cancelados</p>
        </article>
      </section>

      <section className="overview-panel">
        <div className="overview-panel-header">
          <div>
            <h2>Próximas consultas</h2>
            <p>Os próximos atendimentos registrados no sistema.</p>
          </div>
        </div>

        {loading ? (
          <p className="overview-empty">Carregando agendamentos...</p>
        ) : upcomingAppointments.length === 0 ? (
          <p className="overview-empty">
            Nenhuma consulta futura encontrada.
          </p>
        ) : (
          <div className="overview-list">
            {upcomingAppointments.map((item) => (
              <article className="overview-appointment" key={item.id}>
                <div>
                  <h3>{item.patient_name}</h3>
                  <p>{item.service}</p>
                </div>

                <div className="overview-date">
                  <strong>{formatDate(item.appointment_date)}</strong>
                  <span>{item.appointment_time}</span>
                </div>

                <span className={`overview-status ${item.status}`}>
                  {item.status}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminLayout>
  );
}

export default Dashboard;