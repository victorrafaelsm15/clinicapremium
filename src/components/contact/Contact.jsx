import "./Contact.css";

function Contact() {
  return (
    <section className="contact" id="contato">
      <div className="section-title">
        <span>Contato</span>

        <h2>Fale com a profissional</h2>

        <p>
          Tire suas dúvidas, acompanhe os conteúdos e encontre o local de
          atendimento.
        </p>
      </div>

      <div className="contact-grid">
        <a
          href="https://wa.me/5500000000000"
          target="_blank"
          rel="noreferrer"
          className="contact-card whatsapp-card"
        >
          <div className="contact-icon">W</div>

          <h3>WhatsApp</h3>

          <p>
            Agendamentos, dúvidas e confirmação de consultas.
          </p>

          <strong>Conversar no WhatsApp</strong>
        </a>

        <a
          href="https://instagram.com/seuinstagram"
          target="_blank"
          rel="noreferrer"
          className="contact-card instagram-card"
        >
          <div className="contact-icon">◎</div>

          <h3>Instagram</h3>

          <p>
            Conteúdos, dicas de saúde e resultados.
          </p>

          <strong>Seguir no Instagram</strong>
        </a>

        <div className="contact-card location-card">
          <div className="contact-icon">⌖</div>

          <h3>Localização</h3>

          <p>
            Rua Exemplo, 123
            <br />
            Centro — Sua cidade
          </p>

          <strong>Atendimento presencial</strong>
        </div>
      </div>

      <div className="map-placeholder">
        Google Maps
      </div>
    </section>
  );
}

export default Contact;