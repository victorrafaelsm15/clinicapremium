import "./About.css";

function About() {
  return (
    <section className="about" id="sobre">
      <div className="about-content">
        <div className="about-card">
          <h2>Dra. Nome da Profissional</h2>
          <span>Nutricionista Clínica</span>

          <p>
            Atendimento humanizado, individualizado e baseado em ciência para ajudar pacientes
            a melhorarem sua saúde, autoestima e qualidade de vida.
          </p>

          <div className="about-list">
            <p>✔ Graduação em Nutrição</p>
            <p>✔ Especialização em Emagrecimento</p>
            <p>✔ Nutrição Clínica e Funcional</p>
            <p>✔ Reeducação Alimentar</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;