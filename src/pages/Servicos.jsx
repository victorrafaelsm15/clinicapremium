import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { supabase } from "../supabase/client";
import "./Servicos.css";

const initialForm = {
  name: "",
  description: "",
  price: "",
  duration_minutes: "60",
  active: true,
};

function Servicos() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadServices() {
    setLoading(true);

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Erro ao carregar serviços:", error);
      setMessage("Não foi possível carregar os serviços.");
      setServices([]);
    } else {
      setServices(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadServices();
  }, []);

  function openNewService() {
    setEditingId(null);
    setForm(initialForm);
    setMessage("");
    setModalOpen(true);
  }

  function openEditService(service) {
    setEditingId(service.id);

    setForm({
      name: service.name || "",
      description: service.description || "",
      price: String(service.price ?? ""),
      duration_minutes: String(service.duration_minutes ?? 60),
      active: service.active,
    });

    setMessage("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm(initialForm);
    setMessage("");
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function saveService(event) {
    event.preventDefault();
    setMessage("Salvando serviço...");

    const serviceData = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      duration_minutes: Number(form.duration_minutes),
      active: form.active,
    };

    if (!serviceData.name) {
      setMessage("Informe o nome do serviço.");
      return;
    }

    if (
      Number.isNaN(serviceData.price) ||
      serviceData.price < 0
    ) {
      setMessage("Informe um preço válido.");
      return;
    }

    if (
      Number.isNaN(serviceData.duration_minutes) ||
      serviceData.duration_minutes <= 0
    ) {
      setMessage("Informe uma duração válida.");
      return;
    }

    let error;

    if (editingId) {
      const result = await supabase
        .from("services")
        .update(serviceData)
        .eq("id", editingId);

      error = result.error;
    } else {
      const result = await supabase
        .from("services")
        .insert(serviceData);

      error = result.error;
    }

    if (error) {
      console.error("Erro ao salvar serviço:", error);
      setMessage("Não foi possível salvar o serviço.");
      return;
    }

    closeModal();
    await loadServices();
  }

  async function toggleService(service) {
    const { error } = await supabase
      .from("services")
      .update({
        active: !service.active,
      })
      .eq("id", service.id);

    if (error) {
      console.error("Erro ao alterar serviço:", error);
      setMessage("Não foi possível alterar o serviço.");
      return;
    }

    await loadServices();
  }

  async function deleteService(service) {
    const confirmed = window.confirm(
      `Deseja realmente excluir o serviço "${service.name}"?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", service.id);

    if (error) {
      console.error("Erro ao excluir serviço:", error);
      setMessage("Não foi possível excluir o serviço.");
      return;
    }

    await loadServices();
  }

  function formatPrice(price) {
    return Number(price || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const activeServices = services.filter(
    (service) => service.active
  ).length;

  const averagePrice =
    services.length > 0
      ? services.reduce(
          (total, service) =>
            total + Number(service.price || 0),
          0
        ) / services.length
      : 0;

  return (
    <AdminLayout
      title="Serviços"
      subtitle="Gerencie os atendimentos, valores e durações"
    >
      <section className="services-admin-summary">
        <article>
          <span>Total de serviços</span>
          <strong>{services.length}</strong>
          <p>Serviços cadastrados</p>
        </article>

        <article>
          <span>Serviços ativos</span>
          <strong>{activeServices}</strong>
          <p>Disponíveis para agendamento</p>
        </article>

        <article>
          <span>Valor médio</span>
          <strong>{formatPrice(averagePrice)}</strong>
          <p>Média dos serviços cadastrados</p>
        </article>
      </section>

      <section className="services-admin-panel">
        <div className="services-admin-header">
          <div>
            <h2>Serviços da clínica</h2>
            <p>
              Cadastre preços, durações e informações dos atendimentos.
            </p>
          </div>

          <button type="button" onClick={openNewService}>
            Novo serviço +
          </button>
        </div>

        {message && (
          <p className="services-admin-message">{message}</p>
        )}

        {loading ? (
          <p className="services-admin-empty">
            Carregando serviços...
          </p>
        ) : services.length === 0 ? (
          <div className="services-admin-empty">
            <h3>Nenhum serviço cadastrado</h3>
            <p>
              Clique em “Novo serviço” para adicionar o primeiro.
            </p>
          </div>
        ) : (
          <div className="services-admin-list">
            {services.map((service) => (
              <article
                className={`service-admin-card ${
                  service.active ? "active" : "inactive"
                }`}
                key={service.id}
              >
                <div className="service-admin-main">
                  <div className="service-admin-icon">
                    +
                  </div>

                  <div>
                    <div className="service-admin-title">
                      <h3>{service.name}</h3>

                      <span
                        className={
                          service.active
                            ? "service-active-status"
                            : "service-inactive-status"
                        }
                      >
                        {service.active ? "Ativo" : "Inativo"}
                      </span>
                    </div>

                    <p>
                      {service.description ||
                        "Sem descrição cadastrada."}
                    </p>
                  </div>
                </div>

                <div className="service-admin-details">
                  <div>
                    <span>Preço</span>
                    <strong>
                      {formatPrice(service.price)}
                    </strong>
                  </div>

                  <div>
                    <span>Duração</span>
                    <strong>
                      {service.duration_minutes} minutos
                    </strong>
                  </div>
                </div>

                <div className="service-admin-actions">
                  <button
                    type="button"
                    onClick={() => openEditService(service)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="service-toggle-button"
                    onClick={() => toggleService(service)}
                  >
                    {service.active ? "Desativar" : "Ativar"}
                  </button>

                  <button
                    type="button"
                    className="service-delete-button"
                    onClick={() => deleteService(service)}
                  >
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {modalOpen && (
        <div className="service-modal-background">
          <form
            className="service-modal"
            onSubmit={saveService}
          >
            <div className="service-modal-header">
              <div>
                <span>
                  {editingId
                    ? "Editar serviço"
                    : "Novo serviço"}
                </span>

                <h2>
                  {editingId
                    ? "Atualize as informações"
                    : "Cadastre um atendimento"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            <label>
              Nome do serviço
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex.: Consulta nutricional"
                required
              />
            </label>

            <label>
              Descrição
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Explique brevemente o atendimento"
              />
            </label>

            <div className="service-form-columns">
              <label>
                Preço
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="150.00"
                  required
                />
              </label>

              <label>
                Duração em minutos
                <input
                  type="number"
                  name="duration_minutes"
                  value={form.duration_minutes}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  required
                />
              </label>
            </div>

            <label className="service-active-field">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />

              <span>
                Serviço disponível para agendamento
              </span>
            </label>

            {message && (
              <p className="service-modal-message">
                {message}
              </p>
            )}

            <div className="service-modal-actions">
              <button
                type="button"
                onClick={closeModal}
              >
                Cancelar
              </button>

              <button type="submit">
                {editingId
                  ? "Salvar alterações"
                  : "Cadastrar serviço"}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}

export default Servicos;