(function () {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  /* -----------------------------------------------------------
     WHATSAPP LINKS
     Cualquier elemento con class="whatsapp-link" y un atributo
     data-service="Nombre del servicio" recibe automáticamente
     el href correcto con el mensaje prellenado.
  ----------------------------------------------------------- */
  function buildWhatsappUrl(serviceName) {
    const text = `${SITE_CONFIG.whatsappMessageBase}: ${serviceName}`;
    return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }

  function wireWhatsappLinks() {
    document.querySelectorAll(".whatsapp-link").forEach((el) => {
      const service = el.dataset.service || "información general";
      el.href = buildWhatsappUrl(service);
      el.target = "_blank";
      el.rel = "noopener";
    });
    const navWa = document.getElementById("nav-whatsapp");
    if (navWa) {
      navWa.href = buildWhatsappUrl("Cotización general");
    }
  }

  wireWhatsappLinks();

  /* -----------------------------------------------------------
     SANITY (headless CMS) — opcional
     Si SITE_CONFIG.sanity.useSanity = true, se jala servicios y
     materiales desde Sanity y se reemplaza el contenido de
     respaldo (el que ya está escrito en el HTML).

     Esquema esperado en Sanity (ver /sanity/schemas):
       _type == "service"  { title, description, order, active }
       _type == "material" { name, tag, description, order, active }
  ----------------------------------------------------------- */
  async function loadFromSanity() {
    const { projectId, dataset, apiVersion } = SITE_CONFIG.sanity;

    const servicesQuery = encodeURIComponent(
      `*[_type == "service" && active == true] | order(order asc){title, description}`
    );
    const materialsQuery = encodeURIComponent(
      `*[_type == "material" && active == true] | order(order asc){name, tag, description}`
    );
    const priceGroupsQuery = encodeURIComponent(
      `*[_type == "priceGroup" && active == true] | order(order asc){groupName, tag, items}`
    );

    const base = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}`;

    try {
      const [servicesRes, materialsRes, priceGroupsRes] = await Promise.all([
        fetch(`${base}?query=${servicesQuery}`),
        fetch(`${base}?query=${materialsQuery}`),
        fetch(`${base}?query=${priceGroupsQuery}`)
      ]);

      if (servicesRes.ok) {
        const { result } = await servicesRes.json();
        if (Array.isArray(result) && result.length) renderServices(result);
      }

      // Los grupos de precios tienen prioridad sobre "material" simple:
      // si hay priceGroups activos, se usan esos; si no, se cae a "material".
      let usedPriceGroups = false;
      if (priceGroupsRes.ok) {
        const { result } = await priceGroupsRes.json();
        if (Array.isArray(result) && result.length) {
          renderPriceGroups(result);
          usedPriceGroups = true;
        }
      }
      if (!usedPriceGroups && materialsRes.ok) {
        const { result } = await materialsRes.json();
        if (Array.isArray(result) && result.length) renderMaterials(result);
      }
    } catch (err) {
      // Si Sanity falla o no hay internet, se queda el contenido de respaldo del HTML.
      console.warn("No se pudo cargar contenido de Sanity, se muestra contenido de respaldo.", err);
    }
  }

  function formatPrice(value) {
    if (typeof value !== "number") return "";
    return "$" + value.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function renderPriceGroups(groups) {
    const container = document.getElementById("material-grid");
    container.innerHTML = "";
    container.classList.remove("material-grid");
    container.classList.add("price-groups");

    groups.forEach((group) => {
      const wrap = document.createElement("div");
      wrap.className = "price-group";

      const head = document.createElement("div");
      head.className = "price-group-head";
      head.innerHTML = `<span class="material-tag"></span><h3></h3>`;
      head.querySelector(".material-tag").textContent = group.tag || "";
      head.querySelector("h3").textContent = group.groupName;
      wrap.appendChild(head);

      const table = document.createElement("table");
      table.className = "price-table";
      table.innerHTML = `
        <thead><tr><th>Producto</th><th>Entrega</th><th>Costo</th></tr></thead>
        <tbody></tbody>
      `;
      const tbody = table.querySelector("tbody");
      (group.items || []).forEach((item) => {
        const tr = document.createElement("tr");
        const noteHtml = item.priceNote
          ? ` <span class="unit">${item.priceNote}</span>`
          : "";
        tr.innerHTML = `
          <td></td>
          <td></td>
          <td>${formatPrice(item.price)}${noteHtml}</td>
        `;
        tr.children[0].textContent = item.product || "";
        tr.children[1].textContent = item.deliveryTime || "";
        tbody.appendChild(tr);
      });
      wrap.appendChild(table);

      const link = document.createElement("a");
      link.href = "#";
      link.className = "service-link whatsapp-link";
      link.dataset.service = group.groupName;
      link.textContent = `Cotizar ${group.groupName.toLowerCase()} →`;
      link.href = buildWhatsappUrl(group.groupName);
      link.target = "_blank";
      link.rel = "noopener";
      wrap.appendChild(link);

      container.appendChild(wrap);
    });
  }

  function renderServices(services) {
    const grid = document.getElementById("service-grid");
    grid.innerHTML = "";
    services.forEach((s, i) => {
      const article = document.createElement("article");
      article.className = "service-card";
      article.innerHTML = `
        <span class="service-index">${String(i + 1).padStart(2, "0")}</span>
        <h3></h3>
        <p></p>
        <a href="#" class="service-link whatsapp-link" data-service="">Cotizar →</a>
      `;
      article.querySelector("h3").textContent = s.title;
      article.querySelector("p").textContent = s.description || "";
      const link = article.querySelector("a");
      link.dataset.service = s.title;
      link.href = buildWhatsappUrl(s.title);
      link.target = "_blank";
      link.rel = "noopener";
      grid.appendChild(article);
    });
  }

  function renderMaterials(materials) {
    const grid = document.getElementById("material-grid");
    grid.innerHTML = "";
    grid.classList.remove("price-groups");
    grid.classList.add("material-grid");
    materials.forEach((m) => {
      const card = document.createElement("div");
      card.className = "material-card";
      card.innerHTML = `
        <span class="material-tag"></span>
        <h3></h3>
        <p></p>
      `;
      card.querySelector(".material-tag").textContent = m.tag || "";
      card.querySelector("h3").textContent = m.name;
      card.querySelector("p").textContent = m.description || "";
      grid.appendChild(card);
    });
  }

  if (SITE_CONFIG.sanity.useSanity) {
    loadFromSanity();
  }
})();