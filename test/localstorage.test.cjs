const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = readFileSync(path.join(__dirname, "../js/localstorage.js"), "utf8");

function createStore() {
  const values = new Map();
  const window = {
    localStorage: {
      getItem(key) {
        return values.has(key) ? values.get(key) : null;
      },
      setItem(key, value) {
        values.set(key, String(value));
      }
    }
  };
  vm.runInNewContext(source, { window, Date, Math, JSON, Set, Error });
  return { store: window.ShareRoomStore, values };
}

test("initializes and persists the room and demo data locally", () => {
  const { store, values } = createStore();

  assert.equal(store.getRooms().length, 3);
  assert.equal(store.getFavoriteRoomIds()[0], "room-pueblo-libre");
  assert.ok(values.has(store.storageKey));
  assert.ok(store.getVisits().some((visit) => visit.status === "completed"));
});

test("adds and removes favorite rooms", () => {
  const { store } = createStore();

  assert.equal(store.toggleFavorite("room-pucp"), true);
  assert.ok(store.getFavoriteRoomIds().includes("room-pucp"));
  assert.equal(store.toggleFavorite("room-pucp"), false);
  assert.ok(!store.getFavoriteRoomIds().includes("room-pucp"));
});

test("filters rooms by location, budget, type, and service", () => {
  const { store } = createStore();

  const rooms = store.getRooms({
    location: "pueblo libre",
    minPrice: 800,
    maxPrice: 900,
    types: ["privada"],
    services: ["wifi", "cocina"]
  });

  assert.deepEqual(Array.from(rooms, (room) => room.id), ["room-pueblo-libre"]);
  assert.deepEqual(
    Array.from(store.getRooms({ location: "PUCP, San Miguel" }), (room) => room.id),
    ["room-pucp"]
  );
});

test("rechecks occupied slots while preserving other available times", () => {
  const { store } = createStore();
  const [firstSlot, secondSlot] = store.getAvailableSlots("room-pueblo-libre");

  const visit = store.scheduleVisit("room-pueblo-libre", firstSlot);
  assert.throws(
    () => store.scheduleVisit("room-pueblo-libre", firstSlot),
    /ya no está disponible/
  );
  assert.ok(store.getAvailableSlots("room-pueblo-libre").includes(secondSlot));
  assert.equal(visit.status, "scheduled");
});

test("reschedules and cancels scheduled visits, but blocks completed visits", () => {
  const { store } = createStore();
  const [firstSlot, secondSlot] = store.getAvailableSlots("room-pueblo-libre");
  const visit = store.scheduleVisit("room-pueblo-libre", firstSlot);

  store.rescheduleVisit(visit.id, secondSlot);
  assert.ok(store.getAvailableSlots("room-pueblo-libre").includes(firstSlot));
  assert.equal(store.getHostNotifications().length, 2);

  store.cancelVisit(visit.id);
  assert.equal(store.getVisits().find((item) => item.id === visit.id).status, "cancelled");
  assert.ok(store.getAvailableSlots("room-pueblo-libre").includes(secondSlot));
  assert.equal(store.getHostNotifications().length, 3);
  assert.throws(
    () => store.cancelVisit("visit-demo-completed"),
    /ya se realizó/
  );
  assert.throws(
    () => store.rescheduleVisit("visit-demo-completed", firstSlot),
    /ya se realizó/
  );
});

test("saves reviews locally and validates their rating and comment", () => {
  const { store } = createStore();

  const review = store.addReview("room-pucp", 4, "Buena ubicación y habitación cómoda.");
  assert.equal(store.getReviews("room-pucp")[0].id, review.id);
  assert.throws(() => store.addReview("room-pucp", 6, "Comentario"), /calificación/);
  assert.throws(() => store.addReview("room-pucp", 5, "  "), /comentario/);
});
