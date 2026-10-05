const { useEffect, useState } = React;

const SERVICIOS = [
  { id: "inicial", titulo: "Asesoría inicial", texto: "Diagnóstico de tu caso y un plan claro de siguientes pasos." },
  { id: "tramites", titulo: "Gestión de trámites", texto: "Acompañamiento documental y seguimiento hasta el cierre." },
  { id: "cotizacion", titulo: "Cotizaciones", texto: "Presupuesto por servicio o paquete, con alcance por escrito." },
  { id: "citas", titulo: "Citas presenciales o virtuales", texto: "Agenda un espacio con Sandra Díaz según tu disponibilidad." },
  { id: "docs", titulo: "Revisión de documentos", texto: "Ordenamos tu expediente y te decimos qué falta." },
  { id: "seguimiento", titulo: "Seguimiento de caso", texto: "Actualizaciones, recordatorios y un canal directo de cliente." },
];

const DESTINOS = [
  {
    region: "Colombia · Caribe",
    nombre: "Cartagena",
    descripcion: "Murallas coloniales, calles llenas de color y el encanto del Caribe.",
    imagen: "https://images.unsplash.com/photo-1534943441045-1009d7cb0bb9?auto=format&fit=crop&w=2000&q=82",
    alt: "Calle colonial y torre de iglesia en Cartagena, Colombia",
  },
  {
    region: "Perú · Latinoamérica",
    nombre: "Machu Picchu",
    descripcion: "Historia inca y montañas andinas en un viaje inolvidable.",
    imagen: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=2000&q=82",
    alt: "Ruinas de Machu Picchu entre las montañas de Perú",
  },
  {
    region: "Francia · Europa",
    nombre: "París",
    descripcion: "Arquitectura, cafés y paseos a orillas del Sena.",
    imagen: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=82",
    alt: "Torre Eiffel y paisaje urbano de París",
  },
  {
    region: "Estados Unidos · Norteamérica",
    nombre: "Nueva York",
    descripcion: "Puentes, rascacielos y barrios que siempre tienen algo nuevo.",
    imagen: "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=2000&q=82",
    alt: "Puente de Brooklyn y horizonte de Manhattan en Nueva York",
  },
  {
    region: "República Dominicana · Caribe",
    nombre: "Punta Cana",
    descripcion: "Playas de arena clara, palmeras y mar turquesa.",
    imagen: "https://images.unsplash.com/photo-1504897264915-7a1d030ccd00?auto=format&fit=crop&w=2000&q=82",
    alt: "Playa de Punta Cana, República Dominicana",
  },
  {
    region: "Cuba · Caribe",
    nombre: "La Habana",
    descripcion: "Arquitectura colorida, música y el encanto de sus calles históricas.",
    imagen: "https://images.unsplash.com/photo-1570299437488-d430e1e677c7?auto=format&fit=crop&w=2000&q=82",
    alt: "Edificios coloridos en La Habana, Cuba",
  },
  {
    region: "México · Caribe",
    nombre: "Cancún",
    descripcion: "Costa caribeña, playas amplias y aguas azul intenso.",
    imagen: "https://images.unsplash.com/photo-1711220465753-2450b31ea318?auto=format&fit=crop&w=2000&q=82",
    alt: "Vista aérea de un resort y playa en Cancún, México",
  },
  {
    region: "Colombia · Caribe",
    nombre: "San Andrés",
    descripcion: "Palmeras y mar de siete colores en una isla para desconectarse.",
    imagen: "https://images.unsplash.com/photo-1592782985575-a96c6e647155?auto=format&fit=crop&w=2000&q=82",
    alt: "Palmeras en una playa de San Andrés, Colombia",
  },
  {
    region: "Colombia · Eje Cafetero",
    nombre: "Valle del Cocora",
    descripcion: "Palmas de cera, montañas verdes y senderos entre nubes.",
    imagen: "https://images.unsplash.com/photo-1737914692082-a421d0a39b81?auto=format&fit=crop&w=2000&q=82",
    alt: "Palmas de cera en el Valle del Cocora, Quindío",
  },
  {
    region: "Colombia · Antioquia",
    nombre: "Medellín",
    descripcion: "Miradores, cultura urbana y el clima de la ciudad de la eterna primavera.",
    imagen: "https://images.unsplash.com/photo-1512250431446-d0b4b57b27ec?auto=format&fit=crop&w=2000&q=82",
    alt: "Panorámica de Medellín entre las montañas de Antioquia",
  },
];

