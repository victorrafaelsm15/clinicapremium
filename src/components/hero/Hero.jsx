import "./Hero.css";

function Hero() {
  const doctorImage = `${
    import.meta.env.BASE_URL
  }images/doutora.jpg.jpeg`;

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <span>Atendimento profissional premium</span>

          <h1>
            Saúde, autoestima e qualidade de vida com acompanhamento
            personalizado.
          </h1>

          <p>
            Um atendimento humanizado para quem busca emagrecimento,
            reeducação alimentar, composição corporal e mudança real de
            hábitos.
          </p>

          <div className="hero-buttons">
            <a href="#agendamento" className="btn-primary">
              Agendar consulta
            </a>

            <a href="#resultados" className="btn-secondary">
              Ver resultados
            </a>
          </div>

          <div className="hero-stats">
            <div>
              <strong>+5.000</strong>
              <small>pacientes atendidos</small>
            </div>

            <div>
              <strong>5.0</strong>
              <small>avaliação média</small>
            </div>

            <div>
              <strong>Online</strong>
              <small>agenda inteligente</small>
            </div>
          </div>
        </div>

        <div className="doctor-card">
          <img
            src={doctorImage}
            alt="Doutora responsável pelo atendimento"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;