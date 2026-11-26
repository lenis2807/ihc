(function () {
  "use strict";

  const store = window.ShareRoomStore;
  const IMAGE_BASE = "../../img/rooms/";

  function byId(id) {
    return document.getElementById(id);
  }

  function setMessage(element, message, isError) {
    if (!element) return;
    element.textContent = message;
    element.classList.toggle("is-error", Boolean(isError));
    element.hidden = !message;
  }

  function showPageError(error) {
    const main = document.querySelector("main");
    if (!main) return;
    let message = main.querySelector("[data-page-error]");
    if (!message) {
      message = document.createElement("p");
      message.className = "app-message app-message--error";
      message.setAttribute("role", "alert");
      message.dataset.pageError = "";
      main.prepend(message);
    }
    message.textContent = error instanceof Error ? error.message : String(error);
  }

  function formatDateTime(value) {
    return new Intl.DateTimeFormat("es-PE", {
      dateStyle: "long",
      timeStyle: "short"
    }).format(new Date(value));
  }

  function formatPrice(value) {
    return `S/ ${new Intl.NumberFormat("es-PE").format(value)}`;
  }

  function make(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function getCheckedValues(form, name) {
    return Array.from(form.querySelectorAll(`[name="${name}"]:checked`), (input) => input.value);
  }

  function searchFilters() {
    const filterForm = document.querySelector(".filters__form");
    return {
      location: byId("ubicacion").value,
      minPrice: byId("presupuesto-min").value,
      maxPrice: byId("presupuesto-max").value,
      types: getCheckedValues(filterForm, "tipo"),
      services: getCheckedValues(filterForm, "servicios"),
      rules: getCheckedValues(filterForm, "convivencia")
    };
  }

  function makeRoomCard(room, favoriteIds) {
    const article = make("article", "room-card");
    const link = make("a", "room-card__link");
    link.href = `detail.html?id=${encodeURIComponent(room.id)}`;

    const image = make("img", "room-card__img");
    image.src = `${IMAGE_BASE}${room.image}`;
    image.alt = room.title;
    image.loading = "lazy";

    const body = make("div", "room-card__body");
    body.append(
      make("h2", "room-card__title", room.title),
      make("p", "room-card__place", `${room.district} · ${room.nearby}`),
      make("p", "room-card__services", room.amenities.join(" · "))
    );
    const price = make("p", "room-card__price");
    price.append(document.createTextNode(`${formatPrice(room.price)} `), make("span", "", "/ mes"));
    body.append(price);
    link.append(image, body);

    const favorite = make("button", "room-card__favorite", favoriteIds.includes(room.id) ? "♥ Guardado" : "♡ Guardar");
    favorite.type = "button";
    favorite.dataset.favoriteRoom = room.id;
    favorite.setAttribute("aria-pressed", String(favoriteIds.includes(room.id)));
    favorite.setAttribute("aria-label", `${favoriteIds.includes(room.id) ? "Quitar de" : "Agregar a"} favoritos: ${room.title}`);

    article.append(link, favorite);
    return article;
  }

  function renderSearchResults() {
    const list = document.querySelector(".results__list");
    const filters = searchFilters();
    const results = store.getRooms(filters);
    const favoriteIds = store.getFavoriteRoomIds();
    const desktopTitle = document.querySelector(".results__title .label-desktop");
    const mobileTitle = document.querySelector(".results__title .label-mobile");
    const meta = document.querySelector(".results__meta");
    list.replaceChildren();

    desktopTitle.textContent = "Habitaciones disponibles";
    mobileTitle.textContent = `${results.length} ${results.length === 1 ? "habitación" : "habitaciones"}`;
    meta.textContent = `${results.length} ${results.length === 1 ? "resultado" : "resultados"}`;
    setMessage(
      document.querySelector("[data-search-status]"),
      `${results.length} ${results.length === 1 ? "habitación encontrada" : "habitaciones encontradas"}.`,
      false
    );
    const activeFilters = filters.types.length + filters.services.length + filters.rules.length +
      Number(filters.minPrice !== "") + Number(filters.maxPrice !== "");
    document.querySelector("[data-filter-count]").textContent = `Filtros ${activeFilters}`;

    if (results.length) {
      results.forEach((room) => list.append(makeRoomCard(room, favoriteIds)));
    } else {
      const empty = make("div", "results__empty");
      empty.append(
        make("h2", "results__empty-title", "No se encontraron resultados"),
        make("p", "", "Prueba cambiando la zona, el presupuesto o los servicios.")
      );
      const modify = make("a", "btn btn--outline", "Modificar filtros");
      modify.href = "#filtros";
      empty.append(modify);
      list.append(empty);
    }

    const mapTitle = document.querySelector(".map__title");
    if (mapTitle) {
      const locationCount = results.length === 1 ? "ubicación" : "ubicaciones";
      mapTitle.textContent = `Vista de mapa · ${results.length} ${locationCount} de ejemplo`;
    }
    const zones = document.querySelector(".map__zones");
    if (zones) {
      zones.textContent = results.length
        ? Array.from(new Set(results.map((room) => room.district))).join(" · ")
        : "No hay ubicaciones para mostrar";
    }
    const mapPrices = document.querySelector(".map__prices");
    if (mapPrices) {
      mapPrices.replaceChildren(...results.map((room) => {
        const item = make("li");
        const link = make("a", "chip", formatPrice(room.price));
        link.href = `detail.html?id=${encodeURIComponent(room.id)}`;
        item.append(link);
        return item;
      }));
    }
  }

  function initializeSearch() {
    const searchForm = document.querySelector(".room-search__form");
    const filtersForm = document.querySelector(".filters__form");
    const query = new URLSearchParams(window.location.search).get("ubicacion");
    if (query) byId("ubicacion").value = query;
    const minPrice = byId("presupuesto-min");
    const maxPrice = byId("presupuesto-max");
    const updatePriceBounds = () => {
      maxPrice.min = minPrice.value || "0";
      minPrice.max = maxPrice.value;
    };
    minPrice.addEventListener("input", updatePriceBounds);
    maxPrice.addEventListener("input", updatePriceBounds);

    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!filtersForm.reportValidity()) return;
      renderSearchResults();
    });
    filtersForm.addEventListener("submit", (event) => {
      event.preventDefault();
      renderSearchResults();
    });
    filtersForm.addEventListener("reset", () => {
      window.setTimeout(() => {
        byId("ubicacion").value = "";
        updatePriceBounds();
        renderSearchResults();
      }, 0);
    });

    document.querySelector(".results__list").addEventListener("click", (event) => {
      const button = event.target.closest("[data-favorite-room]");
      if (!button) return;
      try {
        store.toggleFavorite(button.dataset.favoriteRoom);
        renderSearchResults();
      } catch (error) {
        showPageError(error);
      }
    });

    renderSearchResults();
  }

  function updateFavoriteButton(button, isSaved) {
    button.setAttribute("aria-pressed", String(isSaved));
    button.querySelector(".detail__save-text--idle").hidden = isSaved;
    button.querySelector(".detail__save-text--done").hidden = !isSaved;
    button.classList.toggle("is-saved", isSaved);
  }

  function renderDetail(roomId) {
    const room = store.getRooms().find((item) => item.id === roomId);
    if (!room) {
      const unavailable = document.querySelector(".detail__unavailable");
      unavailable.textContent = "No se encontró la habitación solicitada.";
      unavailable.hidden = false;
      document.querySelectorAll(".detail__crumbs, .detail__actions, .detail__gallery, .detail__info, .detail__ratings, .detail__side")
        .forEach((section) => { section.hidden = true; });
      return;
    }
    document.title = `${room.title} | ShareRoom`;
    byId("detail-title").textContent = room.title;
    document.querySelector(".detail__place").textContent = `${room.address} · ${room.nearby}`;
    document.querySelector(".detail__price").replaceChildren(
      document.createTextNode(`${formatPrice(room.price)} `),
      make("span", "", "/ mes")
    );
    document.querySelectorAll(".detail__cost dd").forEach((amount) => {
      amount.textContent = formatPrice(room.price);
    });
    document.querySelector(".detail__description").textContent = room.description;
    document.querySelector(".detail__owner-name").textContent = `Publicado por ${room.owner}`;
    const ownerImage = document.querySelector(".detail__owner-img");
    ownerImage.src = `../../img/profiles/${room.ownerImage}`;
    ownerImage.alt = `Foto de ${room.owner}`;
    document.querySelector(".detail__photo--main").src = `${IMAGE_BASE}${room.image}`;
    document.querySelector(".detail__photo--main").alt = room.title;
    document.querySelector(".detail__amenities").replaceChildren(
      ...room.amenities.map((amenity) => make("li", "detail__amenity", amenity))
    );
    document.querySelector(".detail__tags").replaceChildren(
      ...room.rules.map((rule) => make("li", "detail__tag", rule.replaceAll("-", " ")))
    );
    document.querySelector(".detail__crumbs [aria-current='page']").textContent = room.district;
    document.querySelector(".detail__unavailable").hidden = true;

    const favoriteButton = document.querySelector(".detail__save");
    updateFavoriteButton(favoriteButton, store.getFavoriteRoomIds().includes(roomId));
    favoriteButton.onclick = () => {
      try {
        updateFavoriteButton(favoriteButton, store.toggleFavorite(roomId));
      } catch (error) {
        showPageError(error);
      }
    };

    document.querySelectorAll(".detail__review").forEach((link) => {
      link.href = `review.html?id=${encodeURIComponent(roomId)}`;
    });
    renderRoomReviews(roomId);
    renderAvailableSlots(roomId);

    const visitForm = document.querySelector("[data-visit-form]");
    visitForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = document.querySelector("[data-visit-message]");
      try {
        store.scheduleVisit(roomId, visitForm.elements.slot.value);
        setMessage(status, "Visita programada. El aviso al anfitrión quedó guardado localmente en este navegador.", false);
        renderAvailableSlots(roomId);
      } catch (error) {
        setMessage(status, error.message, true);
        renderAvailableSlots(roomId);
      }
    });
  }

  function renderAvailableSlots(roomId, visitId) {
    const select = byId("visit-slot");
    const slots = store.getAvailableSlots(roomId, visitId);
    select.replaceChildren(new Option("Selecciona fecha y horario", ""));
    slots.forEach((slot) => select.add(new Option(formatDateTime(slot), slot)));
    select.disabled = slots.length === 0;
    document.querySelector("[data-visit-submit]").disabled = slots.length === 0;
    setMessage(
      document.querySelector("[data-no-slots]"),
      slots.length ? "" : "No hay horarios disponibles por ahora. Vuelve a revisar más adelante.",
      false
    );
  }

  function renderRoomReviews(roomId) {
    const reviews = store.getReviews(roomId);
    const opinions = document.querySelector(".detail__opinions");
    const average = reviews.length
      ? (reviews.reduce((total, review) => total + review.rating, 0) / reviews.length).toFixed(1)
      : "—";
    document.querySelector(".detail__score-number").textContent = average;
    document.querySelector(".detail__stars").textContent = reviews.length ? "★★★★★" : "☆☆☆☆☆";
    document.querySelector(".detail__stars").setAttribute(
      "aria-label",
      reviews.length ? `${average} de 5 estrellas` : "Aún no hay calificaciones"
    );
    document.querySelector(".detail__score-count").textContent = `${reviews.length} ${reviews.length === 1 ? "reseña" : "reseñas"}`;
    opinions.replaceChildren();

    if (!reviews.length) {
      opinions.append(make("p", "detail__review-empty", "Aún no hay reseñas para esta habitación."));
      return;
    }
    reviews.forEach((review) => {
      const article = make("article", "detail__opinion");
      article.append(
        make("strong", "", review.author),
        make("p", "detail__opinion-stars", `${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}`),
        make("p", "", review.comment)
      );
      opinions.append(article);
    });
  }

  function makeFavoriteCard(room) {
    const article = make("article", "saved-room");
    const link = make("a", "saved-room__link");
    link.href = `../rooms/detail.html?id=${encodeURIComponent(room.id)}`;
    const image = make("img");
    image.src = `${IMAGE_BASE}${room.image}`;
    image.alt = room.title;
    const details = make("span");
    details.append(
      make("strong", "", room.title),
      make("small", "", `${room.district} · ${room.nearby}`),
      make("small", "", room.amenities.join(" · ")),
      make("b", "", `${formatPrice(room.price)} al mes`)
    );
    link.append(image, details);

    const remove = make("button", "saved-room__remove", "Quitar");
    remove.type = "button";
    remove.dataset.removeFavorite = room.id;
    remove.setAttribute("aria-label", `Quitar ${room.title} de favoritos`);
    article.append(link, remove);
    return article;
  }

  function renderFavorites() {
    const ids = store.getFavoriteRoomIds();
    const rooms = ids.map((id) => store.getRoomById(id));
    const grid = document.querySelector(".favorites__grid");
    grid.replaceChildren(...rooms.map(makeFavoriteCard));
    const count = document.querySelector("[data-favorites-count]");
    count.textContent = `${rooms.length} ${rooms.length === 1 ? "habitación guardada" : "habitaciones guardadas"}`;
    document.querySelector("[data-favorites-empty]").hidden = rooms.length > 0;

    grid.onclick = (event) => {
      const button = event.target.closest("[data-remove-favorite]");
      if (!button) return;
      try {
        store.toggleFavorite(button.dataset.removeFavorite);
        renderFavorites();
      } catch (error) {
        showPageError(error);
      }
    };
  }

  function makeVisitCard(visit) {
    const room = store.getRoomById(visit.roomId);
    const article = make("article", `visit-card visit-card--${visit.status}`);
    const heading = make("div", "visit-card__heading");
    heading.append(
      make("h2", "", room.title),
      make("span", "visit-card__status", {
        scheduled: "Programada",
        completed: "Realizada",
        cancelled: "Cancelada"
      }[visit.status])
    );
    article.append(heading, make("p", "visit-card__place", `${room.district} · ${room.owner}`));
    const time = make("p", "visit-card__time", formatDateTime(visit.dateTime));
    article.append(time);
    if (visit.demo) article.append(make("small", "visit-card__demo", "Visita de ejemplo"));

    if (visit.status === "scheduled") {
      const form = make("form", "visit-card__form");
      form.dataset.rescheduleVisit = visit.id;
      const label = make("label", "", "Nuevo horario");
      const select = make("select", "");
      select.name = "slot";
      select.required = true;
      select.append(new Option("Selecciona un horario", ""));
      store.getAvailableSlots(visit.roomId, visit.id).forEach((slot) => {
        select.add(new Option(slot === visit.dateTime ? `${formatDateTime(slot)} (actual)` : formatDateTime(slot), slot));
      });
      label.append(select);
      const controls = make("div", "visit-card__actions");
      const reschedule = make("button", "btn btn--primary", "Reprogramar");
      reschedule.type = "submit";
      reschedule.disabled = select.options.length <= 1;
      const cancel = make("button", "btn btn--outline", "Cancelar visita");
      cancel.type = "button";
      cancel.dataset.cancelVisit = visit.id;
      controls.append(reschedule, cancel);
      form.append(label, controls);
      article.append(form);
    } else if (visit.status === "completed") {
      article.append(make("p", "visit-card__note", "Esta visita ya se realizó y no se puede modificar ni cancelar."));
    } else {
      article.append(make("p", "visit-card__note", "El horario quedó disponible nuevamente."));
    }
    return article;
  }

  function renderVisits() {
    const list = document.querySelector("[data-visits-list]");
    const visits = store.getVisits();
    list.replaceChildren();
    if (!visits.length) {
      list.append(make("p", "app-message", "Todavía no tienes visitas. Busca una habitación y coordina un horario."));
      return;
    }
    visits.forEach((visit) => list.append(makeVisitCard(visit)));

    list.onsubmit = (event) => {
      const form = event.target.closest("[data-reschedule-visit]");
      if (!form) return;
      event.preventDefault();
      try {
        store.rescheduleVisit(form.dataset.rescheduleVisit, form.elements.slot.value);
        setMessage(document.querySelector("[data-visits-status]"), "La visita se reprogramó y se guardó un aviso local para el anfitrión.", false);
        renderVisits();
      } catch (error) {
        setMessage(document.querySelector("[data-visits-status]"), error.message, true);
      }
    };
    list.onclick = (event) => {
      const button = event.target.closest("[data-cancel-visit]");
      if (!button) return;
      try {
        store.cancelVisit(button.dataset.cancelVisit);
        setMessage(document.querySelector("[data-visits-status]"), "La visita se canceló y se guardó un aviso local para el anfitrión.", false);
        renderVisits();
      } catch (error) {
        setMessage(document.querySelector("[data-visits-status]"), error.message, true);
      }
    };
  }

  function renderHostNotifications() {
    const list = document.querySelector("[data-local-notifications]");
    const notices = store.getHostNotifications();
    list.replaceChildren();
    if (!notices.length) {
      list.append(make("p", "notifications__local-empty", "Aún no hay avisos locales sobre visitas."));
      return;
    }

    notices.forEach((notice) => {
      const room = store.getRoomById(notice.roomId);
      const action = {
        scheduled: "Nueva visita programada",
        rescheduled: "Visita reprogramada",
        cancelled: "Visita cancelada"
      }[notice.action];
      const article = make("article", "notification-card notification-card--local");
      const body = make("div", "notification-card__body");
      const heading = make("div", "notification-card__heading");
      heading.append(make("strong", "", `${action} · ${room.title}`), make("time", "", formatDateTime(notice.createdAt)));
      body.append(
        heading,
        make("p", "", `Horario: ${formatDateTime(notice.dateTime)}. Aviso registrado localmente; no se envió fuera de este navegador.`)
      );
      article.append(make("div", "notification-card__type", "⌂"), body);
      list.append(article);
    });
  }

  function initializeReview() {
    const roomId = new URLSearchParams(window.location.search).get("id") || "room-pueblo-libre";
    const room = store.getRoomById(roomId);
    document.querySelector(".review__stay-title").textContent = room.title;
    document.querySelector(".review__stay-meta").textContent = `Anfitrión: ${room.owner}`;
    document.querySelector(".review__stay-img").src = `${IMAGE_BASE}${room.image}`;
    document.querySelector(".review__stay-img").alt = room.title;

    const list = document.querySelector("[data-my-reviews]");
    const renderMyReviews = () => {
      const reviews = store.getReviews(roomId).filter((review) => review.author === "Ana Valdez");
      list.replaceChildren();
      if (!reviews.length) {
        list.append(make("p", "review__notice-text", "Aún no has publicado una reseña para esta habitación."));
        return;
      }
      reviews.forEach((review) => {
        const article = make("article", "review__done");
        article.append(
          make("p", "review__done-score", `${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)} · ${review.rating}/5`),
          make("p", "review__done-quote", review.comment),
          make("p", "review__done-meta", `Enviada el ${new Intl.DateTimeFormat("es-PE", { dateStyle: "medium" }).format(new Date(review.createdAt))}`)
        );
        list.append(article);
      });
    };
    renderMyReviews();

    const ratingText = document.querySelector(".review__rating-text");
    document.querySelector(".review__rating").addEventListener("change", (event) => {
      if (event.target.name !== "calificacion") return;
      const labels = ["", "Necesita mejorar", "Regular", "Buena", "Muy buena", "Excelente"];
      ratingText.textContent = `${event.target.value}/5 · ${labels[Number(event.target.value)]}`;
    });

    document.querySelector("[data-review-form]").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      try {
        store.addReview(roomId, Number(form.elements.calificacion.value), form.elements.comentario.value);
        setMessage(document.querySelector("[data-review-message]"), "Tu reseña quedó guardada en este navegador.", false);
        renderMyReviews();
      } catch (error) {
        setMessage(document.querySelector("[data-review-message]"), error.message, true);
      }
    });
    document.querySelector(".review__back-link").href = `detail.html?id=${encodeURIComponent(roomId)}`;
  }

  function initialize() {
    if (!store) {
      showPageError(new Error("No se pudo cargar el almacenamiento local de ShareRoom."));
      return;
    }
    try {
      switch (document.body.dataset.page) {
        case "search":
          initializeSearch();
          break;
        case "detail":
          renderDetail(new URLSearchParams(window.location.search).get("id") || "room-pueblo-libre");
          break;
        case "favorites":
          renderFavorites();
          break;
        case "visits":
          renderVisits();
          break;
        case "review":
          initializeReview();
          break;
        case "notifications":
          renderHostNotifications();
          break;
        default:
          break;
      }
    } catch (error) {
      showPageError(error);
    }
  }

  document.addEventListener("DOMContentLoaded", initialize);
})();