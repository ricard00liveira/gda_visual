import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, HelpCircle, Shield, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFont = async () => {
      const font = new FontFace(
        "Inter",
        "url(https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff)"
      );

      try {
        await font.load();
        document.fonts.add(font);
      } catch (error) {
        console.error("Error loading font:", error);
      }
    };

    loadFont();
  }, []);

  const handleProceed = () => {
    if (isChecked) {
      setShowDialog(false);
      navigate("/anonymous");
    }
  };

  return (
    <div className="public-page min-h-screen flex items-center justify-center bg-gray-100 p-4 font-inter">
      <div className="w-full max-w-[1200px] flex flex-col lg:flex-row border border-black rounded-lg overflow-hidden shadow-lg">
        {/* Lado esquerdo - Hero Section */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#1A1F2C] to-[#2A3441] text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              {/* <Leaf className="w-8 h-8 text-emerald-400" /> */}
              <img src="/logo_gda.png" alt="Logo GDA" className="w-10 h-10" />
              <h1 className="text-3xl font-bold">GDA</h1>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">
              Gerenciador de
              <br />
              Denúncias Ambientais
            </h2>
            <p className="text-gray-300 text-base lg:text-lg mb-8 text-justify">
              O <span className="text-emerald-400 font-semibold">GDA</span> é um
              sistema online criado para facilitar o registro de
              <span className="text-emerald-400 font-semibold">
                {" "}
                denúncias sobre problemas que afetam o meio ambiente
              </span>
              , como:
              <span className="block mt-2 text-sm text-center text-emerald-400">
                • poluição | desmatamento | maus-tratos a animais | entre
                outros...
              </span>
              <span className="block mt-2">
                Ele permite que{" "}
                <span className="text-emerald-400 font-semibold">
                  qualquer pessoa
                </span>{" "}
                informe essas situações de forma simples, ajudando as
                autoridades a investigarem e tomarem providências. Para mais
                informações, acesse a página de ajuda.
              </span>
            </p>

            <div className="flex justify-center mt-4">
              <Link to="/faq">
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-white/10 transition-colors bg-emerald-600/20"
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Página de Ajuda
                </Button>
              </Link>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-emerald-500/10 to-transparent" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl" />
        </div>

        {/* Lado direito - Login/Register Section */}
        <div className="w-full lg:w-1/2 p-8 lg:p-16 bg-white">
          <div className="max-w-md mx-auto">
            <div className="flex justify-end mb-12">
              <Link
                to="/register"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-all duration-300 
                           group border border-emerald-500/30 px-3 py-1.5 rounded-lg 
                           hover:bg-emerald-50 hover:border-emerald-500/50 
                           hover:shadow-sm hover:scale-105 transform"
              >
                <span className="group-hover:text-emerald-600 transition-colors">
                  Não tem conta?
                </span>
                <UserPlus className="w-4 h-4 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
              </Link>
            </div>

            <div className="space-y-8">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                  Bem-vindo!
                </h1>
                <p className="text-lg lg:text-xl text-gray-600">
                  Conecte-se e ajude a proteger nosso planeta.
                </p>
              </div>

              <div className="space-y-4">
                <Link to="/login">
                  <Button
                    className="w-full text-lg h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 transition-all duration-300"
                    size="lg"
                  >
                    <span>Entrar</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                <div className="space-y-3">
                  <p className="text-sm text-gray-600 text-center">
                    Contribua de forma anônima
                  </p>
                  <Button
                    variant="outline"
                    className="w-full text-lg h-12 border-2 hover:bg-gray-50 transition-colors duration-300"
                    size="lg"
                    onClick={() => setShowDialog(true)}
                  >
                    <Shield className="w-5 h-5 mr-2 text-emerald-600" />
                    <span>Denúncia Anônima</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-red-600">
                Aviso Importante
              </DialogTitle>
              <DialogDescription className="text-justify pt-4 text-sm leading-relaxed">
                Ao enviar uma <strong>denúncia anônima</strong>, suas
                informações estarão protegidas nos termos da
                <strong>
                  {" "}
                  Lei Geral de Proteção de Dados Pessoais (LGPD – Lei nº
                  13.709/2018)
                </strong>
                , da{" "}
                <strong>
                  Lei de Acesso à Informação (Lei nº 12.527/2011)
                </strong>{" "}
                e do
                <strong>
                  {" "}
                  Código de Defesa dos Usuários de Serviços Públicos (Lei nº
                  13.460/2017)
                </strong>
                .
                <br />
                <br />
                No entanto, ao optar pelo envio anônimo,{" "}
                <strong>não será possível acompanhar o andamento</strong> da
                denúncia nem receber retorno, uma vez que seus dados não estarão
                vinculados à manifestação.
                <br />
                <br />
                <span className="text-red-500 font-medium">Atenção:</span> a
                denúncia deve ser feita com responsabilidade e veracidade.
                Informações falsas podem configurar crime previsto no Código
                Penal Brasileiro:
                <br />
                <br />
                <span className="block border-l-4 border-red-500 pl-3 text-gray-800 italic">
                  <strong>
                    Art. 340 – Falsa comunicação de crime ou de contravenção:
                  </strong>
                  <br />
                  Provocar a ação de autoridade, comunicando-lhe a ocorrência de
                  crime ou contravenção que
                  <strong> sabe não se ter verificado</strong>.
                  <br />
                  <strong>Pena:</strong> detenção de{" "}
                  <strong>1 a 6 meses</strong>, ou <strong>multa</strong>.
                </span>
                <br />
                Essa conduta prejudica o funcionamento dos órgãos públicos e
                pode acarretar sanções legais ao denunciante.
                <br />
                <br />
                Ao prosseguir, você declara estar ciente dos{" "}
                <strong>termos</strong>, das <strong>limitações</strong> e das
                <strong> possíveis consequências legais</strong> decorrentes do
                envio de informações inverídicas.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center space-x-2 py-4">
              <Checkbox
                id="terms"
                checked={isChecked}
                onCheckedChange={(checked) => setIsChecked(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Estou ciente!
              </label>
            </div>
            <DialogFooter className="sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
              >
                Voltar
              </Button>
              <Button
                type="button"
                onClick={handleProceed}
                disabled={!isChecked}
              >
                Prosseguir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
