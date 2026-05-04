const main = document.querySelector('.app');
const navLinks = [...document.querySelectorAll('.sidebar nav a')];
const dashboard = main.innerHTML;

const pages = {
  Dashboard: dashboard,
  Agenda: modulePage('Agenda', 'Vista diaria de disponibilidad, reservas confirmadas y espacios libres.', [
    ['09:00', 'Maria Lopez', 'Corte + Peinado', 'Confirmada'],
    ['10:00', 'Ana Torres', 'Coloracion', 'Confirmada'],
    ['12:00', 'Disponible', '--', 'Disponible'],
    ['14:00', 'Sofia Martinez', 'Tratamiento Capilar', 'VIP'],
  ]),
  Reservas: modulePage('Reservas', 'Gestion completa de reservas, pagos, cancelaciones y confirmaciones.', [
    ['RSV-1042', 'Daniela Ruiz', 'Coloracion', 'Confirmada'],
    ['RSV-1043', 'Paula Medina', 'Corte + Peinado', 'Pendiente'],
    ['RSV-1044', 'Fernanda Castro', 'Tratamiento', 'Confirmada'],
    ['RSV-1045', 'Valeria Silva', 'Ondas', 'Reprogramar'],
  ]),
  Clientes: modulePage('Clientes', 'Historial de clientes, preferencias, frecuencia y segmentacion.', [
    ['Sofia Martinez', 'VIP', '12 visitas', 'Activa'],
    ['Carla Lopez', 'VIP', '9 visitas', 'Activa'],
    ['Julia Mendez', 'Regular', '8 visitas', 'Activa'],
    ['Andrea Gomez', 'Nuevo', '2 visitas', 'Seguimiento'],
  ]),
  VIP: modulePage('VIP', 'Programa de fidelizacion con beneficios y seguimiento personalizado.', [
    ['Sofia Martinez', 'Gold', '$4,200', 'Preferente'],
    ['Carla Lopez', 'Gold', '$3,850', 'Preferente'],
    ['Julia Mendez', 'Silver', '$2,900', 'Activa'],
    ['Andrea Gomez', 'Silver', '$2,100', 'Activa'],
  ]),
  Servicios: modulePage('Servicios', 'Catalogo de servicios, precios, duracion y disponibilidad por personal.', [
    ['Corte + Peinado', '$450', '45 min', 'Activo'],
    ['Coloracion', '$950', '90 min', 'Activo'],
    ['Tratamiento Capilar', '$650', '60 min', 'Activo'],
    ['Maquillaje', '$700', '60 min', 'Activo'],
  ]),
  Equipo: modulePage('Equipo', 'Gestion de personal, carga de trabajo, especialidades y agenda.', [
    ['Laura Vega', 'Colorista', '82%', 'Disponible'],
    ['Andres Mora', 'Barbero', '68%', 'Ocupado'],
    ['Mariana Solis', 'Stylist', '74%', 'Disponible'],
    ['Paola Ruiz', 'Makeup', '59%', 'Disponible'],
  ]),
  Reportes: modulePage('Reportes', 'Indicadores de ocupacion, retencion, ventas y rendimiento del estudio.', [
    ['Ocupacion semanal', '78%', '+8%', 'Listo'],
    ['Retencion VIP', '64%', '+12%', 'Listo'],
    ['Servicios top', 'Coloracion', '+15%', 'Listo'],
    ['Cancelaciones', '4%', '-2%', 'Listo'],
  ]),
  Ingresos: modulePage('Ingresos', 'Analisis de ingresos diarios, mensuales y proyeccion por servicio.', [
    ['Hoy', '$5,240', '+15%', 'Cerrando'],
    ['Semana', '$32,480', '+18%', 'Listo'],
    ['Mes', '$68,750', '+20%', 'Listo'],
    ['Ticket promedio', '$612', '+7%', 'Listo'],
  ]),
  Configuracion: modulePage('Configuracion', 'Preferencias del estudio, horarios, sucursales y permisos.', [
    ['Sucursal', 'Studio Central', 'Principal', 'Activa'],
    ['Horario', '09:00 - 18:00', 'L-S', 'Activo'],
    ['Moneda', 'USD', 'Default', 'Activo'],
    ['Recordatorios', 'Email + SMS', '24h antes', 'Activo'],
  ]),
};

