import "./Benefits.css";

function Benefits() {
  const benefits = [
    {
      title: "Atendimento Humanizado",
      text: "Cada paciente recebe um plano personalizado de acordo com seus objetivos."
    },
    {
      title: "Especialização",
      text: "Métodos atualizados baseados em evidências científicas."
    },
    {
      title: "Resultados Reais",
      text: "Acompanhamento contínuo para garantir evolução segura."
    },
    {
      title: "Tecnologia",
      text: "Agendamento online, acompanhamento digital e suporte."
    }
  ];

  return (
    <section className="benefits">

      <div className="section-title">
        <span>Diferenciais</span>
        <h2>Por que escolher nosso atendimento?</h2>
      </div>

      <div className="benefits-grid">

        {benefits.map((item,index)=>(
          <div className="benefit-card" key={index}>

            <div className="icon">
              ✓
            </div>

            <h3>{item.title}</h3>

            <p>{item.text}</p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default Benefits;