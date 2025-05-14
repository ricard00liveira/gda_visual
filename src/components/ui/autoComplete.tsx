import { useEffect, useState } from "react";

type Municipio = {
  id: number;
  nome: string;
};

type Props = {
  municipios: Municipio[];
  municipioId: number | null;
  setMunicipioId: (id: number | null) => void;
  setLogradouros: (logradouros: unknown[]) => void;
  setLogradouroId: (id: number | null) => void;
  setLogradouroBusca: (busca: string) => void;
};

export default function AutoCompleteMunicipio({
  municipios,
  municipioId,
  setMunicipioId,
  setLogradouros,
  setLogradouroId,
  setLogradouroBusca,
}: Props) {
  const [busca, setBusca] = useState("");
  const [sugestoes, setSugestoes] = useState<Municipio[]>([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

  useEffect(() => {
    if (busca.length < 2) {
      setSugestoes([]);
      return;
    }

    const filtrados = municipios.filter((municipio) =>
      municipio.nome.toLowerCase().includes(busca.toLowerCase())
    );
    setSugestoes(filtrados);
  }, [busca, municipios]);

  const handleSelectMunicipio = (id: number) => {
    setMunicipioId(id);
    setLogradouros([]);
    setLogradouroId(null);
    setLogradouroBusca("");
    setMostrarSugestoes(false);
  };

  return (
    <div>
      <input
        type="text"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        onFocus={() => setMostrarSugestoes(true)}
        onBlur={() => setTimeout(() => setMostrarSugestoes(false), 200)} // Evita fechar antes de clicar
        placeholder="Digite o nome do município"
      />
      {mostrarSugestoes && sugestoes.length > 0 && (
        <ul>
          {sugestoes.map((municipio) => (
            <li
              key={municipio.id}
              onClick={() => handleSelectMunicipio(municipio.id)}
              style={{ cursor: "pointer" }}
            >
              {municipio.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
