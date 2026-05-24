/**
 * script.js — CV Junior Hinostroza | Ingeniería de Sistemas
 * ============================================================
 * Módulos:
 *  1.  Navbar scroll (clase 'scrolled')
 *  2.  Menú hamburguesa móvil
 *  3.  Efecto Typewriter — frases del perfil de Junior Hinostroza
 *  4.  Partículas de fondo (Canvas 2D)
 *  5.  IntersectionObserver — reveal en cascada
 *  6.  Barras de habilidades — animación al entrar en viewport
 *  7.  Validación y envío del formulario de contacto
 *  8.  Botón "Volver arriba"
 *  9.  Año dinámico en el footer
 *  10. Navegación activa (scroll spy)
 *  11. Buscador global — filtrado en tiempo real
 *  12. Sistema de Modal para Certificados
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. NAVBAR — Añadir clase 'scrolled' al hacer scroll
  //    Activa el fondo con blur definido en el CSS.
  // ============================================================
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });


  // ============================================================
  // 2. MENÚ HAMBURGUESA
  //    Toggle de clases 'open' en el botón y en el panel móvil.
  // ============================================================
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });


  // ============================================================
  // 3. EFECTO TYPEWRITER — Perfil de Junior Hinostroza
  //    Lista de frases que representan su identidad profesional.
  //    El texto se escribe y borra en un loop infinito.
  // ============================================================
  const typewriterEl = document.getElementById('typewriter');

  // ▼ Frases adaptadas al perfil de Ingeniería de Sistemas
  const phrases = [
    'Estudiante de Ingeniería de Sistemas',
    'Administrador de Servidores Linux',
    'Desarrollador Web Full Stack',
    'Entusiasta de Docker & DevOps',
    'Investigador de Operaciones con Vensim',
    'Especialista en Redes TCP/IP',
    'Ethical Hacker en formación',
    'Arquitecto de Microservicios',
    'Líder Scrum y Gestor de Proyectos TI',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;

  /**
   * type()
   * Función recursiva del typewriter.
   * Alterna entre escribir caracteres (isDeleting=false)
   * y borrarlos (isDeleting=true), cambiando de frase al vaciarse.
   */
  function type() {
    const current = phrases[phraseIndex];

    typewriterEl.textContent = isDeleting
      ? current.substring(0, --charIndex)
      : current.substring(0, ++charIndex);

    let delay = isDeleting ? 55 : 100;

    if (!isDeleting && charIndex === current.length) {
      // Pausa antes de empezar a borrar
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Pasar a la siguiente frase al terminar de borrar
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 350;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 900);


  // ============================================================
  // 4. PARTÍCULAS DE FONDO — Canvas 2D animado
  //    Genera puntos flotantes en el hero que se conectan
  //    con líneas cuando están a menos de 120px de distancia.
  // ============================================================
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * canvas.width;
      this.y     = Math.random() * canvas.height;
      this.vx    = (Math.random() - 0.5) * 0.45;
      this.vy    = (Math.random() - 0.5) * 0.45;
      this.size  = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.45 + 0.12;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139,92,246,${this.alpha})`;
      ctx.fill();
    }
  }

  const COUNT = Math.min(70, Math.floor(window.innerWidth / 14));
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function connectParticles() {
    const MAX = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139,92,246,${(1 - dist / MAX) * 0.22})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  (function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateParticles);
  })();


  // ============================================================
  // 5. INTERSECTION OBSERVER — Reveal en cascada
  //    Agrega clase 'reveal' a los elementos seleccionados.
  //    Cuando entran en el viewport, reciben la clase 'visible'
  //    que dispara la transición CSS de opacity + translateY.
  // ============================================================
  const revealEls = document.querySelectorAll(
    '.glass-card, .section-title, .section-subtitle, .timeline-item, .congreso-card, .blanda-card'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Retraso escalonado: efecto de cascada entre elementos
        setTimeout(() => entry.target.classList.add('visible'), i * 55);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(el => revealObs.observe(el));


  // ============================================================
  // 6. BARRAS DE HABILIDADES — Animación al entrar en viewport
  //    La anchura CSS pasa de 0% al valor de data-width al entrar.
  // ============================================================
  const skillFills = document.querySelectorAll('.skill-fill');

  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = `${entry.target.dataset.width}%`;
        skillObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  skillFills.forEach(f => skillObs.observe(f));


  // ============================================================
  // 7. FORMULARIO DE CONTACTO — Validación y envío simulado
  //    En producción reemplazar el setTimeout por fetch a
  //    Formspree (action="https://formspree.io/f/TU_ID").
  // ============================================================
  const contactForm = document.getElementById('contactForm');
  const formStatus  = document.getElementById('formStatus');
  const submitBtn   = document.getElementById('submitBtn');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre  = document.getElementById('nombre').value.trim();
    const email   = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    if (!nombre || !email || !mensaje) {
      showStatus('⚠️ Por favor completa todos los campos requeridos.', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('⚠️ El correo electrónico no tiene un formato válido.', 'error');
      return;
    }

    submitBtn.disabled    = true;
    submitBtn.innerHTML   = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    // Simulación de envío asíncrono (reemplazar con fetch real)
    setTimeout(() => {
      showStatus('✅ ¡Mensaje enviado correctamente! Me pondré en contacto pronto.', 'success');
      contactForm.reset();
      submitBtn.disabled  = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensaje';
    }, 1600);
  });

  function showStatus(msg, type) {
    formStatus.textContent = msg;
    formStatus.className   = `form-status ${type}`;
    setTimeout(() => {
      formStatus.textContent = '';
      formStatus.className   = 'form-status';
    }, 6000);
  }


  // ============================================================
  // 8. BOTÓN VOLVER ARRIBA — Visible al bajar 400px
  // ============================================================
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ============================================================
  // 9. AÑO DINÁMICO EN EL FOOTER
  // ============================================================
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  // ============================================================
  // 10. SCROLL SPY — Highlight del link activo en la navbar
  //     Detecta qué sección está en pantalla y marca su enlace.
  // ============================================================
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const id     = section.getAttribute('id');
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { passive: true });


  // ============================================================
  // 11. BUSCADOR GLOBAL — Filtrado en tiempo real
  //
  //  Funcionamiento:
  //  - Escucha el evento 'input' en #globalSearch.
  //  - Convierte la query a minúsculas y elimina tildes para
  //    comparación más robusta.
  //  - Itera sobre todos los elementos con clase '.searchable'.
  //    Cada uno tiene un atributo data-search con palabras clave.
  //  - Si la query está vacía: muestra todos los elementos.
  //  - Si hay query: oculta con transición de opacidad los que
  //    no coincidan, y muestra con opacidad completa los que sí.
  //  - También busca dentro del texto visible del elemento.
  // ============================================================
  const globalSearch    = document.getElementById('globalSearch');
  const searchableItems = document.querySelectorAll('.searchable');

  /**
   * normalizeStr(str)
   * Convierte a minúsculas y elimina tildes/diacríticos para
   * comparación insensible a acentos.
   * @param {string} str
   * @returns {string}
   */
  function normalizeStr(str) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  globalSearch.addEventListener('input', () => {
    const query = normalizeStr(globalSearch.value.trim());

    searchableItems.forEach(item => {
      if (!query) {
        // Sin query: restaurar visibilidad completa
        item.style.opacity    = '1';
        item.style.transform  = 'translateY(0)';
        item.style.pointerEvents = 'auto';
        return;
      }

      // Combinar data-search + texto interno para la búsqueda
      const dataKeywords  = normalizeStr(item.dataset.search || '');
      const innerText     = normalizeStr(item.innerText || '');
      const combined      = dataKeywords + ' ' + innerText;

      const matches = combined.includes(query);

      // Transición suave de opacidad (definida en CSS con transition)
      item.style.transition   = 'opacity 0.35s ease, transform 0.35s ease';
      item.style.opacity      = matches ? '1' : '0.12';
      item.style.transform    = matches ? 'translateY(0)' : 'translateY(6px)';
      item.style.pointerEvents = matches ? 'auto' : 'none';
    });

    // Si la query está vacía, limpiar todos los estilos inline
    if (!query) {
      searchableItems.forEach(item => {
        item.style.opacity     = '';
        item.style.transform   = '';
        item.style.transition  = '';
        item.style.pointerEvents = '';
      });
    }
  });

  // Limpiar búsqueda al presionar Escape
  globalSearch.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      globalSearch.value = '';
      globalSearch.dispatchEvent(new Event('input'));
      globalSearch.blur();
    }
  });


  // ============================================================
  // 12. SISTEMA DE MODAL PARA CERTIFICADOS
  //
  //  Arquitectura desacoplada — SINCRONIZADA con el HTML:
  //
  //  a) Cada <button class="btn-cert"> almacena directamente:
  //       data-src     → ruta relativa a la imagen del certificado
  //                      (ej: "img/certificado1.jpg")
  //       data-caption → texto descriptivo mostrado bajo la imagen
  //                      (ej: "AWS Certified Developer – Associate")
  //
  //     Esta estrategia elimina la dependencia del DOM hermano
  //     (<img class="cert-img-hidden">), simplifica el HTML y
  //     hace la lectura completamente explícita y predecible.
  //
  //  b) La delegación de eventos escucha en document (un solo
  //     listener para todos los botones presentes y futuros).
  //     Al detectar un .btn-cert, captura btn.dataset.src y
  //     btn.dataset.caption directamente sin traversal DOM.
  //
  //  c) ACTUALIZACIÓN DINÁMICA DEL CV (para el examen — Docker/Nginx):
  //     El botón de descarga del CV apunta a "CV_Junior_Hinostroza.pdf"
  //     mediante una ruta relativa en la raíz del servidor:
  //       <a href="CV_Junior_Hinostroza.pdf" download>Descargar CV</a>
  //     
  //     Arquitectura desacoplada para Docker + Nginx:
  //     - El PDF es un artefacto BINARIO independiente del código fuente.
  //     - El volumen Docker monta la carpeta raíz como bind-mount:
  //         volumes: ["./public:/usr/share/nginx/html:ro"]
  //     - Para actualizar el CV, el administrador reemplaza únicamente
  //       el archivo CV_Junior_Hinostroza.pdf en ./public/ del host.
  //     - Nginx sirve el nuevo binario en la siguiente petición HTTP
  //       SIN necesidad de: recompilar, modificar código fuente,
  //       hacer docker build, ni reiniciar el contenedor.
  //     - Los clientes descargan siempre la versión más reciente
  //       gracias a que el navegador solicita el archivo cada vez
  //       (no hay caché agresiva para descargas con el atributo download).
  //     - Este patrón es el estándar de "static file serving" en
  //       producción con Nginx: separar lógica de presentación (HTML/CSS/JS)
  //       de activos binarios mutables (PDF, imágenes de certificados).
  //
  //  d) El modal se cierra con:
  //     - Botón (X) #closeModal
  //     - Clic en el fondo oscuro fuera de .modal-content
  //     - Tecla Escape
  // ============================================================
  const certModal    = document.getElementById('certModal');
  const modalImg     = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const closeModal   = document.getElementById('closeModal');

  /**
   * openModal(src, caption)
   * Inyecta la imagen y el caption en el modal y lo hace visible.
   * @param {string} src     - Ruta de la imagen (de btn.dataset.src).
   * @param {string} caption - Texto descriptivo (de btn.dataset.caption).
   */
  function openModal(src, caption) {
    // Resetear imagen anterior para evitar parpadeo con foto previa
    modalImg.src     = '';
    modalImg.alt     = caption;
    modalImg.style.opacity = '0';

    // Activar el overlay con transición CSS (opacity + scale)
    certModal.classList.add('active');

    // Carga progresiva: la imagen aparece con fade-in al estar lista
    const tempImg = new Image();
    tempImg.onload = () => {
      modalImg.src           = src;
      modalImg.style.opacity = '1';
    };
    tempImg.onerror = () => {
      // Fallback: placeholder con el nombre del certificado si la imagen no existe
      // Útil durante desarrollo cuando aún no se han subido las fotos reales
      modalImg.src           = `https://placehold.co/800x560/10101a/8b5cf6?text=${encodeURIComponent(caption)}`;
      modalImg.style.opacity = '1';
    };
    tempImg.src = src;

    modalCaption.textContent = caption;

    // Bloquear scroll del body mientras el modal está abierto
    document.body.style.overflow = 'hidden';
  }

  /**
   * closeModalFn()
   * Cierra el modal con transición CSS y restaura el scroll.
   */
  function closeModalFn() {
    certModal.classList.remove('active');
    document.body.style.overflow = '';
    // Limpiar src tras la transición para liberar memoria del navegador
    setTimeout(() => { modalImg.src = ''; }, 350);
  }

  // ─── Delegación de eventos: un solo listener eficiente para todos los botones ───
  // CORRECCIÓN SINCRONIZADA: Lee data-src y data-caption DIRECTAMENTE del botón,
  // sin buscar imágenes hermanas (.cert-img-hidden) en el DOM de la tarjeta.
  // Esto es más robusto, más rápido y elimina la dependencia del elemento <img> oculto.
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-cert');
    if (!btn) return;

    // ► Captura directa desde los atributos data del propio botón
    const src     = btn.dataset.src     || '';
    const caption = btn.dataset.caption || btn.dataset.title || 'Certificado';

    openModal(src, caption);
  });

  // Cerrar con el botón X
  closeModal.addEventListener('click', closeModalFn);

  // Cerrar al hacer clic en el fondo oscuro (fuera de .modal-content)
  certModal.addEventListener('click', (e) => {
    if (e.target === certModal) closeModalFn();
  });

  // Cerrar con la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal.classList.contains('active')) {
      closeModalFn();
    }
  });


  // ============================================================
  // BONUS: Contador animado para las estadísticas del hero
  //        Al entrar en viewport, los números se animan desde 0.
  // ============================================================
  const statNumbers = document.querySelectorAll('.stat-number');

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el      = entry.target;
      const target  = parseInt(el.textContent.replace(/\D/g, ''), 10) || 0;
      const suffix  = el.textContent.replace(/[0-9]/g, '');
      let current   = 0;
      const step    = Math.max(1, Math.floor(target / 30)); // 30 frames aprox.
      const timer   = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if (current >= target) clearInterval(timer);
      }, 40);

      counterObs.unobserve(el);
    });
  }, { threshold: 0.8 });

  statNumbers.forEach(el => counterObs.observe(el));

}); // Fin DOMContentLoaded