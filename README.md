# 🔧 Drehmomentkorrektur WERA

Ein modernes, mobilfähiges Berechnungstool zur **Korrektur von Drehmomentwerten bei Werkzeugeinsätzen mit variabler Schlüsselweite**.  
Optimiert für WERA X4 & X7 Drehmomentschlüssel – inklusive App-Funktionalität über Progressive Web App (PWA).

---

## 🧠 Funktionsübersicht

✅ Auswahl des Werkzeugeinsatzes *(Joker L – 3XL)*  
✅ Dynamisch angepasste Schlüsselweiten-Auswahl  
✅ Automatische Berechnung des korrigierten Drehmoments  
✅ Bereichsprüfung je nach Drehmomentschlüssel (X4 oder X7)  
✅ Moderne und schlichte UI mit responsivem Layout für PC, Tablet und Smartphone  
✅ ⚠️ Warnungen bei ungültiger Eingabe oder Werte außerhalb der Toleranz  
✅ 📲 **PWA-Funktion:** "Zum Homebildschirm hinzufügen"-Button für Android & iOS  
✅ Modal-Popups statt Browser-Alerts  
✅ Unterstützt Netlify (Drop-Deployment)

---

## 🆕 Changelog

### [v1.0.0] – 2025-06-24
- Erste stabile Veröffentlichung
- Auswahlfelder vollständig dynamisch
- Berechnung gemäß Formel: `Ms = Ma × Lk / (Lk + (S − Sk))`
- Modal-Warnsystem für Fehler & Hinweise
- Layout optimiert für mobile Nutzung
- **PWA-Integration mit Manifest & Service Worker**
- Support für Add-to-Home auf Android und iOS über Modal

---

## 💻 Deployment

Einfach das Repository als ZIP auf [Netlify Drop](https://app.netlify.com/drop) hochladen.  
Die App ist direkt online & als Web-App installierbar.

---

## 🛠 Verwendete Technologien

- HTML5, CSS3
- Vanilla JavaScript
- PWA (Manifest + Service Worker)
- Netlify Deployment Ready

---

## 🧾 Lizenz

© 2025 Timo Burian – HDT GmbH Bottrop. Alle Rechte vorbehalten.