function api(path, options = {}) {
  return fetch(path, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  }).then(async (res) => {
    const json = await res.json().catch(() => ({ ok: false, error: "Respuesta inválida" }));
    if (!json.ok) {
      const err = new Error(json.error || "Error");
      err.status = res.status;
      throw err;
    }
    return json.data;
  });
}

function Nav({ page, setPage, user, onLogout }) {
  const go = (p) => () => setPage(p);
  return (
    <header className="nav">
      <a className="brand" href="#inicio" onClick={go("inicio")}>Agencia Sandra Díaz</a>
      <ul className="nav-links">
        <li><button className={page === "inicio" ? "active" : ""} onClick={go("inicio")}>Inicio</button></li>
        <li><button className={page === "servicios" ? "active" : ""} onClick={go("servicios")}>Servicios</button></li>
        <li><button className={page === "asesora" ? "active" : ""} onClick={go("asesora")}>La asesora</button></li>
        <li><button className={page === "contacto" ? "active" : ""} onClick={go("contacto")}>Contacto</button></li>
        {user ? (
          <>
            <li><button className={page === "panel" ? "active" : ""} onClick={go("panel")}>Mi espacio</button></li>
            <li><button onClick={onLogout}>Salir</button></li>
          </>
        ) : (
          <li><button className="btn ghost" onClick={go("acceso")}>Acceso clientes</button></li>
        )}
      </ul>
    </header>
  );
}

