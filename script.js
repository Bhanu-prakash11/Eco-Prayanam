<script>
  // --- Helpdesk data & behavior ---
  const helpdesk = document.getElementById('helpdesk');
  const helpLeft = document.getElementById('help-left');
  const helpRight = document.getElementById('help-right');

  const emails = ["support@ecopray.com", "contact@ecopray.com", "info@ecopray.com", "help@ecopray.com"];
  const phones = ["+91 98765 43210", "+91 91234 56789", "+91 99887 66554", "+91 90000 12345"];

  function populateHelpline() {
    helpLeft.innerHTML = "<h3>📧 Emails</h3>" +
      emails.sort(() => 0.5 - Math.random()).slice(0, 2).map(e => `<p>${e}</p>`).join('');
    helpRight.innerHTML = "<h3>☎️ Contacts</h3>" +
      phones.sort(() => 0.5 - Math.random()).slice(0, 2).map(p => `<p>${p}</p>`).join('');
  }
  window.addEventListener('scroll', () => {
    const onTitle = document.getElementById('title').classList.contains('active');
    if (onTitle && window.scrollY > 50) {
      helpdesk.style.display = 'flex';
    } else {
      helpdesk.style.display = 'none';
    }
  });
  populateHelpline();
  // --- End helpdesk ---

  // Users
  let users = {};
  function signup() {
    const user = document.getElementById('newUser').value.trim();
    const pass = document.getElementById('newPass').value;
    if (!user || !pass || !user.endsWith('@gmail.com')) {
      alert('Enter valid @gmail.com username and password.');
      return;
    }
    users[user] = pass;
    alert('Signup successful! Please login.');
    nextSection('login');
  }
  function login() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;
    if (users[user] === pass) {
      nextSection('location');
    } else {
      alert('Invalid credentials.');
    }
  }
  function nextSection(id) {
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    window.scrollTo(0, 0);
    if (helpdesk) helpdesk.style.display = 'none';
    if (id === "recommend") makeRecommendation();
  }

  // --- Location & autocomplete ---
  const pickupInput = document.getElementById('pickupSearch');
  const dropInput = document.getElementById('dropSearch');

  function swapLocations() {
    const temp = pickupInput.value;
    pickupInput.value = dropInput.value;
    dropInput.value = temp;
  }

  function validateLocationAndNext() {
    const p1 = pickupInput.value.trim();
    const p2 = dropInput.value.trim();
    const places = Array.from(document.querySelectorAll('#placesList option')).map(o => o.value);
    if (!p1 || !p2 || p1 === p2 || !places.includes(p1) || !places.includes(p2)) {
      alert('Enter valid and different pickup/drop locations.');
      return;
    }
    nextSection('transport');
  }
  // Bus timings
  const busData = [
    { bus: "102", time: "05:00 AM", type:"Diesel", status: "completed", strength: "40/50", co2: 15, price: 20, duration: 50 },
    { bus: "210", time: "09:15 AM", type:"Diesel", status: "current", strength: "32/50", co2: 12, price: 20, duration: 45 },
    { bus: "305", time: "11:30 AM", type:"Electric", status: "future", strength: "0/40", co2: 0, price: 20, duration: 40 },
    { bus: "410", time: "01:45 PM", type:"Diesel", status: "future", strength: "0/50", co2: 10, price: 20, duration: 55 },
    { bus: "502", time: "03:20 PM", type:"Electric", status: "future", strength: "0/40", co2: 0, price: 20, duration: 35 },
    { bus: "601", time: "05:50 PM", type:"Diesel", status: "future", strength: "0/50", co2: 11, price: 20, duration: 60 },
    { bus: "720", time: "08:10 PM", type:"Diesel", status: "future", strength: "0/50", co2: 9, price: 20, duration: 70 },
    { bus: "808", time: "10:30 PM", type:"Electric", status: "future", strength: "0/40", co2: 0, price: 20, duration: 30 }
  ];

  function showBus() {
    nextSection('bus');
    const list = document.getElementById('busList');
    list.innerHTML = '';
    busData.forEach((b, idx) => {
      const div = document.createElement('div');
      div.className = `bus-box ${b.status} ${b.type === "Electric" ? "electric" : ""}`;
      div.innerHTML = `<div class="bus-time">${b.time}</div><div class="bus-sub">${b.type} Bus</div>`;
      div.onclick = () => showBusDetails(idx);
      list.appendChild(div);
    });
  }

  function showBusDetails(idx) {
    const b = busData[idx];
    document.getElementById('bus-details').style.display = 'block';
    document.getElementById('d-time').innerText = b.time;
    document.getElementById('d-type').innerText = b.type;
    document.getElementById('d-strength').innerText = b.strength;
    document.getElementById('d-co2').innerText = b.co2 + " kg CO₂";
    document.getElementById('d-status').innerText = b.status;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
  function closeDetails() {
    document.getElementById('bus-details').style.display = 'none';
  }

  // Ride data split into Rapido / Ola / Uber
  const rideData = {
    Rapido: [
      { vehicle: "Bike", price: 40, co2: 2, duration: 25 }
    ],
    Ola: [
      { vehicle: "Auto", price: 60, co2: 5, duration: 30 },
      { vehicle: "Car",  price: 120, co2: 15, duration: 35 }
    ],
    Uber: [
      { vehicle: "Bike", price: 50, co2: 2,  duration: 28 },
      { vehicle: "Car",  price: 100, co2: 10, duration: 32 }
    ]
  };

  function showRide() {
  nextSection('ride');
  const rideList = document.getElementById('rideList');
  rideList.innerHTML = '';

  // Logos + Booking links
  const ridePlatforms = {
    Rapido: {
      logo: "images/rapido.jpeg",
      link: "https://www.rapido.bike/"
    },
    Ola: {
      logo: "images/ola.png",
      link: "https://www.olacabs.com/"
    },
    Uber: {
      logo: "images/uber.png",
      link: "https://www.uber.com/in/en/ride/"
    }
  };

  Object.keys(rideData).forEach(app => {
    const sec = document.createElement('div');
    sec.className = 'ride-section';
    sec.innerHTML = `
      <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1rem;">
        <img src="${ridePlatforms[app].logo}" alt="${app} logo" style="width:50px; height:50px; border-radius:8px;">
        <h3 style="margin:0;">${app}</h3>
      </div>
    `;

    rideData[app].forEach(r => {
      const div = document.createElement('div');
      div.className = 'ride-option';
      div.style.display = "flex";
      div.style.justifyContent = "space-between";
      div.style.alignItems = "center";

      div.innerHTML = `
        <div>
          <b>${r.vehicle}</b><br>
          ₹${r.price} • ${r.co2} kg CO₂ • ${r.duration} min
        </div>
        <button onclick="window.open('${ridePlatforms[app].link}', '_blank')" 
          style="padding:0.5rem 1rem; background:#40916c; color:white; border:none; border-radius:6px; cursor:pointer;">
          Book Now
        </button>
      `;

      sec.appendChild(div);
    });

    rideList.appendChild(sec);
  });
}


 function makeRecommendation() {
  const activeBuses = busData.filter(b => b.status !== "completed");
  const rideFlat = Object.entries(rideData)
    .flatMap(([app, arr]) => arr.map(o => ({ ...o, app })));

  const allData = [...activeBuses, ...rideFlat];

  const cheapest = allData.reduce((a,b) => b.price < a.price ? b : a);
  const greenest = allData.reduce((a,b) => b.co2 < a.co2 ? b : a);
  const fastest  = allData.reduce((a,b) => b.duration < a.duration ? b : a);

  const cards = [
    { label:"⚡ Fastest", item:fastest, color:"#ff9800" },
    { label:"💰 Cheapest", item:cheapest, color:"#4caf50" },
    { label:"🌱 Greenest", item:greenest, color:"#2196f3" }
  ];

  const format = (item) => {
    if (item.bus) {
      return {
        title: `Bus ${item.bus} (${item.type})`,
        subtitle: item.time,
        price: item.price,
        co2: item.co2,
        duration: item.duration
      };
    } else {
      return {
        title: `${item.app} ${item.vehicle}`,
        subtitle: "Available Now",
        price: item.price,
        co2: item.co2,
        duration: item.duration
      };
    }
  };

  const recDiv = document.getElementById("recommendation");
  recDiv.innerHTML = "";

  cards.forEach(c => {
    const d = format(c.item);
    const card = document.createElement("div");
    card.style = `
      flex:1;
      min-width:250px;
      background:#fff;
      border-radius:12px;
      padding:1.5rem;
      box-shadow:0 4px 12px rgba(0,0,0,0.2);
      text-align:left;
      border-top:6px solid ${c.color};
      transition:transform 0.3s;
    `;
    card.onmouseover = () => card.style.transform = "scale(1.05)";
    card.onmouseout  = () => card.style.transform = "scale(1)";

    card.innerHTML = `
      <h3 style="margin-top:0; color:${c.color};">${c.label}</h3>
      <p><b>${d.title}</b></p>
      <p>${d.subtitle}</p>
      <p>💵 Price: ₹${d.price}</p>
      <p>⏱ Duration: ${d.duration} min</p>
      <p>🌫 CO₂: ${d.co2} kg</p>
    `;
    recDiv.appendChild(card);
  });

  // Fill comparison table
  const compareBody = document.getElementById("compareBody");
  compareBody.innerHTML = "";
  allData.forEach(item => {
    const d = format(item);
    compareBody.innerHTML += `
      <tr>
        <td>${d.title}</td>
        <td>${d.subtitle}</td>
        <td>${d.price}</td>
        <td>${d.co2}</td>
        <td>${d.duration}</td>
      </tr>
    `;
  });
}

function showComparison() {
  nextSection('transport');  // redirect back to Select Transport Mode
}


</script>