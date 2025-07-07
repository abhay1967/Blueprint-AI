import React, { useState, useEffect } from "react";
import Mermaid from "./Mermaid";

export function SafeMermaid({ chart }: { chart: string }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false); // reset error on new input
  }, [chart]);

  try {
    if (hasError || !chart.trim()) {
      return null;
    }

    return (
      <div className="my-4 max-w-3xl w-full">
        <Mermaid chart={chart} />
      </div>
    );
  } catch (e) {
    console.error("Mermaid rendering failed:", e);
    setHasError(true);
    return (
      <div className="my-4 text-red-500 font-semibold">
        ⚠️ Mermaid Diagram Error: {String(e)}
      </div>
    );
  }
}