function Inicio({ setPage }) {
  const [destinoActivo, setDestinoActivo] = useState(0);
  const [carruselPausado, setCarruselPausado] = useState(false);
  const destino = DESTINOS[destinoActivo];

  useEffect(() => {
    if (carruselPausado || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setDestinoActivo((actual) => (actual + 1) % DESTINOS.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [carruselPausado]);

  const cambiarDestino = (avance) => {
    setDestinoActivo((actual) => (actual + avance + DESTINOS.length) % DESTINOS.length);
  };

  return (
    <>
      <section
        className="hero hero-carousel"
        onMouseEnter={() => setCarruselPausado(true)}
        onMouseLeave={() => setCarruselPausado(false)}
        onFocus={() => setCarruselPausado(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setCarruselPausado(false);
        }}
        aria-label="Destinos turísticos destacados"
      >
        <div className="hero-slides" aria-hidden="true">
          {DESTINOS.map((item, index) => (
            <img
              key={item.nombre}
              className={`hero-image ${index === destinoActivo ? "is-active" : ""}`}
              src={item.imagen}
              alt=""
              loading={index === 0 ? "eager" : "lazy"}
            />
          ))}
        </div>
        <div className="hero-copy">
          <p className="eyebrow">{destino.region}</p>
          <h1 aria-live="polite">{destino.nombre}</h1>
          <p className="lead">{destino.descripcion}</p>
          <p>
            <button className="btn" onClick={() => setPage("acceso")}>Ingresar al portal</button>
            {" "}
            <button className="btn ghost" onClick={() => setPage("servicios")}>Ver opciones</button>
          </p>
          <div className="hero-carousel-controls" role="group" aria-label="Controles de destinos">
            <button className="hero-carousel-arrow" type="button" onClick={() => cambiarDestino(-1)} aria-label="Destino anterior">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <span className="hero-carousel-count">{String(destinoActivo + 1).padStart(2, "0")} / {String(DESTINOS.length).padStart(2, "0")}</span>
            <div
              className="hero-carousel-progress"
              role="progressbar"
              aria-label="Progreso de destinos"
              aria-valuemin="1"
              aria-valuemax={DESTINOS.length}
              aria-valuenow={destinoActivo + 1}
            >
              <span style={{ width: `${((destinoActivo + 1) / DESTINOS.length) * 100}%` }} />
            </div>
            <button className="hero-carousel-arrow" type="button" onClick={() => cambiarDestino(1)} aria-label="Siguiente destino">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        </div>
      </section>
      <section className="section alt">
        <p className="eyebrow">Para clientes</p>
        <h2>Navega por lo que necesitas hoy</h2>
        <div className="grid">
          {SERVICIOS.slice(0, 3).map((s) => (
            <article className="card" key={s.id}>
              <h3>{s.titulo}</h3>
              <p>{s.texto}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function Servicios() {
  return (
    <section className="section">
      <p className="eyebrow">Catálogo</p>
      <h2>Opciones para tu trámite o consulta</h2>
      <div className="grid">
        {SERVICIOS.map((s) => (
          <article className="card" key={s.id}>
            <h3>{s.titulo}</h3>
            <p>{s.texto}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Asesora() {
  return (
    <section className="section split">
      <div>
        <p className="eyebrow">Quién te atiende</p>
        <h2>Sandra Díaz</h2>
        <p className="lead">
          Asesora de la agencia. Trabaja con expedientes ordenados, citas puntuales y un lenguaje
          directo: qué conviene, qué falta y cuál es el siguiente paso.
        </p>
        <p>Atención presencial y virtual. Cada cliente tiene un panel propio después de registrarse.</p>
      </div>
      <div className="portrait">
        <img
          src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85"
          alt="Paisaje de montaña junto a un lago"
        />
        <span>Contacto profesional</span>
        <strong>sandra.diaz@agencia.test</strong>
      </div>
    </section>
  );
}

function Contacto({ user }) {
  const [form, setForm] = useState({
    nombre: user?.nombre || "",
    email: user?.email || "",
    telefono: user?.telefono || "",
    asunto: "Consulta general",
    mensaje: "",
  });
  const [msg, setMsg] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setMsg(null);
    api("api/contact.php", { method: "POST", body: form })
      .then(() => setMsg({ ok: true, text: "Mensaje enviado. Sandra o el equipo te responden." }))
      .catch((err) => setMsg({ ok: false, text: err.message }));
  };

  return (
    <section className="section">
      <p className="eyebrow">Escríbenos</p>
      <h2>Contacto</h2>
      {msg && <p className={"notice " + (msg.ok ? "ok" : "error")}>{msg.text}</p>}
      <form className="form" onSubmit={submit}>
        <label>Nombre<input name="nombre" value={form.nombre} onChange={onChange} required /></label>
        <label>Correo<input name="email" type="email" value={form.email} onChange={onChange} required /></label>
        <label>Teléfono<input name="telefono" value={form.telefono} onChange={onChange} /></label>
        <label>Asunto<input name="asunto" value={form.asunto} onChange={onChange} required /></label>
        <label>Mensaje<textarea name="mensaje" rows="5" value={form.mensaje} onChange={onChange} required /></label>
        <button className="btn gold" type="submit">Enviar</button>
      </form>
    </section>
  );
}

function Acceso({ onAuth }) {
  const [modo, setModo] = useState("login");
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setError("");
    const action = modo === "login" ? "login" : "register";
    api("api/auth.php?action=" + action, { method: "POST", body: form })
      .then((data) => onAuth(data.user))
      .catch((err) => setError(err.message));
  };

  return (
    <section className="section">
      <p className="eyebrow">Portal de clientes</p>
      <h2>{modo === "login" ? "Iniciar sesión" : "Crear cuenta"}</h2>
      {error && <p className="notice error">{error}</p>}
      <form className="form" onSubmit={submit}>
        {modo === "register" && (
          <>
            <label>Nombre completo<input name="nombre" value={form.nombre} onChange={onChange} required /></label>
            <label>Teléfono<input name="telefono" value={form.telefono} onChange={onChange} /></label>
          </>
        )}
        <label>Correo<input name="email" type="email" value={form.email} onChange={onChange} required /></label>
        <label>Contraseña<input name="password" type="password" value={form.password} onChange={onChange} required /></label>
        <button className="btn" type="submit">{modo === "login" ? "Entrar" : "Registrarme"}</button>
      </form>
      <p>
        <button className="linkish" onClick={() => setModo(modo === "login" ? "register" : "login")}>
          {modo === "login" ? "¿No tienes cuenta? Regístrate" : "Ya tengo cuenta"}
        </button>
      </p>
    </section>
  );
}

function Panel({ user }) {
  const [tab, setTab] = useState("inicio");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [cita, setCita] = useState({ servicio: SERVICIOS[0].titulo, fecha: "", hora: "10:00", notas: "" });
  const [cot, setCot] = useState({ titulo: "", detalle: "" });
  const [flash, setFlash] = useState("");

  const load = () => {
    api("api/panel.php")
      .then(setData)
      .catch((err) => setError(err.message));
  };

  useEffect(() => { load(); }, []);

  const pedirCita = (e) => {
    e.preventDefault();
    setFlash("");
    api("api/citas.php", { method: "POST", body: cita })
      .then(() => { setFlash("Cita solicitada."); load(); })
      .catch((err) => setError(err.message));
  };

  const pedirCot = (e) => {
    e.preventDefault();
    setFlash("");
    api("api/cotizaciones.php", { method: "POST", body: cot })
      .then(() => { setFlash("Cotización enviada."); setCot({ titulo: "", detalle: "" }); load(); })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="dash">
      <aside className="side">
        <p className="eyebrow">Hola, {user.nombre.split(" ")[0]}</p>
        {[
          ["inicio", "Resumen"],
          ["cita", "Agendar cita"],
          ["documentos", "Documentos"],
          ["cotizacion", "Cotizaciones"],
          ["perfil", "Perfil"],
        ].map(([id, label]) => (
          <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>{label}</button>
        ))}
      </aside>
      <div className="main">
        {error && <p className="notice error">{error}</p>}
        {flash && <p className="notice ok">{flash}</p>}
        {tab === "inicio" && (
          <>
            <h2>Tu espacio de cliente</h2>
            <div className="grid">
              {(data?.opciones || []).map((o) => (
                <article className="panel-card" key={o.id}>
                  <h3>{o.titulo}</h3>
                  <p>{o.texto}</p>
                  <p><button className="btn ghost" onClick={() => setTab(o.id === "cita" ? "cita" : o.id)}>{o.titulo}</button></p>
                </article>
              ))}
            </div>
          </>
        )}
        {tab === "cita" && (
          <>
            <h2>Agendar cita con Sandra Díaz</h2>
            <form className="form" onSubmit={pedirCita}>
              <label>Servicio
                <select value={cita.servicio} onChange={(e) => setCita({ ...cita, servicio: e.target.value })}>
                  {SERVICIOS.map((s) => <option key={s.id}>{s.titulo}</option>)}
                </select>
              </label>
              <label>Fecha<input type="date" value={cita.fecha} onChange={(e) => setCita({ ...cita, fecha: e.target.value })} required /></label>
              <label>Hora<input type="time" value={cita.hora} onChange={(e) => setCita({ ...cita, hora: e.target.value })} required /></label>
              <label>Notas<textarea rows="3" value={cita.notas} onChange={(e) => setCita({ ...cita, notas: e.target.value })} /></label>
              <button className="btn gold" type="submit">Solicitar cita</button>
            </form>
            <h3>Tus citas</h3>
            <div className="list">
              {(data?.citas || []).map((c) => (
                <div className="row" key={c.id}>
                  <div>
                    <strong>{c.servicio}</strong>
                    <div>{c.fecha} · {c.hora}</div>
                  </div>
                  <span className="badge">{c.estado}</span>
                </div>
              ))}
            </div>
          </>
        )}
        {tab === "documentos" && (
          <>
            <h2>Documentos</h2>
            {(data?.documentos || []).map((d) => (
              <div className="row" key={d.id}>
                <div>
                  <strong>{d.nombre}</strong>
                  <div>{d.tipo}</div>
                </div>
                <span className="badge">{d.estado}</span>
              </div>
            ))}
          </>
        )}
        {tab === "cotizacion" && (
          <>
            <h2>Pedir cotización</h2>
            <form className="form" onSubmit={pedirCot}>
              <label>Título<input value={cot.titulo} onChange={(e) => setCot({ ...cot, titulo: e.target.value })} required /></label>
              <label>Detalle<textarea rows="4" value={cot.detalle} onChange={(e) => setCot({ ...cot, detalle: e.target.value })} required /></label>
              <button className="btn" type="submit">Enviar solicitud</button>
            </form>
            {(data?.cotizaciones || []).map((c) => (
              <div className="row" key={c.id}>
                <div>
                  <strong>{c.titulo}</strong>
                  <div>{c.detalle}</div>
                </div>
                <span className="badge">{c.estado}{c.monto ? ` · $${c.monto}` : ""}</span>
              </div>
            ))}
          </>
        )}
        {tab === "perfil" && (
          <>
            <h2>Perfil</h2>
            <p><strong>{user.nombre}</strong></p>
            <p>{user.email}</p>
            <p>{user.telefono || "Sin teléfono"}</p>
          </>
        )}
      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState("inicio");
  const [user, setUser] = useState(null);

  useEffect(() => {
    api("api/auth.php?action=me")
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  const logout = () => {
    api("api/auth.php?action=logout", { method: "POST" }).finally(() => {
      setUser(null);
      setPage("inicio");
    });
  };

  const onAuth = (u) => {
    setUser(u);
    setPage("panel");
  };

  return (
    <div className="shell">
      <Nav page={page} setPage={setPage} user={user} onLogout={logout} />
      {page === "inicio" && <Inicio setPage={setPage} />}
      {page === "servicios" && <Servicios />}
      {page === "asesora" && <Asesora />}
      {page === "contacto" && <Contacto user={user} />}
      {page === "acceso" && <Acceso onAuth={onAuth} />}
      {page === "panel" && user && <Panel user={user} />}
      {page === "panel" && !user && <Acceso onAuth={onAuth} />}
      <footer>Agencia Sandra Díaz · Viajes y turismo</footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
