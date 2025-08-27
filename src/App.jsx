import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { motion, AnimatePresence } from "framer-motion";

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
      setDrawn([results[drawn.length], ...drawn]);
    }
  };

  const exportResults = () => {
    const ws = XLSX.utils.json_to_sheet(drawn);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "results.xlsx"
    );
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
      {/* Header / Controls */}
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Lottery Draw</h1>

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="mb-4"
        />

        <div className="mb-4 flex justify-center flex-wrap">
          <div className="flex flex-col mx-4">
            <p className="text-left">Total:</p>
            <input
              type="number"
              placeholder="Total"
              value={total}
              onChange={(e) => setTotal(+e.target.value)}
              className="border p-2 rounded w-28"
            />
          </div>
          <div className="flex flex-col mx-4">
            <p className="text-left">Hindi:</p>
            <input
              type="number"
              placeholder="H count"
              value={hCount}
              onChange={(e) => setHCount(+e.target.value)}
              className="border p-2 rounded w-28"
            />
          </div>
          <div className="flex flex-col mx-4">
            <p className="text-left">Bengali:</p>
            <input
              type="number"
              placeholder="B count"
              value={bCount}
              onChange={(e) => setBCount(+e.target.value)}
              className="border p-2 rounded w-28"
            />
          </div>
        </div>

        <button
          onClick={handleDraw}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Start Draw
        </button>
        <button
          onClick={revealNext}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          Reveal Next
        </button>
        <button
          onClick={exportResults}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Export
        </button>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        <div className="mt-6 grid grid-cols-1 gap-4">
          <AnimatePresence>
            {drawn.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white bg-opacity-90 shadow-md p-4 rounded-lg text-xl font-semibold text-center"
              >
                🎟️ Form {item["form no"]} ({item.selection.toUpperCase()})
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <img
        src="/logo.png"
        className="absolute opacity-10 -z-10 inset-0 m-auto max-w-[100%] max-h-[100%]"
      ></img>

      {/* Sticky Footer */}
      <div className="p-4 h-12 text-center">
        <p>Maintained by E-Civilization ©</p>
      </div>
    </div>
  );
}
