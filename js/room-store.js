(function (root) {
  "use strict";

  const STORAGE_KEY = "shareroom.local.v1";
  const VISIT_TIMES = ["10:00", "13:00", "16:00"];
  const MAX_DAYS_AHEAD = 14;
  const ROOMS = [
    {
      id: "room-pucp",
      title: "Habitación amplia cerca a PUCP",
      district: "San Miguel",
      location: "San Miguel",
      nearby: "A 8 min caminando de la PUCP",
      price: 980,
      type: "privada",
      image: "room-01.png",
      ownerImage: "carlos.png",
      services: ["wifi", "amoblado", "bano-propio"],
      amenities: ["WiFi", "Amoblada", "Baño propio"],
      rules: ["no-fumar", "sin-fiestas"],
      address: "Av. Universitaria 1801",
      owner: "Carlos Mendoza",
      description: "Habitación privada y luminosa con cama, escritorio y clóset. El departamento está cerca de la PUCP y comparte cocina y lavandería."
    },
    {
      id: "room-pueblo-libre",
      title: "Habitación luminosa en Pueblo Libre",
      district: "Pueblo Libre",
      location: "Pueblo Libre",
      nearby: "A 8 min de la PUCP",
      price: 890,
      type: "privada",
      image: "habitacion-01.png",
      ownerImage: "mariana.png",
      services: ["wifi", "amoblado", "cocina", "lavanderia"],
      amenities: ["WiFi", "Amoblada", "Cocina", "Lavandería"],
      rules: ["no-fumar", "sin-fiestas", "mascotas"],
      address: "Jr. Andalucía 245",
      owner: "Mariana Torres",
      description: "Habitación privada con buena iluminación, escritorio y clóset. El departamento se comparte con dos estudiantes. Agua e internet están incluidos; luz según consumo."
    },
    {
      id: "room-magdalena",
      title: "Ambiente tranquilo y luminoso",
      district: "Magdalena",
      location: "Magdalena",
      nearby: "A 3.2 km de la PUCP",
      price: 890,
      type: "compartida",
      image: "room-03.png",
      ownerImage: "diego.png",
      services: ["wifi", "amoblado", "lavanderia"],
      amenities: ["WiFi", "Amoblada", "Lavandería"],
      rules: ["no-fumar", "mascotas"],
      address: "Jr. Tacna 620",
      owner: "Diego Salazar",
      description: "Espacio compartido, tranquilo y bien iluminado, con acceso a cocina equipada y lavandería."
    }
  ];

  function dateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function createId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function createInitialState() {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return {
      version: 1,
      rooms: ROOMS,
      favoriteRoomIds: ["room-pueblo-libre"],
      reviews: [
        {
          id: "review-demo",
          roomId: "room-pueblo-libre",
          author: "Lucía Mendoza",
          rating: 5,
          comment: "La habitación es cómoda y la anfitriona respondió rápido. La convivencia fue tranquila.",
          createdAt: yesterday.toISOString(),
          demo: true
        }
      ],
      visits: [
        {
          id: "visit-demo-completed",
          roomId: "room-pueblo-libre",
          guest: "Ana Valdez",
          dateTime: `${dateKey(yesterday)}T16:00`,
          status: "completed",
          demo: true
        }
      ],
      hostNotifications: []
    };
  }

  function readState() {
    const state = leerDatos(STORAGE_KEY, null);
    if (state === null) {
      const initialState = createInitialState();
      writeState(initialState);
      return initialState;
    }

    if (
      !state ||
      state.version !== 1 ||
      !Array.isArray(state.rooms) ||
      !Array.isArray(state.favoriteRoomIds) ||
      !Array.isArray(state.reviews) ||
      !Array.isArray(state.visits) ||
      !Array.isArray(state.hostNotifications)
    ) {
      throw new Error("Los datos locales de ShareRoom no tienen un formato válido.");
    }
    return state;
  }

  function writeState(state) {
    guardarDatos(STORAGE_KEY, state);
  }

  function updateState(updater) {
    const state = readState();
    const result = updater(state);
    writeState(state);
    return result;
  }

  function getRoom(state, roomId) {
    const room = state.rooms.find((item) => item.id === roomId);
    if (!room) {
      throw new Error("No se encontró la habitación seleccionada.");
    }
    return room;
  }

  function getScheduledSlots(state, roomId, ignoredVisitId) {
    return state.visits
      .filter((visit) => visit.roomId === roomId && visit.status === "scheduled" && visit.id !== ignoredVisitId)
      .map((visit) => visit.dateTime);
  }

  function availableSlotsForState(state, roomId, ignoredVisitId) {
    getRoom(state, roomId);
    const occupied = new Set(getScheduledSlots(state, roomId, ignoredVisitId));
    const slots = [];

    for (let offset = 1; offset <= MAX_DAYS_AHEAD; offset += 1) {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      for (const time of VISIT_TIMES) {
        const value = `${dateKey(date)}T${time}`;
        if (new Date(value).getTime() > Date.now() && !occupied.has(value)) {
          slots.push(value);
        }
      }
    }
    return slots;
  }

  function getAvailableSlots(roomId, ignoredVisitId) {
    return availableSlotsForState(readState(), roomId, ignoredVisitId);
  }

  function findScheduledVisit(state, visitId) {
    const visit = state.visits.find((item) => item.id === visitId);
    if (!visit) {
      throw new Error("No se encontró la visita seleccionada.");
    }
    if (visit.status === "completed") {
      throw new Error("Esta visita ya se realizó; no es posible modificarla.");
    }
    if (visit.status !== "scheduled") {
      throw new Error("Solo se pueden modificar visitas programadas.");
    }
    return visit;
  }

  function ensureSlotAvailable(state, roomId, dateTime, ignoredVisitId) {
    if (!availableSlotsForState(state, roomId, ignoredVisitId).includes(dateTime)) {
      throw new Error("Ese horario ya no está disponible. Elige otro.");
    }
  }

  function notifyHost(state, action, visit) {
    state.hostNotifications.unshift({
      id: createId("host-notice"),
      action,
      roomId: visit.roomId,
      visitId: visit.id,
      dateTime: visit.dateTime,
      createdAt: new Date().toISOString()
    });
  }

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  const store = {
    storageKey: STORAGE_KEY,

    getRooms(filters) {
      const state = readState();
      const criteria = filters || {};
      const query = normalizeText(criteria.location).split(/\s+/).filter(Boolean);
      const minPrice = criteria.minPrice === "" || criteria.minPrice == null ? 0 : Number(criteria.minPrice);
      const maxPrice = criteria.maxPrice === "" || criteria.maxPrice == null ? Infinity : Number(criteria.maxPrice);
      const types = criteria.types || [];
      const services = criteria.services || [];
      const rules = criteria.rules || [];

      return state.rooms.filter((room) => {
        const searchable = normalizeText(`${room.title} ${room.district} ${room.location} ${room.nearby} ${room.description}`);
        return (
          (!query.length || query.every((term) => searchable.includes(term))) &&
          room.price >= minPrice &&
          room.price <= maxPrice &&
          (!types.length || types.includes(room.type)) &&
          services.every((service) => room.services.includes(service)) &&
          rules.every((rule) => room.rules.includes(rule))
        );
      });
    },

    getRoomById(roomId) {
      return getRoom(readState(), roomId);
    },

    getFavoriteRoomIds() {
      return readState().favoriteRoomIds.slice();
    },

    toggleFavorite(roomId) {
      return updateState((state) => {
        getRoom(state, roomId);
        const index = state.favoriteRoomIds.indexOf(roomId);
        if (index >= 0) {
          state.favoriteRoomIds.splice(index, 1);
          return false;
        }
        state.favoriteRoomIds.push(roomId);
        return true;
      });
    },

    getReviews(roomId) {
      const state = readState();
      getRoom(state, roomId);
      return state.reviews
        .filter((review) => review.roomId === roomId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    addReview(roomId, rating, comment) {
      const cleanComment = String(comment || "").trim();
      if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
        throw new Error("Selecciona una calificación entre 1 y 5 estrellas.");
      }
      if (!cleanComment || cleanComment.length > 500) {
        throw new Error("Escribe un comentario de hasta 500 caracteres.");
      }

      return updateState((state) => {
        getRoom(state, roomId);
        const review = {
          id: createId("review"),
          roomId,
          author: "Ana Valdez",
          rating: Number(rating),
          comment: cleanComment,
          createdAt: new Date().toISOString()
        };
        state.reviews.push(review);
        return review;
      });
    },

    getVisits() {
      return readState().visits
        .slice()
        .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    },

    getAvailableSlots,

    scheduleVisit(roomId, dateTime) {
      return updateState((state) => {
        getRoom(state, roomId);
        ensureSlotAvailable(state, roomId, dateTime);
        const visit = {
          id: createId("visit"),
          roomId,
          guest: "Ana Valdez",
          dateTime,
          status: "scheduled"
        };
        state.visits.push(visit);
        notifyHost(state, "scheduled", visit);
        return visit;
      });
    },

    rescheduleVisit(visitId, dateTime) {
      return updateState((state) => {
        const visit = findScheduledVisit(state, visitId);
        if (visit.dateTime === dateTime) {
          throw new Error("Elige un horario distinto al actual.");
        }
        ensureSlotAvailable(state, visit.roomId, dateTime, visitId);
        visit.dateTime = dateTime;
        visit.updatedAt = new Date().toISOString();
        notifyHost(state, "rescheduled", visit);
        return visit;
      });
    },

    cancelVisit(visitId) {
      return updateState((state) => {
        const visit = findScheduledVisit(state, visitId);
        visit.status = "cancelled";
        visit.updatedAt = new Date().toISOString();
        notifyHost(state, "cancelled", visit);
        return visit;
      });
    },

    getHostNotifications() {
      return readState().hostNotifications.slice();
    }
  };

  root.ShareRoomStore = store;
})(typeof window !== "undefined" ? window : globalThis);