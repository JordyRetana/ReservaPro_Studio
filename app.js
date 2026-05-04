const services = [
  { name: "Consultoria de imagen", duration: 75, price: 95, demand: "Alta" },
  { name: "Sesion branding personal", duration: 120, price: 180, demand: "Media" },
  { name: "Plan nutricional express", duration: 45, price: 70, demand: "Alta" },
  { name: "Mentoria premium", duration: 90, price: 140, demand: "VIP" },
];

const initialAppointments = [
  {
    client: "Camila Solis",
    service: "Mentoria premium",
    staff: "Ana Morales",
    date: today(),
    time: "09:00",
    notes: "Cliente VIP, preparar seguimiento de objetivos.",
  },
  {
    client: "Marco Rojas",
    service: "Consultoria de imagen",
    staff: "Diego Vargas",
    date: today(),
    time: "11:30",
    notes: "Primera visita, enviar diagnostico posterior.",
  },
  {
    client: "Valeria Chen",
    service: "Sesion branding personal",
    staff: "Laura Chen",
    date: addDays(1),
    time: "15:00",
    notes: "Trae referencias de marca personal.",
  },
];

const priorityClients = [
  { name: "Camila Solis", tag: "VIP", detail: "4 reservas este mes" },
  { name: "Grupo Nexo", tag: "Empresa", detail: "Contrato corporativo activo" },
  { name: "Valeria Chen", tag: "Seguimiento", detail: "Pendiente propuesta premium" },
];

let appointments = JSON.parse(localStorage.getItem("reservapro-appointments")) || initialAppointments;
let activeFilter = "all";

const serviceSelect = document.querySelector("#serviceSelect");
const bookingForm = document.querySelector("#bookingForm");
const dateInput = document.querySelector("#dateInput");
const timeInput = document.querySelector("#timeInput");
const clearBtn = document.querySelector("#clearBtn");

function today() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function serviceByName(name) {
  return services.find((service) => service.name === name) || services[0];
}

function saveAppointments() {
  localStorage.setItem("reservapro-appointments", JSON.stringify(appointments));
}

function renderServiceOptions() {
  serviceSelect.innerHTML = services.map((service) => `<option>${service.name}</option>`).join("");
}

function renderServices() {
  document.querySelector("#services").innerHTML = services
    .map(
      (service) => `
        <article class="service">
          <div>
            <strong>${service.name}</strong>
            <p>${service.duration} min | Demanda ${service.demand}</p>
          </div>
          <span class="price">${money(service.price)}</span>
        </article>
      `,
    )
    .join("");
}

function renderClients() {
  document.querySelector("#clients").innerHTML = priorityClients
    .map(
      (client) => `
        <article class="client">
          <div>
            <strong>${client.name}</strong>
            <p>${client.detail}</p>
          </div>
          <span class="badge">${client.tag}</span>
        </article>
      `,
    )
    .join("");
}

function filteredAppointments() {
  return appointments.filter((appointment) => {
    if (activeFilter === "today") return appointment.date === today();
    if (activeFilter === "vip") return appointment.service.toLowerCase().includes("premium") || appointment.notes.toLowerCase().includes("vip");
    return true;
  });
}

function renderAppointments() {
  const container = document.querySelector("#appointments");
  const rows = filteredAppointments().sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  if (!rows.length) {
    container.innerHTML = `<article class="appointment"><strong>Sin reservas en este filtro</strong><p>Crea una nueva cita para alimentar la agenda.</p></article>`;
    return;
  }

  container.innerHTML = rows
    .map((appointment, index) => {
      const service = serviceByName(appointment.service);
      return `
        <article class="appointment">
          <div class="appointment-top">
            <div>
              <strong>${appointment.time} | ${appointment.client}</strong>
              <p>${appointment.date} con ${appointment.staff}</p>
            </div>
            <span class="badge">${money(service.price)}</span>
          </div>
          <p>${appointment.service}. ${appointment.notes || "Sin notas adicionales."}</p>
          <button data-delete="${index}" type="button">Cancelar</button>
        </article>
      `;
    })
    .join("");
}

function renderSummary() {
  const todaysAppointments = appointments.filter((appointment) => appointment.date === today());
  const revenue = todaysAppointments.reduce((sum, appointment) => sum + serviceByName(appointment.service).price, 0);
  const occupancy = Math.min(Math.round((todaysAppointments.length / 8) * 100), 100);
  const avgTicket = todaysAppointments.length ? Math.round(revenue / todaysAppointments.length) : 0;
  const next = todaysAppointments.sort((a, b) => a.time.localeCompare(b.time))[0];
  const topService = appointments.reduce((acc, appointment) => {
    acc[appointment.service] = (acc[appointment.service] || 0) + 1;
    return acc;
  }, {});
  const mostBooked = Object.entries(topService).sort((a, b) => b[1] - a[1])[0]?.[0] || "Premium";

  document.querySelector("#todayCount").textContent = todaysAppointments.length;
  document.querySelector("#revenueCount").textContent = money(revenue);
  document.querySelector("#occupancyCount").textContent = `${occupancy}%`;
  document.querySelector("#avgTicket").textContent = money(avgTicket);
  document.querySelector("#nextAppointment").textContent = next ? next.time : "--:--";
  document.querySelector("#topService").textContent = mostBooked.replace("Sesion ", "");
}

function renderAll() {
  renderAppointments();
  renderSummary();
  renderWeeklyBars();
  document.querySelectorAll(".appointment, .operations-strip article, .summary-grid article, .day-bar").forEach((element) => {
    element.classList.remove("is-refreshing");
    void element.offsetWidth;
    element.classList.add("is-refreshing");
  });
}

function renderWeeklyBars() {
  const days = [
    { label: "Lun", value: 62 },
    { label: "Mar", value: 74 },
    { label: "Mie", value: 58 },
    { label: "Jue", value: 86 },
    { label: "Vie", value: 93 },
    { label: "Sab", value: 77 },
    { label: "Dom", value: 41 },
  ];

  document.querySelector("#weeklyBars").innerHTML = days
    .map(
      (day) => `
        <div class="day-bar">
          <strong>${day.value}%</strong>
          <i style="height:${day.value * 1.45}px"></i>
          <span>${day.label}</span>
        </div>
      `,
    )
    .join("");
}

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  appointments.push({
    client: document.querySelector("#clientName").value.trim(),
    service: serviceSelect.value,
    staff: document.querySelector("#staffSelect").value,
    date: dateInput.value,
    time: timeInput.value,
    notes: document.querySelector("#notesInput").value.trim(),
  });
  saveAppointments();
  bookingForm.reset();
  dateInput.value = today();
  timeInput.value = "10:00";
  renderAll();
});

document.querySelector(".tabs").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".tabs button").forEach((item) => item.classList.toggle("active", item === button));
  renderAppointments();
});

document.querySelector("#appointments").addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete]");
  if (!button) return;
  const visible = filteredAppointments().sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  const target = visible[Number(button.dataset.delete)];
  appointments = appointments.filter((appointment) => appointment !== target);
  saveAppointments();
  renderAll();
});

clearBtn.addEventListener("click", () => {
  localStorage.removeItem("reservapro-appointments");
  appointments = [...initialAppointments];
  renderAll();
});

renderServiceOptions();
renderServices();
renderClients();
dateInput.value = today();
timeInput.value = "10:00";
renderAll();
