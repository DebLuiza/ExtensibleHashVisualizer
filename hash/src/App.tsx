import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useExtendibleHash } from "./logic/useExtendibleHash";

export default function App() {
  const { directory, insertKey, globalDepth } = useExtendibleHash();
  const [input, setInput] = useState("");

  // Buckets únicos (para evitar duplicação na visualização)
  const uniqueBuckets = Array.from(
    new Map(directory.map((b) => [b.id, b])).values()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input !== "") {
      insertKey(Number(input));
      setInput("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white font-[Poppins]">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-cyan-300">
          Tabela Hash Extensível
        </h1>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex gap-3 justify-center">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="px-4 py-2 rounded text-black"
            placeholder="Digite um número"
          />
          <button
            type="submit"
            className="bg-cyan-500 px-4 py-2 rounded hover:bg-cyan-600"
          >
            Inserir
          </button>
        </form>

        {/* Diretório */}
        <div>
          <h2 className="text-2xl mb-4 text-cyan-200">
            Diretório (p: {globalDepth})
          </h2>
          <div className="grid grid-cols-4 gap-4 mb-8">
            {directory.map((bucket, i) => (
              <div key={i} className="bg-gray-800 p-3 rounded">
                <div className="font-mono">
                  [{i.toString(2).padStart(globalDepth, "0")}]
                </div>
                <div>Bucket ID: {bucket.id}</div>
                <div>p': {bucket.localDepth}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Buckets (apenas os únicos) */}
        <div>
          <h2 className="text-2xl mb-4 text-cyan-200">Buckets</h2>
          <div className="flex flex-wrap gap-4">
            <AnimatePresence>
              {uniqueBuckets.map((bucket) => (
                <motion.div
                  key={bucket.id}
                  layout
                  className="bg-blue-600/20 p-4 rounded-lg border border-blue-400"
                >
                  <div className="font-bold">Bucket {bucket.id}</div>
                  <div>p': {bucket.localDepth}</div>
                  <div className="mt-2 space-y-1">
                    {bucket.keys.length === 0 ? (
                      <div className="text-sm text-gray-300">Vazio</div>
                    ) : (
                      bucket.keys.map((k) => (
                        <div key={k} className="bg-blue-400/50 px-2 py-1 rounded">
                          {k}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}