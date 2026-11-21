// Simulación Sandara × Anise — encabezado, pie, tarjetas, ficha y bolsa simulada.
(function () {
  const P = window.PRODUCTOS || [];
  const WA = "51949209933";
  const soles = (n) => "S/ " + n.toFixed(2);
  const porId = (id) => P.find((p) => p.id === id);

  const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const leer = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  let bolsa = parseInt(leer("sim-bolsa") || "0", 10) || 0;

  const icono = {
    ig: '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6"/></svg>',
    tk: '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 2.6 2.3 4.4 5 4.6"/></svg>',
    bolsa: '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    menu: '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>',
    ant: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4 7 12l8 8"/></svg>',
    sig: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 4 8 8-8 8"/></svg>',
  };

  const pagina = document.body.dataset.pagina;
  const categorias = ["Anillos", "Aretes", "Collares", "Cadenas", "Pulseras", "Piercings"];
  const catActual = new URLSearchParams(location.search).get("c");
  const enlCat = categorias.map((c) => [`coleccion.html?c=${encodeURIComponent(c)}`, c]);
  const enlaces = [...enlCat, ["index.html#atelier", "Atelier"]];
  const marcar = (t) => (pagina === "coleccion" && catActual === t ? ' aria-current="page"' : "");

  document.getElementById("cabecera").innerHTML = `
    <div class="redes"><a href="https://instagram.com/sandara.pe" aria-label="Instagram">${icono.ig}</a><a href="#" aria-label="TikTok">${icono.tk}</a></div>
    <details class="menu-movil"><summary aria-label="Menú">${icono.menu}</summary>
      <nav>
        <a class="grande" href="coleccion.html">Ver todo</a>
        ${enlCat.map(([h, t]) => `<a class="grande" href="${h}"${marcar(t)}>${t}</a>`).join("")}
        <div class="grupo">
          <a href="index.html">Inicio</a><a href="index.html#atelier">Atelier</a><a href="#contacto">Contacto</a>
          <a href="https://wa.me/${WA}">WhatsApp 949 209 933</a>
        </div>
      </nav></details>
    <div class="marca">
      <a href="index.html" aria-label="Sandara, inicio"><img src="img/logo-blanco.png" alt="Sandara"></a>
      <nav class="nav">${enlaces.map(([h, t]) => `<a href="${h}"${marcar(t)}>${t}</a>`).join("")}</nav>
    </div>
    <div class="acciones"><a class="bolsa" href="#" aria-label="Bolsa">${icono.bolsa}<span class="txt">Bolsa</span><span class="n" id="n-bolsa">${bolsa}</span></a></div>`;

  document.getElementById("pie").innerHTML = `
    <div class="contenedor" id="contacto">
      <div><img src="img/logo-blanco.png" alt="Sandara"><p>Joyería de autor en plata 950 y 925, elaborada en Sandara. Lima, Perú.</p></div>
      <div><h3>Contacto</h3><ul><li><a href="https://wa.me/${WA}">WhatsApp 949 209 933</a></li><li><a href="https://instagram.com/sandara.pe">Instagram</a></li><li>Lima, Perú</li></ul></div>
      <div><h3>Compras</h3><ul><li>Envíos a todo el Perú</li><li>Yape, Plin o transferencia</li><li>Cambios y cuidados</li></ul></div>
      <div class="legal"><span>© 2026 Sandara</span><span>Simulación local, no es el sitio publicado</span></div>
    </div>`;

  const temas = [["blanco", "Blanco"], ["contraste", "Blanco y gris"], ["perla", "Perla"], ["anise", "Anise"]];
  const sim = document.createElement("div");
  sim.className = "marca-sim";
  sim.setAttribute("role", "group"); sim.setAttribute("aria-label", "Color de la simulación");
  sim.innerHTML = `<span>Versión 2 · Color</span>` + temas.map(([k, t]) => `<button data-tema="${k}">${t}</button>`).join("");
  document.body.appendChild(sim);
  const ponerTema = (k) => {
    const raiz = document.documentElement;
    raiz.classList.add("sin-transiciones");
    raiz.dataset.tema = k;
    void raiz.offsetHeight; // fuerza el recálculo antes de devolver las transiciones
    const quitar = () => raiz.classList.remove("sin-transiciones");
    requestAnimationFrame(quitar); setTimeout(quitar, 60); // respaldo si la pestaña está en segundo plano
    sim.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.tema === k)));
    guardar("sim-tema", k);
  };
  ponerTema(new URLSearchParams(location.search).get("tema") || leer("sim-tema") || "blanco");
  sim.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => ponerTema(b.dataset.tema)));

  const tarjeta = (p) => `
    <a class="tarjeta" href="producto.html?p=${p.id}">
      <div class="foto"><img src="${p.imagenes[0]}" alt="${p.nombre}" loading="lazy">${p.imagenes[1] ? `<img src="${p.imagenes[1]}" alt="" loading="lazy">` : ""}</div>
      <div class="info"><div class="nombre">${p.nombre}</div><div class="linea">${p.linea}</div><div class="precio">${soles(p.precio)}</div></div>
    </a>`;

  document.querySelectorAll("[data-productos]").forEach((el) => {
    el.innerHTML = el.dataset.productos.split(",").map(porId).filter(Boolean).map(tarjeta).join("");
  });

  // ---------- Video de portada: respeta "reducir movimiento" ----------
  const video = document.querySelector(".portada video");
  if (video) {
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aplicar = () => {
      if (quieto.matches) { video.pause(); video.removeAttribute("autoplay"); }
      else { video.play().catch(() => {}); }
    };
    aplicar();
    quieto.addEventListener?.("change", aplicar);
  }

  // ---------- Colección ----------
  if (pagina === "coleccion") {
    const lista = catActual ? P.filter((p) => p.categoria === catActual) : P;
    document.title = (catActual || "Toda la colección") + " — Sandara";
    document.getElementById("titulo-col").textContent = catActual || "Toda la colección";
    document.getElementById("filtros").innerHTML = [["coleccion.html", "Todo", !catActual], ...enlCat.map(([h, t]) => [h, t, t === catActual])]
      .map(([h, t, a]) => `<a href="${h}"${a ? ' aria-current="page"' : ""}>${t}</a>`).join("");
    document.getElementById("grilla").innerHTML = lista.length
      ? lista.map(tarjeta).join("")
      : `<p class="vacio">La simulación solo tiene cinco piezas y ninguna es de ${catActual.toLowerCase()}. En la web real aquí salen todas las de esta categoría.<br><a class="enlace" href="coleccion.html">Ver toda la colección</a></p>`;
  }

  // ---------- Ficha ----------
  if (pagina === "producto") {
    const id = new URLSearchParams(location.search).get("p") || P[0].id;
    const p = porId(id) || P[0];
    document.title = p.nombre + " — Sandara";
    const partes = p.descripcion.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
    const material = partes.find((s) => /^Materiales?:/i.test(s)) || "";
    const resto = partes.filter((s) => s !== material && !/^Marca:/i.test(s));
    const intro = resto.filter((s) => !/^(Cuidados|Presentación|IMPORTANTE)/i.test(s));
    const extra = resto.filter((s) => /^(Cuidados|Presentación|IMPORTANTE)/i.test(s));

    document.getElementById("ficha").innerHTML = `
      <div class="galeria">
        <div class="foto">${p.imagenes.map((src, i) => `<img src="${src}" alt="${p.nombre}, foto ${i + 1}"${i === 0 ? ' class="activa"' : ""}>`).join("")}</div>
        ${p.imagenes.length > 1 ? `<button class="flecha ant" aria-label="Foto anterior">${icono.ant}</button><button class="flecha sig" aria-label="Foto siguiente">${icono.sig}</button>
        <div class="miniaturas">${p.imagenes.map((src, i) => `<button aria-label="Ver foto ${i + 1}" aria-current="${i === 0}"><img src="${src}" alt=""></button>`).join("")}</div>` : ""}
      </div>
      <div class="datos">
        <div class="linea">${p.linea}</div>
        <h1 class="titulo">${p.nombre}</h1>
        <div class="precio">${soles(p.precio)}</div>
        <div class="texto">${intro.map((s) => `<p>${s}</p>`).join("")}</div>
        <p class="material">${material}</p>
        <div class="compra">
          <div class="cantidad"><button aria-label="Quitar uno" data-d="-1">−</button><output id="cant">1</output><button aria-label="Agregar uno" data-d="1">+</button></div>
          <button class="boton" id="agregar">Agregar a la bolsa</button>
        </div>
        <a class="boton lleno whatsapp" id="wa" href="#">Pedir por WhatsApp</a>
        <div class="aviso" id="aviso" role="status" aria-live="polite"></div>
        <div class="envio">${extra.map((s) => `<p>${s}</p>`).join("")}<p>Envíos a todo el Perú. Pagas con Yape, Plin o transferencia y coordinamos la entrega por WhatsApp.</p></div>
      </div>`;

    let i = 0;
    const fotos = [...document.querySelectorAll(".galeria .foto img")];
    const minis = [...document.querySelectorAll(".miniaturas button")];
    const ir = (n) => {
      i = (n + fotos.length) % fotos.length;
      fotos.forEach((f, k) => f.classList.toggle("activa", k === i));
      minis.forEach((m, k) => m.setAttribute("aria-current", String(k === i)));
    };
    document.querySelector(".flecha.ant")?.addEventListener("click", () => ir(i - 1));
    document.querySelector(".flecha.sig")?.addEventListener("click", () => ir(i + 1));
    minis.forEach((m, k) => m.addEventListener("click", () => ir(k)));

    let cant = 1;
    const out = document.getElementById("cant");
    const wa = document.getElementById("wa");
    const actualizarWa = () => {
      const txt = `Hola Sandara, quiero ${cant} × ${p.nombre} (${soles(p.precio * cant)}).`;
      wa.href = `https://wa.me/${WA}?text=${encodeURIComponent(txt)}`;
    };
    document.querySelectorAll(".cantidad button").forEach((b) => b.addEventListener("click", () => {
      cant = Math.max(1, Math.min(9, cant + Number(b.dataset.d)));
      out.textContent = cant; actualizarWa();
    }));
    actualizarWa();
    const aviso = document.getElementById("aviso");
    document.getElementById("agregar").addEventListener("click", () => {
      bolsa += cant; guardar("sim-bolsa", String(bolsa));
      document.getElementById("n-bolsa").textContent = bolsa;
      aviso.textContent = `Agregado a tu bolsa: ${cant} × ${p.nombre}`;
      aviso.classList.add("visible");
      clearTimeout(aviso._t); aviso._t = setTimeout(() => aviso.classList.remove("visible"), 2600);
    });

    const otros = P.filter((x) => x.id !== p.id).slice(0, 3);
    document.getElementById("relacionados").innerHTML = otros.map(tarjeta).join("");
  }
})();
