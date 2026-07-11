import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { supabase } from "../supabase/client";
import "./Configuracoes.css";

const initialForm = {
  opening_time: "08:00",
  closing_time: "17:00",
  lunch_start: "12:00",
  lunch_end: "14:00",
  appointment_interval: 60,
  working_days: ["segunda", "terca", "quarta", "quinta", "sexta"],
  whatsapp: "",
  instagram: "",
  address: "",
};

const days = [
  { value: "segunda", label: "Segunda" },
  { value: "terca", label: "Terça" },
  { value: "quarta", label: "Quarta" },
  { value: "quinta", label: "Quinta" },
  { value: "sexta", label: "Sexta" },
  { value: "sabado", label: "Sábado" },
  { value: "domingo", label: "Domingo" },
];

function Configuracoes() {
  const [settingsId, setSettingsId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);

    const { data, error } = await supabase
      .from("clinic_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(error);
      setMessage("Não foi possível carregar as configurações.");
      setLoading(false);
      return;
    }

    if (data) {
      setSettingsId(data.id);
      setForm({
        opening_time: data.opening_time || "08:00",
        closing_time: data.closing_time || "17:00",
        lunch_start: data.lunch_start || "",
        lunch_end: data.lunch_end || "",
        appointment_interval: data.appointment_interval || 60,
        working_days: data.working_days || [],
        whatsapp: data.whatsapp || "",
        instagram: data.instagram || "",
        address: data.address || "",
      });
    }

    setLoading(false);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "appointment_interval"
          ? Number(value)
          : value,
    }));
  }

  function toggleDay(day) {
    setForm((current) => {
      const isSelected = current.working_days.includes(day);

      return {
        ...current,
        working_days: isSelected
          ? current.working_days.filter((item) => item !== day)
          : [...current.working_days, day],
      };
    });
  }

  async function saveSettings(event) {
    event.preventDefault();
    setMessage("Salvando configurações...");

    const payload = {
      ...form,
      whatsapp: form.whatsapp.replace(/\D/g, ""),
    };

    let result;

    if (settingsId) {
      result = await supabase
        .from("clinic_settings")
        .update(payload)
        .eq("id", settingsId);
    } else {
      result = await supabase
        .from("clinic_settings")
        .insert(payload)
        .select()
        .single();
    }

    if (result.error) {
      console.error(result.error);
      setMessage("Não foi possível salvar as configurações.");
      return;
    }

    if (!settingsId && result.data) {
      setSettingsId(result.data.id);
    }

    setMessage("Configurações salvas com sucesso.");
  }

  return (
    <AdminLayout
      title="Configurações"
      subtitle="Defina horários e informações públicas da clínica"
    >
      <section className="settings-panel">
        {loading ? (
          <p className="settings-message">Carregando configurações...</p>
        ) : (
          <form className="settings-form" onSubmit={saveSettings}>
            <div className="settings-section">
              <h2>Horário de atendimento</h2>

              <div className="settings-grid">
                <label>
                  Abertura
                  <input
                    type="time"
                    name="opening_time"
                    value={form.opening_time}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Encerramento
                  <input
                    type="time"
                    name="closing_time"
                    value={form.closing_time}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Início do intervalo
                  <input
                    type="time"
                    name="lunch_start"
                    value={form.lunch_start}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Fim do intervalo
                  <input
                    type="time"
                    name="lunch_end"
                    value={form.lunch_end}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Duração da consulta
                  <select
                    name="appointment_interval"
                    value={form.appointment_interval}
                    onChange={handleChange}
                  >
                    <option value="30">30 minutos</option>
                    <option value="45">45 minutos</option>
                    <option value="60">60 minutos</option>
                    <option value="90">90 minutos</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="settings-section">
              <h2>Dias de atendimento</h2>

              <div className="working-days">
                {days.map((day) => (
                  <button
                    type="button"
                    key={day.value}
                    className={
                      form.working_days.includes(day.value)
                        ? "selected"
                        : ""
                    }
                    onClick={() => toggleDay(day.value)}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <h2>Contato e localização</h2>

              <div className="settings-grid">
                <label>
                  WhatsApp
                  <input
                    type="tel"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Instagram
                  <input
                    type="text"
                    name="instagram"
                    value={form.instagram}
                    onChange={handleChange}
                  />
                </label>

                <label className="settings-full">
                  Endereço
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </div>

            {message && (
              <p className="settings-message">{message}</p>
            )}

            <button className="settings-submit" type="submit">
              Salvar configurações
            </button>
          </form>
        )}
      </section>
    </AdminLayout>
  );
}

export default Configuracoes;