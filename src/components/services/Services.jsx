import "./Services.css";

function Services() {
  const services = [
    {
      title: "Emagrecimento",
      text: "Plano alimentar personalizado para perda de peso com saúde e constância.",
    },
    {
      title: "Reeducação Alimentar",
      text: "Construção de hábitos sustentáveis sem dietas extremas ou restrições desnecessárias.",
    },
    {
      title: "Composição Corporal",
      text: "Estratégias para redução de gordura, manutenção de massa magra e melhora estética.",
    },
    {
      title: "Consulta Online",
      text: "Atendimento profissional à distância com praticidade e acompanhamento individual.",
    },
  ];

  return (
    <section className="services" id="servicos">
      <div className="section-title">
        <span>Serviços</span>
        <h2>Como posso ajudar você</h2>
        <p>
          Acompanhamentos personalizados para diferentes objetivos de saúde,
          estética e qualidade de vida.
        </p>
      </div>

      <div className="services-grid">
        {services.map((item, index) => (
          <div className="service-card" key={index}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;