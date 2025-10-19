import React, { useState } from "react";
import { generate } from "../generator/generator";

function GenerateCollection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedJson, setGeneratedJson] = useState(null);

  const onFileChange = (event) => {
    setSelectedFile(event.target.files?.[0] ?? null);
  };

  const handleGenerate = async () => {
    const json = await generate(selectedFile);
    console.log("Generated JSON:", json);
    if (json != null) setGeneratedJson(json);
  };

  const renderCardsList = () => {
    const cards = Array.isArray(generatedJson?.cards) ? [...generatedJson.cards] : [];

    if (!cards.length) return <p>Ni kartic</p>;

    cards.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

    return (
      <ol>
        {cards.map((card, i) => (
          <li key={card.order ?? i} style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: "600" }}>{card.q ?? card.title ?? `Card ${i + 1}`}</div>
            <div style={{ whiteSpace: "pre-wrap", marginTop: 6 }}>{card.a ?? JSON.stringify(card, null, 2)}</div>
          </li>
        ))}
      </ol>
    );
  };

  return (
    <div>
      <h1>Generator</h1>
      <input type="file" onChange={onFileChange} accept="application/pdf" />
      <button onClick={handleGenerate} disabled={!selectedFile}>
        Generate Collection
      </button>

      <h2>Generirane kartice v JSON</h2>

      <p>Predmet vsebine: {generatedJson ? String(generatedJson.subject ?? "Ni predmeta") : "Ni predmeta"}</p>

      <h3>Raw JSON</h3>
      {generatedJson ? (
        <pre style={{ whiteSpace: "pre-wrap", fontFamily: "monospace", background: "#f6f8fa", padding: 12, borderRadius: 6 }}>
          {JSON.stringify(generatedJson, null, 2)}
        </pre>
      ) : (
        <p>Ni vsebine</p>
      )}

      <h3>Kartice</h3>
      {renderCardsList()}
    </div>
  );
}

export default GenerateCollection;
