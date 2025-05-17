import {
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export interface AudioRecorderHandles {
  iniciarGravacao: () => Promise<void>;
  pararGravacao: () => void;
  tempo: number;
}

interface Props {
  onAudioFinalizado: (blob: Blob, url: string, tempo: number) => void;
}

const AudioRecorder: ForwardRefRenderFunction<AudioRecorderHandles, Props> = (
  { onAudioFinalizado },
  ref
) => {
  const [gravando, setGravando] = useState(false);
  const [tempo, setTempo] = useState(0);
  const tempoRef = useRef(0); // <- Referência confiável

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const contadorRef = useRef<number | null>(null);

  const iniciarGravacao = async () => {
    setTempo(0);
    tempoRef.current = 0;

    const permitido = await verificarPermissaoMicrofone();
    if (!permitido) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunks.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      onAudioFinalizado(blob, url, tempoRef.current); // <- valor exato
    };

    mediaRecorder.start();
    setGravando(true);

    contadorRef.current = window.setInterval(() => {
      setTempo((prev) => {
        tempoRef.current = prev + 1;
        return tempoRef.current;
      });
    }, 1000);

    timerRef.current = window.setTimeout(() => {
      pararGravacao();
    }, 120000);
  };

  const pararGravacao = () => {
    mediaRecorderRef.current?.stop();
    setGravando(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (contadorRef.current) clearInterval(contadorRef.current);
    timerRef.current = null;
    contadorRef.current = null;
  };

  useImperativeHandle(ref, () => ({
    iniciarGravacao,
    pararGravacao,
    tempo: tempoRef.current,
  }));

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={gravando ? pararGravacao : iniciarGravacao}
        className={`px-4 py-2 rounded font-semibold w-full ${
          gravando
            ? "bg-red-600 text-white"
            : "bg-emerald-600 text-white hover:bg-emerald-700"
        }`}
      >
        {gravando ? "Parar Gravação" : "Gravar Histórico por Voz"}
      </button>
      {gravando && (
        <div className="text-sm text-center font-medium text-gray-700">
          Gravando:{" "}
          {Math.floor(tempo / 60)
            .toString()
            .padStart(2, "0")}
          :{(tempo % 60).toString().padStart(2, "0")} / 02:00
        </div>
      )}
    </div>
  );
};

const verificarPermissaoMicrofone = async () => {
  try {
    const status = await navigator.permissions.query({
      name: "microphone" as PermissionName,
    });

    if (status.state === "denied") {
      alert(
        "O acesso ao microfone foi negado. Por favor, habilite nas configurações do navegador para continuar."
      );
      return false;
    }

    if (status.state === "prompt" || status.state === "granted") {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    }
  } catch (error) {
    console.error("Erro ao tentar acessar o microfone:", error);
    return false;
  }
};

export default forwardRef(AudioRecorder);
