import "./Header.css";

function Header() {
  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (!section) return;

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <header className="header">
      <div className="header-content">
        <button
          type="button"
          className="header-brand"
          onClick={() => scrollToSection("inicio")}
          aria-label="Voltar ao início do site"
        >
          <strong>Dra. Nome da Profissional</strong>
          <span>Especialista em Emagrecimento</span>
        </button>

        <a
          href="https://wa.me/5500000000000"
          target="_blank"
          rel="noopener noreferrer"
          className="header-whatsapp-mobile"
          aria-label="Conversar pelo WhatsApp"
          title="Conversar pelo WhatsApp"
        >
          <svg
            className="header-whatsapp-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            role="img"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M12.04 2a9.84 9.84 0 0 0-8.48 14.83L2 22l5.3-1.52A9.98 9.98 0 1 0 12.04 2Zm0 17.94a8 8 0 0 1-4.08-1.12l-.29-.17-3.14.9.92-3.05-.19-.31a7.91 7.91 0 1 1 6.78 3.75Zm4.37-5.93c-.24-.12-1.41-.69-1.63-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06a6.54 6.54 0 0 1-1.92-1.18 7.27 7.27 0 0 1-1.33-1.65c-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 1.99 0 1.17.86 2.3.98 2.46.12.16 1.69 2.56 4.09 3.59.57.25 1.02.4 1.37.51.57.18 1.09.16 1.5.1.46-.07 1.41-.57 1.61-1.12.2-.55.2-1.03.14-1.12-.06-.1-.22-.16-.46-.28Z"
            />
          </svg>
        </a>
      </div>
    </header>
  );
}

export default Header;