function modulePage(title, summary, rows) {
  return `
    <header class="topbar"><div><h1>${title}</h1><p>${summary}</p></div><div><span>!</span><span>*</span><strong>AD</strong><p>Admin</p></div></header>
    <section class="kpis module-kpis">
      <article><i>1</i><div><span>Total</span><strong>${rows.length}</strong><small>Registros</small></div><em>Activo</em></article>
      <article><i>2</i><div><span>Confirmadas</span><strong>${rows.filter(r => r[3] !== 'Pendiente').length}</strong><small>Hoy</small></div><em>+8%</em></article>
      <article><i>3</i><div><span>Valor</span><strong>$ 5,240</strong><small>Estimado</small></div><em>+12%</em></article>
      <article><i>4</i><div><span>Calidad</span><strong>96%</strong><small>Operacion</small></div><em>Ok</em></article>
    </section>
    <section class="layout module-layout">
      <article class="panel module-table-panel">
        <div class="panel-head"><h2>${title}</h2><div><input data-search placeholder="Buscar..." /><button data-new>Nuevo</button></div></div>
        <div class="module-table"><table><thead><tr><th>Nombre</th><th>Detalle</th><th>Info</th><th>Estado</th></tr></thead><tbody data-table>
          ${rows.map(row => `<tr>${row.map((cell, index) => `<td data-label="${['Nombre','Detalle','Info','Estado'][index]}">${index === 3 ? `<mark>${cell}</mark>` : cell}</td>`).join('')}</tr>`).join('')}
        </tbody></table></div>
      </article>
      <aside class="right">
        <article class="panel booking"><h2>Accion rapida</h2><label>Cliente<select data-client><option>Sofia Martinez</option><option>Carla Lopez</option><option>Daniela Ruiz</option><option>Nuevo cliente</option></select></label><label>Servicio<select data-service><option>${title}</option><option>Corte + Peinado</option><option>Coloracion</option><option>Tratamiento Capilar</option></select></label><label>Notas<textarea placeholder="Detalle"></textarea></label><button data-save>Guardar</button></article>
        <article class="panel income"><div class="panel-head"><h2>Resumen</h2><a>Ver reporte</a></div><strong>$ 32,480</strong><em>+18%</em><div class="bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></article>
      </aside>
    </section>`;
}

function animateCards() {
  document.querySelectorAll('.panel,.kpis article').forEach((card, index) => {
    card.style.animation = `fade .35s ease ${index * 25}ms both`;
  });
}

const navOrder = ['Dashboard', 'Agenda', 'Reservas', 'Clientes', 'VIP', 'Servicios', 'Equipo', 'Reportes', 'Ingresos', 'Configuracion'];

navLinks.forEach((link, index) => {
  const pageName = navOrder[index] || 'Dashboard';
  link.href = '#';
  link.addEventListener('click', (event) => {
    event.preventDefault();
    navLinks.forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
    main.innerHTML = pages[pageName] || dashboard;
    bindActions();
    animateCards();
  });
});

function bindActions() {
  document.querySelectorAll('[data-search]').forEach((input) => {
    input.addEventListener('input', () => {
      const term = input.value.toLowerCase();
      document.querySelectorAll('[data-table] tr').forEach((row) => {
        row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
      });
    });
  });

  document.querySelectorAll('[data-save], .booking button, [data-new]').forEach((button) => {
    button.onclick = () => {
      const original = button.textContent;
      button.textContent = 'Guardado';
      toast('Accion guardada correctamente');
      setTimeout(() => button.textContent = original, 1200);
    };
  });

  document.querySelectorAll('select').forEach((select) => {
    if (select.dataset.ready) return;
    select.dataset.ready = 'true';
    select.addEventListener('change', () => {
      const card = select.closest('.booking') || document.querySelector('.income');
      const summary = card?.querySelector('small') || card?.querySelector('em');
      if (summary) summary.textContent = `Seleccionado: ${select.value}`;
      toast(`Seleccionaste ${select.value}`);
    });
  });

  document.querySelectorAll('.panel-head button').forEach((button) => {
    if (button.dataset.ready) return;
    button.dataset.ready = 'true';
    button.addEventListener('click', () => {
      const panel = button.closest('.panel');
      panel?.classList.toggle('selected');
      toast('Panel seleccionado');
    });
  });

  document.querySelectorAll('.agenda .row, .module-table tbody tr, .vip p, .next p').forEach((row) => {
    if (row.dataset.ready) return;
    row.dataset.ready = 'true';
    row.addEventListener('click', () => {
      document.querySelectorAll('.selected-row').forEach((item) => item.classList.remove('selected-row'));
      row.classList.add('selected-row');
      toast(`Seleccionado: ${row.textContent.trim().slice(0, 42)}`);
    });
  });
}

function toast(message) {
  let box = document.querySelector('.toast');
  if (!box) {
    box = document.createElement('div');
    box.className = 'toast';
    document.body.appendChild(box);
  }
  box.textContent = message;
  box.classList.add('show');
  setTimeout(() => box.classList.remove('show'), 1800);
}

bindActions();
animateCards();
