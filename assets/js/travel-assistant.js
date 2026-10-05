(() => {
  "use strict";

  const WHATSAPP_BUSINESS_NUMBER = "573151732957";
  const MENU_OPTIONS = [
    { label: "✈️ Cotizar un viaje", value: "quote" },
    { label: "📋 Ya tengo una reserva", value: "reservation" },
    { label: "👩‍💼 Hablar con una asesora", value: "advisor" },
  ];
  const TRAVEL_TYPES = [
    "🏖️ Playa",
    "👨‍👩‍👧‍👦 Familiar",
    "💑 Pareja",
    "🏔️ Aventura",
    "✈️ Vacaciones",
    "🛳️ Crucero",
    "🌎 Internacional",
    "Otro",
  ];
  const BUDGETS = [
    "Menos de $2.000.000",
    "$2.000.000 - $4.000.000",
    "$4.000.000 - $6.000.000",
    "$6.000.000 - $10.000.000",
    "Más de $10.000.000",
    "Aún no lo tengo definido",
  ];
  const state = {
    flow: null,
    step: "menu",
    quote: {},
    reservation: {},
    advisor: {},
  };

  const widget = document.createElement("div");
  widget.className = "sdt-chat-widget";
  widget.innerHTML = `
    <button class="sdt-chat-launcher" type="button" aria-label="Abrir chat de Sandra Díaz Travel" aria-controls="sdt-chat-panel" aria-expanded="false">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 11.5a7.5 7.5 0 0 1-11.1 6.6L4 19l.9-4.6A7.5 7.5 0 1 1 20 11.5Z"/><path d="M8.5 10.1h.01M12 10.1h.01M15.5 10.1h.01"/></svg>
      <span>¿Planeamos tu viaje?</span>
    </button>
    <section class="sdt-chat-panel" id="sdt-chat-panel" aria-label="Chat de Sandra Díaz Travel" aria-hidden="true" hidden>
      <header class="sdt-chat-header">
        <span class="sdt-chat-avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false"><path d="m21 3-7.2 18-3.1-7.7L3 10.2 21 3Z"/><path d="m10.7 13.3 4.4-4.4"/></svg>
        </span>
        <span class="sdt-chat-heading"><strong>Sandra Díaz Travel</strong><small>Asistente virtual · En línea</small></span>
        <button class="sdt-chat-close" type="button" aria-label="Cerrar chat" title="Cerrar chat">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </header>
      <div class="sdt-chat-messages" role="log" aria-live="polite" aria-relevant="additions text"></div>
      <form class="sdt-chat-form" autocomplete="off">
        <label class="sdt-chat-sr-only" for="sdt-chat-input">Escribe tu mensaje</label>
        <input class="sdt-chat-input" id="sdt-chat-input" name="message" type="text" maxlength="500" placeholder="Escribe tu mensaje...">
        <button class="sdt-chat-send" type="submit" aria-label="Enviar mensaje" title="Enviar mensaje">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13"/></svg>
        </button>
      </form>
      <p class="sdt-chat-note">Sandra Díaz Travel · Asesoría personalizada</p>
    </section>
  `;
  document.body.appendChild(widget);

  const launcher = widget.querySelector(".sdt-chat-launcher");
  const panel = widget.querySelector(".sdt-chat-panel");
  const closeButton = widget.querySelector(".sdt-chat-close");
  const messages = widget.querySelector(".sdt-chat-messages");
  const form = widget.querySelector(".sdt-chat-form");
  const input = widget.querySelector(".sdt-chat-input");

  function scrollMessagesToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  function appendMessage(text, sender, options = []) {
    const row = document.createElement("div");
    row.className = `sdt-chat-message sdt-chat-message--${sender}`;

    const bubble = document.createElement("div");
    bubble.className = "sdt-chat-bubble";
    bubble.textContent = text;
    row.appendChild(bubble);

    if (options.length) {
      const replies = document.createElement("div");
      replies.className = "sdt-chat-quick-replies";
      options.forEach((option) => {
        const button = document.createElement("button");
        button.className = "sdt-chat-reply";
        button.type = "button";
        button.textContent = option.label;
        button.addEventListener("click", () => submitAnswer(option.value, option.label));
        replies.appendChild(button);
      });
      row.appendChild(replies);
    }

    messages.appendChild(row);
    scrollMessagesToBottom();
    return row;
  }

  function appendWhatsAppButton(label, text) {
    const row = document.createElement("div");
    row.className = "sdt-chat-message sdt-chat-message--assistant";
    const link = document.createElement("a");
    const phone = WHATSAPP_BUSINESS_NUMBER.replace(/\D/g, "");
    link.className = "sdt-chat-whatsapp";
    const whatsappUrl = new URL(`https://wa.me/${phone}`);
    whatsappUrl.searchParams.set("text", text);
    link.href = whatsappUrl.toString();
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;
    row.appendChild(link);
    messages.appendChild(row);
    scrollMessagesToBottom();
  }

  function disableQuickReplies() {
    messages.querySelectorAll(".sdt-chat-reply:not(:disabled)").forEach((button) => {
      button.disabled = true;
    });
  }

  function ask(text, options = []) {
    const replies = options.map((option) => typeof option === "string"
      ? { label: option, value: option }
      : option);
    appendMessage(text, "assistant", replies);
  }

  function showMenu(text) {
    state.flow = null;
    state.step = "menu";
    ask(text, MENU_OPTIONS);
  }

  function makeWhatsAppUrlText(lines) {
    return lines.filter(Boolean).join("\n");
  }

  function startQuote() {
    state.flow = "quote";
    state.step = "name";
    state.quote = {};
    ask("¡Excelente! 😊 ¿Cuál es tu nombre?");
  }

  function startReservation() {
    state.flow = "reservation";
    state.step = "name";
    state.reservation = {};
    ask("¿Cuál es tu nombre?");
  }

  function startAdvisor() {
    state.flow = "advisor";
    state.step = "name";
    state.advisor = {};
    ask("Claro 😊. Para conectarte con una asesora, déjanos tu nombre y número de WhatsApp.");
    ask("¿Cuál es tu nombre?");
  }

  function parseTravelParty(answer) {
    const adults = answer.match(/(\d+)\s*(?:adultos?|adults?)/i);
    const children = answer.match(/(\d+)\s*(?:niñ[oa]s?|menores?)/i);
    const numbers = [...answer.matchAll(/\d+/g)].map((match) => match[0]);

    if (adults || children) {
      return {
        adultos: adults ? adults[1] : numbers[0] || "0",
        ninos: children ? children[1] : "0",
      };
    }
    if (numbers.length >= 2) {
      return { adultos: numbers[0], ninos: numbers[1] };
    }
    return null;
  }

  function finishQuote() {
    const quote = state.quote;
    const summary = makeWhatsAppUrlText([
      "✈️ *SOLICITUD DE VIAJE · SANDRA DÍAZ TRAVEL*",
      `👤 Nombre: ${quote.nombre}`,
      `📍 Destino: ${quote.destino}`,
      `📅 Fecha: ${quote.fecha_viaje}`,
      `👥 Viajeros: ${quote.numero_viajeros}`,
      `🧑 Adultos: ${quote.adultos}`,
      `🧒 Niños: ${quote.ninos}`,
      `🧭 Tipo de viaje: ${quote.tipo_viaje}`,
      `💰 Presupuesto: ${quote.presupuesto}`,
      `✨ Preferencias: ${quote.preferencias}`,
      `📱 WhatsApp: ${quote.whatsapp}`,
    ]);
    ask(`¡Perfecto, ${quote.nombre}! 😊 Ya tengo la información necesaria para preparar tu solicitud.\n\nUna de nuestras asesoras revisará las mejores opciones para ti y se pondrá en contacto contigo por WhatsApp.\n\n¡Gracias por confiar en Sandra Díaz Travel! ✈️🌎`);
    appendWhatsAppButton("📱 Hablar con una asesora por WhatsApp", summary);
    state.flow = null;
    state.step = "menu";
  }

  function finishReservation() {
    ask("Gracias. Una asesora revisará tu solicitud y se pondrá en contacto contigo.");
    state.flow = null;
    state.step = "menu";
  }

  function finishAdvisor() {
    const advisor = state.advisor;
    const summary = makeWhatsAppUrlText([
      "👩‍💼 *SOLICITUD PARA HABLAR CON UNA ASESORA*",
      `👤 Nombre: ${advisor.nombre}`,
      `📱 WhatsApp: ${advisor.whatsapp}`,
      `💬 Motivo: ${advisor.motivo}`,
    ]);
    ask(`Gracias, ${advisor.nombre}. Preparamos tu solicitud para que puedas contactar a una asesora por WhatsApp.`);
    appendWhatsAppButton("📱 Contactar asesora", summary);
    state.flow = null;
    state.step = "menu";
  }

  function handleQuote(answer) {
    const quote = state.quote;
    switch (state.step) {
      case "name":
        quote.nombre = answer;
        state.step = "destination";
        ask(`Mucho gusto, ${quote.nombre}. ¿A qué destino te gustaría viajar?`);
        break;
      case "destination":
        quote.destino = answer;
        state.step = "date";
        ask("¿Para qué fecha tienes pensado viajar?");
        break;
      case "date":
        quote.fecha_viaje = answer;
        state.step = "travelers";
        ask("¿Cuántas personas viajarían?");
        break;
      case "travelers":
        quote.numero_viajeros = answer;
        state.step = "party";
        ask("¿Cuántos adultos y cuántos niños?");
        break;
      case "party": {
        const party = parseTravelParty(answer);
        if (!party) {
          ask("Por favor indícame ambos datos, por ejemplo: 2 adultos y 1 niño.");
          return;
        }
        quote.adultos = party.adultos;
        quote.ninos = party.ninos;
        state.step = "type";
        ask("¿Qué tipo de viaje estás buscando?", TRAVEL_TYPES);
        break;
      }
      case "type":
        if (answer.toLowerCase() === "otro") {
          state.step = "otherType";
          ask("Cuéntame qué tipo de viaje tienes en mente.");
          return;
        }
        quote.tipo_viaje = answer;
        state.step = "budget";
        ask("¿Cuál es tu presupuesto aproximado para el viaje?", BUDGETS);
        break;
      case "otherType":
        quote.tipo_viaje = `Otro: ${answer}`;
        state.step = "budget";
        ask("¿Cuál es tu presupuesto aproximado para el viaje?", BUDGETS);
        break;
      case "budget":
        quote.presupuesto = answer;
        state.step = "preferences";
        ask("¿Tienes alguna preferencia especial? Por ejemplo: hotel, vuelos, todo incluido, actividades, alimentación, transporte, etc.");
        break;
      case "preferences":
        quote.preferencias = answer;
        state.step = "whatsapp";
        ask("¿Cuál es tu número de WhatsApp para que una asesora pueda contactarte?");
        break;
      case "whatsapp":
        if (answer.replace(/\D/g, "").length < 7) {
          ask("Por favor escribe un número de WhatsApp válido para que podamos contactarte.");
          return;
        }
        quote.whatsapp = answer;
        finishQuote();
        break;
      default:
        showMenu("¿Qué te gustaría hacer?");
    }
  }

  function handleReservation(answer) {
    const reservation = state.reservation;
    if (state.step === "name") {
      reservation.nombre = answer;
      state.step = "number";
      ask("¿Cuál es el número de tu reserva?");
    } else if (state.step === "number") {
      reservation.numero = answer;
      state.step = "help";
      ask("¿En qué podemos ayudarte?");
    } else if (state.step === "help") {
      reservation.motivo = answer;
      finishReservation();
    }
  }

  function handleAdvisor(answer) {
    const advisor = state.advisor;
    if (state.step === "name") {
      advisor.nombre = answer;
      state.step = "whatsapp";
      ask("¿Cuál es tu número de WhatsApp?");
    } else if (state.step === "whatsapp") {
      if (answer.replace(/\D/g, "").length < 7) {
        ask("Por favor escribe un número de WhatsApp válido.");
        return;
      }
      advisor.whatsapp = answer;
      state.step = "reason";
      ask("¿Cuál es el motivo de tu consulta?");
    } else if (state.step === "reason") {
      advisor.motivo = answer;
      finishAdvisor();
    }
  }

  function submitAnswer(rawAnswer, displayAnswer = rawAnswer) {
    const answer = rawAnswer.trim();
    if (!answer) return;

    disableQuickReplies();
    appendMessage(answer === "__menu__" ? "Volver al inicio" : displayAnswer, "user");

    if (answer === "__menu__") {
      showMenu("¿Qué te gustaría hacer ahora?");
      return;
    }

    if (!state.flow) {
      if (answer === "quote") return startQuote();
      if (answer === "reservation") return startReservation();
      if (answer === "advisor") return startAdvisor();
      const normalized = answer.toLowerCase();
      if (normalized.includes("cotiz")) return startQuote();
      if (normalized.includes("reserva")) return startReservation();
      if (normalized.includes("asesor")) return startAdvisor();
      showMenu("Selecciona una opción para poder ayudarte:");
      return;
    }

    if (state.flow === "quote") handleQuote(answer);
    else if (state.flow === "reservation") handleReservation(answer);
    else if (state.flow === "advisor") handleAdvisor(answer);
  }

  launcher.addEventListener("click", () => {
    panel.hidden = false;
    panel.setAttribute("aria-hidden", "false");
    launcher.setAttribute("aria-expanded", "true");
    input.focus();
  });

  closeButton.addEventListener("click", () => {
    panel.hidden = true;
    panel.setAttribute("aria-hidden", "true");
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitAnswer(input.value);
    input.value = "";
    input.focus();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) {
      closeButton.click();
    }
  });

  ask("¡Hola! 👋 Bienvenido a Sandra Díaz Travel. Soy el asistente virtual y estoy aquí para ayudarte a encontrar el viaje ideal. ¿Qué te gustaría hacer?", MENU_OPTIONS);
})();
