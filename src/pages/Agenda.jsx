import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { supabase } from "../supabase/client";
import "./Agenda.css";

const HORARIOS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const formularioInicial = {
  patient_name: "",
  whatsapp: "",
  service: "",
  notes: "",
};

function Agenda() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [appointments, setAppointments] = useState([]);
  const [selectedHour, setSelectedHour] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(formularioInicial);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadAppointments() {
    setLoading(true);

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("appointment_date", selectedDate)
      .order("appointment_time", { ascending: true });

    if (error) {
      console.error("Erro ao carregar agenda:", error);
      setMessage("Não foi possível carregar a agenda.");
      setAppointments([]);
    } else {
      setAppointments(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadAppointments();
  }, [selectedDate]);

  function getAppointment(hour) {
    return appointments.find(
      (item) =>
        item.appointment_time === hour &&
        item.status !== "cancelado"
    );
  }

  function openNewAppointment(hour) {
    setSelectedHour(hour);
    setForm(formularioInicial);
    setMessage("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedHour("");
    setForm(formularioInicial);
    setMessage("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function createAppointment(event) {
    event.preventDefault();
    setMessage("Salvando agendamento...");

    const { data: occupied, error: checkError } = await supabase
      .from("appointments")
      .select("id")
      .eq("appointment_date", selectedDate)
      .eq("appointment_time", selectedHour)
      .in("status", ["pendente", "confirmado"])
      .limit(1);

    if (checkError) {
      console.error(checkError);
      setMessage("Erro ao verificar a disponibilidade.");
      return;
    }

    if (occupied && occupied.length > 0) {
      setMessage("Este horário acabou de ser ocupado.");
      await loadAppointments();
      return;
    }

    const { error } = await supabase.from("appointments").insert([
      {
        patient_name: form.patient_name,
        whatsapp: form.whatsapp,
        service: form.service,
        appointment_date: selectedDate,
        appointment_time: selectedHour,
        notes: form.notes,
        status: "pendente",
        confirmed: false,
      },
    ]);

    if (error) {
      console.error("Erro ao criar agendamento:", error);
      setMessage("Não foi possível salvar o agendamento.");
      return;
    }

    await loadAppointments();
    closeModal();
  }

  async function updateStatus(id, status) {
    const { error } = await supabase
      .from("appointments")
      .update({
        status,
        confirmed: status === "confirmado",
      })
      .eq("id", id);

    if (error) {
      console.error("Erro ao atualizar status:", error);
      setMessage("Não foi possível atualizar o agendamento.");
      return;
    }

    await loadAppointments();
  }

  function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }

  return (
    <AdminLayout
      title="Agenda"
      subtitle="Visualize e gerencie os horários da clínica"
    >
      <section className="agenda-toolbar">
        <div>
          <span>Data selecionada</span>
          <strong>{formatDate(selectedDate)}</strong>
        </div>

        <input
          type="date"
          value={selectedDate}
          onChange={(event) => {
            setSelectedDate(event.target.value);
            setMessage("");
          }}
        />
      </section>

      {message && <p className="agenda-message">{message}</p>}

      <section className="agenda-page-panel">
        <div className="agenda-page-header">
          <div>
            <h2>Horários do dia</h2>
            <p>
              Clique em um horário livre para cadastrar uma consulta manualmente.
            </p>
          </div>

          <div className="agenda-legend">
            <span className="legend-free">Livre</span>
            <span className="legend-pending">Pendente</span>
            <span className="legend-confirmed">Confirmado</span>
          </div>
        </div>

        {loading ? (
          <p className="agenda-empty">Carregando horários...</p>
        ) : (
          <div className="agenda-day-list">
            {HORARIOS.map((hour) => {
              const appointment = getAppointment(hour);

              return (
                <article
                  className={`agenda-day-slot ${
                    appointment ? "occupied" : "available"
                  }`}
                  key={hour}
                >
                  <div className="agenda-hour">{hour}</div>

                  {appointment ? (
                    <div className="agenda-appointment-content">
                      <div className="agenda-patient">
                        <h3>{appointment.patient_name}</h3>
                        <p>{appointment.service}</p>
                        <small>{appointment.whatsapp}</small>
                      </div>

                      <span
                        className={`agenda-status ${appointment.status}`}
                      >
                        {appointment.status}
                      </span>

                      <div className="agenda-actions">
                        <button
                          type="button"
                          onClick={() =>
                            updateStatus(appointment.id, "confirmado")
                          }
                        >
                          Confirmar
                        </button>

                        <button
                          type="button"
                          className="agenda-cancel"
                          onClick={() =>
                            updateStatus(appointment.id, "cancelado")
                          }
                        >
                          Cancelar
                        </button>

                        <a
                          href={`https://wa.me/55${appointment.whatsapp.replace(
                            /\D/g,
                            ""
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="agenda-free-button"
                      onClick={() => openNewAppointment(hour)}
                    >
                      Horário livre
                      <strong>Adicionar agendamento +</strong>
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {modalOpen && (
        <div className="agenda-modal-background">
          <form
            className="agenda-modal"
            onSubmit={createAppointment}
          >
            <div className="agenda-modal-header">
              <div>
                <span>Novo agendamento</span>
                <h2>
                  {formatDate(selectedDate)} às {selectedHour}
                </h2>
              </div>

              <button
                type="button"
                className="agenda-modal-close"
                onClick={closeModal}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            <label>
              Nome do paciente
              <input
                type="text"
                name="patient_name"
                value={form.patient_name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              WhatsApp
              <input
                type="tel"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="11999999999"
                required
              />
            </label>

            <label>
              Serviço
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                <option value="Emagrecimento">Emagrecimento</option>
                <option value="Reeducação Alimentar">
                  Reeducação Alimentar
                </option>
                <option value="Composição Corporal">
                  Composição Corporal
                </option>
                <option value="Consulta Online">Consulta Online</option>
              </select>
            </label>

            <label>
              Observações
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Informações adicionais"
              />
            </label>

            {message && <p className="agenda-modal-message">{message}</p>}

            <div className="agenda-modal-actions">
              <button type="button" onClick={closeModal}>
                Voltar
              </button>

              <button type="submit">
                Salvar agendamento
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}

export default Agenda;