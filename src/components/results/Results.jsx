import "./Results.css";

function Results() {
  const results = [
    {
      image: "/images/antes-depois1.jpg.jpeg",
      title: "Emagrecimento saudável",
      text: "Evolução com planejamento alimentar e acompanhamento individual.",
    },
    {
      image: "/images/antes-depois2.jpg.jpeg",
      title: "Redução de medidas",
      text: "Transformação corporal com foco em saúde, rotina e equilíbrio.",
    },
    {
      image: "/images/antes-depois3.jpg.jpeg",
      title: "Composição corporal",
      text: "Melhora estética e funcional através de estratégias personalizadas.",
    },
    {
      image: "/images/antes-depois4.jpg.jpeg",
      title: "Mudança de hábitos",
      text: "Resultados construídos com constância, orientação e plano individual.",
    },
  ];

  return (
    <section className="results" id="resultados">
      <div className="section-title">
        <span>Antes e depois</span>
        <h2>Resultados reais com acompanhamento</h2>
        <p>
          Transformações alcançadas com orientação profissional, constância e cuidado individual.
        </p>
      </div>

      <div className="results-grid">
        {results.map((item, index) => (
          <div className="result-card" key={index}>
            <img src={item.image} alt={item.title} />

            <div className="result-info">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Results;