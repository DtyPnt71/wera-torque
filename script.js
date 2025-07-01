let currentLang = 'de';

function switchLanguage() {
  currentLang = currentLang === 'de' ? 'en' : 'de';
  document.getElementById("title").innerText = currentLang === 'de' ? "Drehmoment-Rechner" : "Torque Calculator";
  document.getElementById("langBtn").innerText = `🌐 Sprache: ${currentLang.toUpperCase()}`;
  document.querySelector("label[for='insertType']").innerText = currentLang === 'de' ? "Werkzeugeinsatz" : "Insert Type";
  document.querySelector("label[for='sw']").innerText = currentLang === 'de' ? "Schlüsselweite" : "Wrench Size";
  document.querySelector("label[for='keyType']").innerText = currentLang === 'de' ? "Drehmomentschlüssel" : "Torque Wrench";
  document.querySelector("label[for='ma']").innerText = currentLang === 'de' ? "Drehmoment in Nm" : "Torque in Nm";
  document.querySelector("button[onclick='calculate()']").innerText = currentLang === 'de' ? "Jetzt berechnen" : "Calculate";

  const resultEl = document.getElementById("result");
  const resultVal = parseFloat(resultEl.innerText.replace(/[^\d.]/g, ''));
  if (!isNaN(resultVal)) {
    const translated = currentLang === 'de' ? `Korrigierter Wert: ${resultVal} Nm` : `Corrected value: ${resultVal} Nm`;
    resultEl.innerText = translated;
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
}

function showModal(txt) {
  const modal = document.getElementById("modal");
  const modalText = document.getElementById("modalText");
  if (modal && modalText) {
    modalText.innerText = txt;
    modal.style.display = "block";
  } else {
    alert(txt);
  }
}

function calculate() {
  const insert = document.getElementById("insertType").value;
  const sw = document.getElementById("sw").value;
  const key = document.getElementById("keyType").value;
  const ma = parseFloat(document.getElementById("ma").value);
  const resultDiv = document.getElementById("result");
  const loader = document.getElementById("loader");

  resultDiv.innerText = "";

  if (!insert || !sw || !key || isNaN(ma)) {
    showModal("Bitte fülle alle Felder korrekt aus.");
    return;
  }

  loader.style.display = "block";

  setTimeout(() => {
    loader.style.display = "none";

    const sizes = {
      "Joker L": { "16": 44.6, "17": 46.7, "18": 48.2, "19": 49.1 },
      "Joker XL": { "19": 51.6, "20": 53.6, "21": 55.4, "22": 56.7, "23": 56.7, "24": 56.7 },
      "Joker XXL": { "24": 62.2, "27": 68, "30": 70.2, "32": 70.4 },
      "Joker 3XL": { "32": 77, "34": 79, "36": 80, "41": 81.5 }
    };

    const data = {
      X4: { Lk: 435, Sk: 25.5, min: 40, max: 200 },
      X7: { Lk: 343, Sk: 25.5, min: 20, max: 100 }
    };

    
    console.log("Insert:", insert, "SW:", sw, "Key:", key, "Input Nm:", ma);
    if (!sizes[insert] || !sizes[insert][sw]) {
      showModal("Die Kombination aus Werkzeugeinsatz und Schlüsselweite ist ungültig.");
      return;
    }
    const S = sizes[insert][sw];
    
    
    if (!data[key]) {
      showModal("Der gewählte Drehmomentschlüssel ist ungültig.");
      return;
    }
    const { Sk, Lk, min, max } = data[key];
    
    const Ms = ma * Lk / (Lk + (S - Sk));
    const rounded = Math.round(Ms * 100) / 100;

    if (rounded < min || rounded > max) {
      showModal(`Das Ergebnis (${rounded} Nm) liegt außerhalb des Bereichs vom WERA ${key}.`);
    }

    const output = currentLang === 'de'
      ? `Korrigierter Wert: ${rounded} Nm`
      : `Corrected value: ${rounded} Nm`;

    resultDiv.innerText = output;
  }, 800);
}

// Intro automatisch ausblenden nach Ladezeit
window.addEventListener("load", () => {
  setTimeout(() => {
    const intro = document.getElementById("intro");
    if (intro) {
      intro.style.display = "none";
    }
  }, 5000);
});

function resetFields() {
  document.getElementById("insertType").selectedIndex = 0;
  document.getElementById("sw").selectedIndex = 0;
  document.getElementById("sw").disabled = true;
  document.getElementById("keyType").selectedIndex = 0;
  document.getElementById("ma").value = "";
  document.getElementById("result").innerText = "";
  document.getElementById("loader").style.display = "none";
}

function loadChangelog() {
  fetch('./version.json')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("changelogContent");
      if (!container) return;

      let html = "";
      data.changelog.forEach(entry => {
        html += `<strong>📦 Version ${entry.version} – ${entry.date}</strong><ul>`;
        entry.changes.forEach(change => {
          html += `<li>${change}</li>`;
        });
        html += "</ul><hr/>"
      });

      container.innerHTML = html;
      document.getElementById("changelogModal").style.display = "block";
    })
    .catch(err => {
      console.error("Fehler beim Laden des Changelogs:", err);
    });
}


// Empfehlungstabelle Modal (verzögert geladen)

function openTableModal() {
    const table = document.getElementById('toolTable');
    table.innerHTML = `<tr><th>Typ</th><th>Größe</th><th>Joker-Typ</th><th>Schlüssel</th><th>Nm</th></tr>`;

    table.innerHTML += `<tr class='keine'><td>L</td><td>8L</td><td>keine</td><td>keine</td><td>keine</td></tr>`;
    table.innerHTML += `<tr><td>L</td><td>12L</td><td>Joker XL</td><td>X7</td><td>33.9</td></tr>`;
    table.innerHTML += `<tr><td>L</td><td>15L</td><td>Joker XXL</td><td>X7</td><td>41.8</td></tr>`;
    table.innerHTML += `<tr><td>S</td><td>8S</td><td>Joker L</td><td>X7</td><td>39.3</td></tr>`;
    table.innerHTML += `<tr><td>S</td><td>10S</td><td>Joker XL</td><td>X7</td><td>48.6</td></tr>`;
    table.innerHTML += `<tr><td>S</td><td>12S</td><td>Joker XL</td><td>X7</td><td>57.7</td></tr>`;
    table.innerHTML += `<tr><td>S</td><td>16S</td><td>Joker XXL</td><td>X7</td><td>74.3</td></tr>`;
    table.innerHTML += `<tr><td>S</td><td>20S</td><td>Joker 3XL</td><td>X4</td><td>112</td></tr>`;
    table.innerHTML += `<tr class='keine'><td>S</td><td>25S</td><td>keine</td><td>X4</td><td>keine</td></tr>`;
    document.getElementById('modal').style.display = 'block';
}
