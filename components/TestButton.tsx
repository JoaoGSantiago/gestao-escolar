"use client";

import { useState } from "react";

export function TestButton() {
  const [count, setCount] = useState(0);

  console.log("TestButton renderizado, count:", count);

  return (
    <div className="p-4 border-2 border-purple-500 rounded-lg">
      <p className="text-sm text-purple-600 mb-2">Teste de Event Handler</p>
      <p className="text-2xl font-bold text-purple-900 mb-3">{count}</p>
      <button
        onClick={() => {
          console.log("Botão clicado! Count antes:", count);
          setCount(count + 1);
        }}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
      >
        Clique aqui
      </button>
    </div>
  );
}
