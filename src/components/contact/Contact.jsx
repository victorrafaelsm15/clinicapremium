import "./Contact.css";

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="contact-svg"
    >
      <path
        fill="currentColor"
        d="M16.04 3C8.86 3 3.02 8.79 3.02 15.92c0 2.28.6 4.51 1.73 6.47L3 29l6.79-1.77a13.1 13.1 0 0 0 6.24 1.59h.01c7.18 0 13.02-5.79 13.02-12.91C29.06 8.79 23.22 3 16.04 3Zm0 23.64h-.01a10.9 10.9 0 0 1-5.55-1.51l-.4-.24-4.03 1.05 1.08-3.91-.26-.4a10.7 10.7 0 0 1-1.66-5.72c0-5.92 4.86-10.74 10.83-10.74 5.97 0 10.83 4.82 10.83 10.74 0 5.92-4.86 10.73-10.83 10.73Zm5.94-8.04c-.32-.16-1.92-.94-2.22-1.05-.3-.11-.52-.16-.74.16-.22.32-.85 1.05-1.04 1.27-.19.21-.38.24-.71.08-.32-.16-1.37-.5-2.61-1.59-.96-.85-1.61-1.91-1.8-2.23-.19-.32-.02-.5.14-.66.15-.14.32-.37.49-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.74-1.77-1.01-2.42-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.4-.3.32-1.14 1.11-1.14 2.71s1.17 3.14 1.33 3.35c.16.21 2.3 3.49 5.57 4.89.78.34 1.39.54 1.86.69.78.25 1.49.21 2.05.13.63-.09 1.92-.78 2.19-1.53.27-.75.27-1.4.19-1.53-.08-.13-.3-.21-.63-.37Z"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="contact-svg"
    >
      <path
        fill="currentColor"
        d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5ZM17.5 5.5A1.25 1.25 0 1 1 17.5 8a1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="contact-svg"
    >
      <path
        fill="currentColor"
        d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7Zm0 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
      />
    </svg>
  );
}

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
          <div className="contact-icon">
            <WhatsAppIcon />
          </div>

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
          <div className="contact-icon">
            <InstagramIcon />
          </div>

          <h3>Instagram</h3>

          <p>
            Conteúdos, dicas de saúde e resultados.
          </p>

          <strong>Seguir no Instagram</strong>
        </a>

        <div className="contact-card location-card">
          <div className="contact-icon">
            <LocationIcon />
          </div>

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