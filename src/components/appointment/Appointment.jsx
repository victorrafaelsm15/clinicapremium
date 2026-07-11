import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabase/client";
import "./Appointment.css";

const DEFAULT_SETTINGS = {
  opening_time: "08:00",
  closing_time: "17:00",
  lunch_start: "12:00",
  lunch_end: "14:00",
  appointment_interval: 60,
  working_days: ["segunda", "terca", "quarta", "quinta", "sexta"],
};

const WEEK_DAYS = [
  "domingo",
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
];

const INITIAL_FORM = {
  patient_name: "",
  whatsapp: "",
  service: "",
  appointment_date: "",
  appointment_time: "",
  notes: "",
};

function timeToMinutes(time) {
  if (!time) return 0;

  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes) {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");

  return `${hours}:${minutes}`;
}

function Appointment() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [services, setServices] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [occupiedTimes, setOccupiedTimes] = useState([]);
  const [status, setStatus] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!form.appointment_date) {
      setOccupiedTimes([]);
      return;
    }

    loadOccupiedTimes(form.appointment_date);
  }, [form.appointment_date]);

  async function loadInitialData() {
    setLoadingData(true);

    const [servicesResult, settingsResult] = await Promise.all([
      supabase
        .from("services")
        .select("id, name, duration_minutes")
        .eq("active", true)
        .order("name", { ascending: true }),

      supabase
        .from("clinic_settings")
        .select("*")
        .limit(1)
        .maybeSingle(),
    ]);

    if (servicesResult.error) {
      console.error("Erro ao carregar serviços:", servicesResult.error);
    } else {
      setServices(servicesResult.data || []);
    }

    if (settingsResult.error) {
      console.error("Erro ao carregar configurações:", settingsResult.error);
    } else if (settingsResult.data) {
      setSettings({
        ...DEFAULT_SETTINGS,
        ...settingsResult.data,
      });
    }

    setLoadingData(false);
  }

  async function loadOccupiedTimes(date) {
    const { data, error } = await supabase
      .from("appointments")
      .select("appointment_time")
      .eq("appointment_date", date)
      .in("status", ["pendente", "confirmado"]);

    if (error) {
      console.error("Erro ao carregar horários:", error);
      setStatus("Não foi possível consultar os horários.");
      return;
    }

    setOccupiedTimes(
      (data || []).map((item) => item.appointment_time)
    );
  }

  const availableTimes = useMemo(() => {
    const start = timeToMinutes(settings.opening_time);
    const end = timeToMinutes(settings.closing_time);
    const lunchStart = timeToMinutes(settings.lunch_start);
    const lunchEnd = timeToMinutes(settings.lunch_end);
    const interval = Number(settings.appointment_interval || 60);

    const times = [];

    for (let current = start; current < end; current += interval) {
      const isLunchTime =
        settings.lunch_start &&
        settings.lunch_end &&
        current >= lunchStart &&
        current < lunchEnd;

      if (!isLunchTime) {
        times.push(minutesToTime(current));
      }
    }

    return times;
  }, [settings]);

  const selectedDayIsValid = useMemo(() => {
    if (!form.appointment_date) return true;

    const date = new Date(`${form.appointment_date}T12:00:00`);
    const dayName = WEEK_DAYS[date.getDay()];

    return settings.working_days.includes(dayName);
  }, [form.appointment_date, settings.working_days]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "appointment_date"
        ? { appointment_time: "" }
        : {}),
    }));

    setStatus("");
  }

  function selectTime(time) {
    if (occupiedTimes.includes(time)) return;

    setForm((current) => ({
      ...current,
      appointment_time: time,
    }));

    setStatus("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedDayIsValid) {
      setStatus("A clínica não atende no dia selecionado.");
      return;
    }

    if (!form.appointment_time) {
      setStatus("Escolha um horário disponível.");
      return;
    }

    setSending(true);
    setStatus("Enviando agendamento...");

    const { error } = await supabase.from("appointments").insert([
      {
        patient_name: form.patient_name.trim(),
        whatsapp: form.whatsapp.replace(/\D/g, ""),
        service: form.service,
        appointment_date: form.appointment_date,
        appointment_time: form.appointment_time,
        notes: form.notes.trim() || null,
        status: "pendente",
        confirmed: false,
      },
    ]);

    if (error) {
      console.error("Erro completo do Supabase:", error);

      if (error.code === "23505") {
        setStatus(
          "Este horário acabou de ser ocupado. Escolha outro."
        );

        await loadOccupiedTimes(form.appointment_date);
      } else {
        setStatus(`Erro ao enviar: ${error.message}`);
      }

      setSending(false);
      return;
    }

    setStatus("Agendamento solicitado com sucesso!");

    setOccupiedTimes((current) => [
      ...current,
      form.appointment_time,
    ]);

    setForm(INITIAL_FORM);
    setSending(false);
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <section className="appointment" id="agendamento">
      <div className="appointment-content">
        <div className="appointment-text">
          <span>Agendamento online</span>

          <h2>Escolha o melhor horário para sua consulta</h2>

          <p>
            Selecione o serviço, a data e um horário disponível.
            Não é necessário criar uma conta.
          </p>

          <ul>
            <li>✔ Agendamento rápido</li>
            <li>✔ Horários atualizados automaticamente</li>
            <li>✔ Sem cadastro do paciente</li>
            <li>✔ Confirmação pela clínica</li>
          </ul>
        </div>

        <form
          className="appointment-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="patient_name"
            value={form.patient_name}
            onChange={handleChange}
            placeholder="Nome completo"
            required
          />

          <input
            type="tel"
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="WhatsApp"
            required
          />

          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            required
            disabled={loadingData}
          >
            <option value="">
              {loadingData
                ? "Carregando serviços..."
                : "Escolha o serviço"}
            </option>

            {services.map((service) => (
              <option key={service.id} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="appointment_date"
            min={today}
            value={form.appointment_date}
            onChange={handleChange}
            required
          />

          {form.appointment_date && !selectedDayIsValid && (
            <p className="appointment-warning">
              A clínica não atende nesse dia da semana.
            </p>
          )}

          {form.appointment_date && selectedDayIsValid && (
            <div className="time-grid">
              {availableTimes.map((time) => {
                const isOccupied = occupiedTimes.includes(time);
                const isSelected =
                  form.appointment_time === time;

                return (
                  <button
                    type="button"
                    key={time}
                    disabled={isOccupied}
                    onClick={() => selectTime(time)}
                    className={[
                      isOccupied ? "disabled" : "",
                      isSelected ? "selected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          )}

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Observações adicionais"
          />

          <button
            type="submit"
            className="submit-btn"
            disabled={sending || loadingData}
          >
            {sending
              ? "Enviando..."
              : "Solicitar agendamento"}
          </button>

          {status && (
            <p className="form-message">{status}</p>
          )}
        </form>
      </div>
    </section>
  );
}

export default Appointment;