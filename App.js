import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./styles.css"; // ← OVDE JE VAŽAN IMPORT

const CUSTOMERS = [
  "Dolly Bell", "Galerija", "Terassa", "Petica", "Sava Centar", "Dvojka",
  "Sky Fall", "Slatko zvono", "Eva ketering", "Wagner"
];

const UNITS = ["KG", "KOM", "VEZA"];

const COMPANY = {
  name: "Vocno zvono",
  pib: "113856697",
  address: "Bul. Mihajla Pupina 165B, 11070, Beograd",
  racun: "160-6000002183930-27"
};

function App() {
  const today = new Date().toISOString().slice(0, 10);
  const [customer, setCustomer] = useState(CUSTOMERS[0]);
  const [date, setDate] = useState(today);
  const [items, setItems] = useState([{ name: "", quantity: "", unit: "KG" }]);

  const handleItemChange = (idx, field, value) => {
    const updated = [...items];
    updated[idx][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { name: "", quantity: "", unit: "KG" }]);
  };

  const removeItem = idx => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Otpremnica", 14, 18);
    doc.setFontSize(12);
    doc.text(`Naziv firme: ${COMPANY.name}`, 14, 28);
    doc.text(`PIB: ${COMPANY.pib}`, 14, 35);
    doc.text(`Adresa: ${COMPANY.address}`, 14, 42);
    doc.text(`Tekuci racun: ${COMPANY.racun}`, 14, 49);
    doc.text(`Kupac: ${customer}`, 14, 60);
    doc.text(`Datum: ${date}`, 14, 67);

    doc.autoTable({
      startY: 75,
      head: [["Artikal", "Kolicina", "JM"]],
      body: items.map(item => [item.name, item.quantity, item.unit]),
    });

    doc.save("Otpremnica.pdf");
  };

  const handlePrepareEmail = () => {
    const subject = encodeURIComponent("Otpremnica");
    const body = encodeURIComponent("Otpremnica je u prilogu.");
    window.location.href = `mailto:vocno.zvono@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="container">
      <h2>Otpremnica</h2>

      <label>Kupac</label>
      <select value={customer} onChange={e => setCustomer(e.target.value)}>
        {CUSTOMERS.map(c => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <label>Datum</label>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />

      <table>
        <thead>
          <tr>
            <th>Artikal</th>
            <th>Kolicina</th>
            <th>JM</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td>
                <input
                  type="text"
                  value={item.name}
                  onChange={e => handleItemChange(idx, "name", e.target.value)}
                  placeholder="Naziv artikla"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={e => handleItemChange(idx, "quantity", e.target.value)}
                  placeholder="Količina"
                  min="0"
                  step="any"
                />
              </td>
              <td>
                <select
                  value={item.unit}
                  onChange={e => handleItemChange(idx, "unit", e.target.value)}
                >
                  {UNITS.map(u => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </td>
              <td>
                <button onClick={() => removeItem(idx)} disabled={items.length === 1}>
                  Obrisi
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addItem}>Dodaj artikal</button>
      <div style={{ marginTop: 20 }}>
        <button onClick={handleDownload}>Preuzmi PDF</button>
        <button onClick={handlePrepareEmail} style={{ marginLeft: 10 }}>
          Pripremi email
        </button>
      </div>
      <p className="note">
        *PDF moraš ručno da priložiš u email (browser ne dozvoljava automatsko slanje priloga).
      </p>
    </div>
  );
}

export default App;
