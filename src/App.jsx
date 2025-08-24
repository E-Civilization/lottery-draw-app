import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";

export default function App() {
  const [data, setData] = useState([]);
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [hCount, setHCount] = useState(0);
  const [bCount, setBCount] = useState(0);
  const [drawn, setDrawn] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws);
      setData(json);
    };
    reader.readAsBinaryString(file);
  };

  const handleDraw = () => {
    let hPool = data.filter((d) => d.selection === "h");
    let bPool = data.filter((d) => d.selection === "b");

    let hSel = [];
    let bSel = [];

    for (let i = 0; i < hCount && hPool.length > 0; i++) {
      let idx = Math.floor(Math.random() * hPool.length);
      hSel.push(hPool.splice(idx, 1)[0]);
    }

    for (let i = 0; i < bCount && bPool.length > 0; i++) {
      let idx = Math.floor(Math.random() * bPool.length);
      bSel.push(bPool.splice(idx, 1)[0]);
    }

    const final = [...hSel, ...bSel].sort(() => Math.random() - 0.5);
    setResults(final);
    setDrawn([]);
  };

  const revealNext = () => {
    if (results.length > drawn.length) {
      setDrawn([...drawn, results[drawn.length]]);
    }
  };

  const exportResults = () => {
    const ws = XLSX.utils.json_to_sheet(drawn);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "results.xlsx");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">🎉 Lottery Draw App 🎉</h1>

      <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="mb-4" />

      <div className="mb-4 space-y-2">
        <input type="number" placeholder="Total" value={total} onChange={(e) => setTotal(+e.target.value)} className="border p-2 rounded w-24 mx-2" />
        <input type="number" placeholder="H count" value={hCount} onChange={(e) => setHCount(+e.target.value)} className="border p-2 rounded w-24 mx-2" />
        <input type="number" placeholder="B count" value={bCount} onChange={(e) => setBCount(+e.target.value)} className="border p-2 rounded w-24 mx-2" />
      </div>

      <button onClick={handleDraw} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Start Draw</button>
      <button onClick={revealNext} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Reveal Next</button>
      <button onClick={exportResults} className="bg-purple-500 text-white px-4 py-2 rounded">Export</button>

      <div className="mt-6 grid grid-cols-1 gap-4">
        {drawn.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white shadow-md p-4 rounded-lg text-xl font-semibold"
          >
            🎟️ Form {item["form no"]} ({item.selection.toUpperCase()})
          </motion.div>
        ))}
      </div>
    </div>
  );
}
