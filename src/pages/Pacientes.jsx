import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { supabase } from "../supabase/client";
import "./Pacientes.css";

const initialForm = {
  name: "",
  whatsapp: "",
  email: "",
  birth_date: "",
  cpf: "",
  notes: "",
  active: true,
};

function Pacientes() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadData() {
    setLoading(true);
    setMessage("");

    const [patientsResult, appointmentsResult] = await Promise.all([
      supabase
        .from("patients")
        .select("*")
        .order("name", { ascending: true }),

      supabase
        .from("appointments")
        .select("*")
        .order("appointment_date", { ascending: false })
        .order("appointment_time", { ascending: false }),
    ]);

    if (patientsResult.error) {
      console.error("Erro ao carregar pacientes:", patientsResult.error);
      setMessage("Não foi possível carregar os pacientes.");
      setLoading(false);
      return;
    }

    if (appointmentsResult.error) {
      console.error(
        "Erro ao carregar agendamentos:",
        appointmentsResult.error
      );
    }

    setPatients(patientsResult.data || []);
    setAppointments(appointmentsResult.data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const patientsWithHistory = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];

    return patients.map((patient) => {
      const patientAppointments = appointments.filter(
        (appointment) => appointment.patient_id === patient.id
      );

      const futureAppointments = patientAppointments
        .filter(
          (appointment) =>
            appointment.appointment_date >= today &&
            appointment.status !== "cancelado"
        )
        .sort((a, b) => {
          const dateComparison = a.appointment_date.localeCompare(
            b.appointment_date
          );

          if (dateComparison !== 0) return dateComparison;

          return a.appointment_time.localeCompare(b.appointment_time);
        });

      return {
        ...patient,
        appointments: patientAppointments,
        totalAppointments: patientAppointments.length,
        confirmedAppointments: patientAppointments.filter(
          (item) => item.status === "confirmado"
        ).length,
        canceledAppointments: patientAppointments.filter(
          (item) => item.status === "cancelado"
        ).length,
        nextAppointment: futureAppointments[0] || null,
      };
    });
  }, [patients, appointments]);

  const filteredPatients = patientsWithHistory.filter((patient) => {
    const term = search.trim().toLowerCase();

    if (!term) return true;

    return (
      patient.name?.toLowerCase().includes(term) ||
      patient.whatsapp?.includes(term) ||
      patient.email?.toLowerCase().includes(term) ||
      patient.cpf?.includes(term)
    );
  });

  function openNewPatient() {
    setEditingPatient(null);
    setForm(initialForm);
    setMessage("");
    setModalOpen(true);
  }

  function openEditPatient(patient) {
    setEditingPatient(patient);

    setForm({
      name: patient.name || "",
      whatsapp: patient.whatsapp || "",
      email: patient.email || "",
      birth_date: patient.birth_date || "",
      cpf: patient.cpf || "",
      notes: patient.notes || "",
      active: patient.active ?? true,
    });

    setMessage("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingPatient(null);
    setForm(initialForm);
    setMessage("");
  }

  function openHistory(patient) {
    setSelectedPatient(patient);
    setHistoryOpen(true);
  }

  function closeHistory() {
    setHistoryOpen(false);
    setSelectedPatient(null);
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function savePatient(event) {
    event.preventDefault();
    setMessage("Salvando paciente...");

    const normalizedWhatsapp = form.whatsapp.replace(/\D/g, "");

    if (!form.name.trim()) {
      setMessage("Informe o nome do paciente.");
      return;
    }

    if (!normalizedWhatsapp) {
      setMessage("Informe um WhatsApp válido.");
      return;
    }

    const patientData = {
      name: form.name.trim(),
      whatsapp: normalizedWhatsapp,
      email: form.email.trim() || null,
      birth_date: form.birth_date || null,
      cpf: form.cpf.replace(/\D/g, "") || null,
      notes: form.notes.trim() || null,
      active: form.active,
    };

    let result;

    if (editingPatient) {
      result = await supabase
        .from("patients")
        .update(patientData)
        .eq("id", editingPatient.id);
    } else {
      result = await supabase.from("patients").insert(patientData);
    }

    if (result.error) {
      console.error("Erro ao salvar paciente:", result.error);

      if (result.error.code === "23505") {
        setMessage("Já existe um paciente com esse WhatsApp.");
      } else {
        setMessage("Não foi possível salvar o paciente.");
      }

      return;
    }

    closeModal();
    await loadData();
  }

  async function togglePatient(patient) {
    const { error } = await supabase
      .from("patients")
      .update({ active: !patient.active })
      .eq("id", patient.id);

    if (error) {
      console.error(error);
      setMessage("Não foi possível alterar o paciente.");
      return;
    }

    await loadData();
  }

  function formatDate(dateString) {
    if (!dateString) return "Não informado";

    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }

  return (
    <AdminLayout
      title="Pacientes"
      subtitle="Cadastre pacientes e acompanhe o histórico de consultas"
    >
      <section className="patients-summary">
        <article>
          <span>Total de pacientes</span>
          <strong>{patientsWithHistory.length}</strong>
          <p>Pacientes cadastrados</p>
        </article>

        <article>
          <span>Pacientes ativos</span>
          <strong>
            {patientsWithHistory.filter((patient) => patient.active).length}
          </strong>
          <p>Cadastros ativos no sistema</p>
        </article>

        <article>
          <span>Com próxima consulta</span>
          <strong>
            {
              patientsWithHistory.filter(
                (patient) => patient.nextAppointment
              ).length
            }
          </strong>
          <p>Pacientes com retorno marcado</p>
        </article>
      </section>

      <section className="patients-panel">
        <div className="patients-panel-header">
          <div>
            <h2>Lista de pacientes</h2>
            <p>Pesquise, edite e consulte o histórico.</p>
          </div>

          <div className="patients-header-actions">
            <input
              type="search"
              placeholder="Nome, WhatsApp, e-mail ou CPF..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <button type="button" onClick={openNewPatient}>
              Novo paciente +
            </button>
          </div>
        </div>

        {message && <p className="patients-message">{message}</p>}

        {loading ? (
          <p className="patients-empty">Carregando pacientes...</p>
        ) : filteredPatients.length === 0 ? (
          <p className="patients-empty">Nenhum paciente encontrado.</p>
        ) : (
          <div className="patients-list">
            {filteredPatients.map((patient) => (
              <article
                className={`patient-card ${
                  patient.active ? "" : "patient-inactive"
                }`}
                key={patient.id}
              >
                <div className="patient-avatar">
                  {patient.name
                    ?.split(" ")
                    .slice(0, 2)
                    .map((name) => name.charAt(0))
                    .join("")
                    .toUpperCase()}
                </div>

                <div className="patient-main-info">
                  <h3>{patient.name}</h3>
                  <p>{patient.whatsapp}</p>
                  <span>{patient.email || "E-mail não informado"}</span>
                </div>

                <div className="patient-metric">
                  <span>Consultas</span>
                  <strong>{patient.totalAppointments}</strong>
                </div>

                <div className="patient-next">
                  <span>Próxima consulta</span>

                  {patient.nextAppointment ? (
                    <>
                      <strong>
                        {formatDate(
                          patient.nextAppointment.appointment_date
                        )}
                      </strong>
                      <small>
                        {patient.nextAppointment.appointment_time}
                      </small>
                    </>
                  ) : (
                    <strong>Não agendada</strong>
                  )}
                </div>

                <div className="patient-actions">
                  <button
                    type="button"
                    onClick={() => openHistory(patient)}
                  >
                    Histórico
                  </button>

                  <button
                    type="button"
                    className="patient-edit-button"
                    onClick={() => openEditPatient(patient)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="patient-toggle-button"
                    onClick={() => togglePatient(patient)}
                  >
                    {patient.active ? "Desativar" : "Ativar"}
                  </button>

                  <a
                    href={`https://wa.me/55${patient.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {modalOpen && (
        <div className="patient-modal-background">
          <form className="patient-form-modal" onSubmit={savePatient}>
            <div className="patient-modal-header">
              <div>
                <span>
                  {editingPatient ? "Editar paciente" : "Novo paciente"}
                </span>

                <h2>
                  {editingPatient
                    ? "Atualize o cadastro"
                    : "Cadastre um novo paciente"}
                </h2>
              </div>

              <button type="button" onClick={closeModal}>
                ×
              </button>
            </div>

            <label>
              Nome completo
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <div className="patient-form-columns">
              <label>
                WhatsApp
                <input
                  type="tel"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                E-mail
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="patient-form-columns">
              <label>
                Data de nascimento
                <input
                  type="date"
                  name="birth_date"
                  value={form.birth_date}
                  onChange={handleChange}
                />
              </label>

              <label>
                CPF
                <input
                  type="text"
                  name="cpf"
                  value={form.cpf}
                  onChange={handleChange}
                />
              </label>
            </div>

            <label>
              Observações
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
              />
            </label>

            <label className="patient-active-field">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />

              <span>Paciente ativo</span>
            </label>

            {message && (
              <p className="patient-form-message">{message}</p>
            )}

            <div className="patient-modal-actions">
              <button type="button" onClick={closeModal}>
                Cancelar
              </button>

              <button type="submit">
                {editingPatient ? "Salvar alterações" : "Cadastrar"}
              </button>
            </div>
          </form>
        </div>
      )}

      {historyOpen && selectedPatient && (
        <div className="patient-modal-background">
          <section className="patient-modal">
            <div className="patient-modal-header">
              <div>
                <span>Histórico do paciente</span>
                <h2>{selectedPatient.name}</h2>
                <p>{selectedPatient.whatsapp}</p>
              </div>

              <button type="button" onClick={closeHistory}>
                ×
              </button>
            </div>

            <div className="patient-modal-stats">
              <article>
                <span>Total</span>
                <strong>{selectedPatient.totalAppointments}</strong>
              </article>

              <article>
                <span>Confirmadas</span>
                <strong>
                  {selectedPatient.confirmedAppointments}
                </strong>
              </article>

              <article>
                <span>Canceladas</span>
                <strong>
                  {selectedPatient.canceledAppointments}
                </strong>
              </article>
            </div>

            <div className="patient-history">
              {selectedPatient.appointments.length === 0 ? (
                <p className="patients-empty">
                  Este paciente ainda não possui consultas.
                </p>
              ) : (
                selectedPatient.appointments.map((appointment) => (
                  <article key={appointment.id}>
                    <div>
                      <h3>{appointment.service}</h3>
                      <p>
                        {appointment.notes || "Sem observações"}
                      </p>
                    </div>

                    <div className="patient-history-date">
                      <strong>
                        {formatDate(appointment.appointment_date)}
                      </strong>
                      <span>{appointment.appointment_time}</span>
                    </div>

                    <span
                      className={`patient-status ${appointment.status}`}
                    >
                      {appointment.status}
                    </span>
                  </article>
                ))
              )}
            </div>

            <button
              type="button"
              className="patient-modal-close"
              onClick={closeHistory}
            >
              Fechar
            </button>
          </section>
        </div>
      )}
    </AdminLayout>
  );
}

export default Pacientes;