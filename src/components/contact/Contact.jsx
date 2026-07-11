import "./Contact.css";

function Contact() {
  return (
    <section className="contact" id="contato">
      <div className="section-title">
        <span>Contato</span>
        <h2>Fale com a profissional</h2>
        <p>
          Tire dúvidas, acompanhe conteúdos pelo Instagram e encontre facilmente
          o local de atendimento.
        </p>
      </div>

      <div className="contact-grid">
        <a href="https://wa.me/5500000000000" target="_blank" className="contact-card">
          <h3>WhatsApp</h3>
          <p>Agendamentos, dúvidas e confirmação de consulta.</p>
        </a>

        <a href="https://instagram.com/" target="_blank" className="contact-card">
          <h3>Instagram</h3>
          <p>Conteúdos, dicas de saúde e resultados de pacientes.</p>
        </a>

        <div className="contact-card">
          <h3>Localização</h3>
          <p>Rua Exemplo, 123<br />Centro - Sua Cidade</p>
        </div>
      </div>

      <div className="map-placeholder">
        Google Maps
      </div>
    </section>
  );
}

export default Contact;