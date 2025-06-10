import { useState, useRef, useEffect } from "react";

type Bucket = {
  id: number;
  keys: number[];
  localDepth: number;
};

const BUCKET_SIZE = 4; // tamanho do bucket

export function useExtendibleHash() {
  const [globalDepth, setGlobalDepth] = useState(1);
  const bucketCount = useRef(0);

  function createBucket(localDepth: number): Bucket {
    return { id: bucketCount.current++, keys: [], localDepth };
  }

  // Inicializa em (p=1)
  const [directory, setDirectory] = useState<Bucket[]>(() => {
    const bucket0 = createBucket(1);
    const bucket1 = createBucket(1);
    return [bucket0, bucket1]; 
  });

  const [pendingInserts, setPendingInserts] = useState<number[]>([]);

  function hash(key: number, depth: number) {
    return key % Math.pow(2, depth);
  }

  function doubleDirectory(oldDir: Bucket[]): Bucket[] {
    const newDir = [];
    for (let i = 0; i < oldDir.length * 2; i++) {
      newDir[i] = oldDir[i % oldDir.length]; // Duplica os ponteiros
    }
    return newDir;
  }

  function insertKey(key: number) {
    if (pendingInserts.includes(key)) return;

    const index = hash(key, globalDepth);
    const bucket = directory[index];

    if (bucket.keys.includes(key)) return;

    if (bucket.keys.length < BUCKET_SIZE) {
      bucket.keys.push(key);
      setDirectory([...directory]);
    } else {
      setPendingInserts((old) => [...old, key]);
      splitBucket(index);
    }
  }

  function splitBucket(index: number) {
    const oldBucket = directory[index];
    const oldLocalDepth = oldBucket.localDepth;
    const newLocalDepth = oldLocalDepth + 1;

    let updatedDirectory = [...directory];

    // Duplica o diretório se necessário
    if (newLocalDepth > globalDepth) {
      updatedDirectory = doubleDirectory(updatedDirectory);
      setGlobalDepth(newLocalDepth);
    }

    const newBucket = createBucket(newLocalDepth);

    // Atualiza ponteiros do diretório
    const mask = 1 << oldLocalDepth;
    for (let i = 0; i < updatedDirectory.length; i++) {
      if (updatedDirectory[i] === oldBucket && (i & mask) !== 0) {
        updatedDirectory[i] = newBucket;
      }
    }

    // Redistribui as chaves
    const keysToRedistribute = [...oldBucket.keys];
    oldBucket.keys = [];
    oldBucket.localDepth = newLocalDepth;

    keysToRedistribute.forEach((k) => {
      const newIndex = hash(k, newLocalDepth);
      if (newIndex === index) {
        oldBucket.keys.push(k);
      } else {
        newBucket.keys.push(k);
      }
    });

    setDirectory(updatedDirectory);
  }

  useEffect(() => {
    if (pendingInserts.length === 0) return;
    const [key, ...rest] = pendingInserts;
    setPendingInserts(rest);
    insertKey(key); // Tenta inserir novamente
  }, [directory, globalDepth]);

  function removeKey(key: number) {
    const index = hash(key, globalDepth);
    const bucket = directory[index];
    bucket.keys = bucket.keys.filter((k) => k !== key);
    setDirectory([...directory]);
  }

  return { directory, insertKey, removeKey, globalDepth };
}