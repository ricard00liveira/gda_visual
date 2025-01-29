import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
              Perguntas Frequentes
            </h1>
            <p className="text-gray-600 mt-1">Encontre respostas para as principais dúvidas sobre o GDA</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-100/50 p-6 space-y-6">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="what-is-gda" className="border border-emerald-100 rounded-lg px-4 data-[state=open]:bg-emerald-50/50">
              <AccordionTrigger className="text-lg font-medium hover:text-emerald-600 transition-colors py-4">
                O que é o GDA?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pb-4">
                O GDA é uma plataforma online que permite aos cidadãos registrar denúncias relacionadas a questões ambientais, como poluição, desmatamento, maus-tratos a animais ou outras infrações ambientais. O sistema facilita o acompanhamento dessas denúncias e a comunicação com as autoridades responsáveis.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="what-can-report" className="border border-emerald-100 rounded-lg px-4 data-[state=open]:bg-emerald-50/50">
              <AccordionTrigger className="text-lg font-medium hover:text-emerald-600 transition-colors py-4">
                O que posso denunciar?
              </AccordionTrigger>
              <AccordionContent className="space-y-8 pb-4">
                <div>
                  <h3 className="font-medium text-lg text-emerald-700 mb-4">1. Crimes contra a Fauna</h3>
                  <ul className="list-disc pl-6 space-y-3 text-gray-600">
                    <li>Matar, perseguir, caçar, apanhar ou utilizar espécimes da fauna silvestre sem a devida permissão, licença ou autorização dos órgãos competentes.</li>
                    <li>Praticar abuso, maus-tratos, ferir ou mutilar animais silvestres, domésticos ou domesticados, nativos ou exóticos.</li>
                    <li>Pescar em período de defeso, em locais proibidos ou utilizando métodos não autorizados, como explosivos, substâncias tóxicas ou apetrechos ilegais.</li>
                    <li>Transportar, comercializar ou armazenar espécimes provenientes de pesca ilegal, sem a devida comprovação de origem.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-lg text-emerald-700 mb-4">2. Crimes contra a Flora</h3>
                  <ul className="list-disc pl-6 space-y-3 text-gray-600">
                    <li>Destruir ou danificar florestas ou vegetação de preservação permanente, mesmo que em formação, ou utilizá-las infringindo normas de proteção.</li>
                    <li>Cortar árvores em florestas de preservação permanente sem permissão da autoridade competente.</li>
                    <li>Provocar incêndio em mata ou floresta.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-lg text-emerald-700 mb-4">3. Crimes de Poluição</h3>
                  <ul className="list-disc pl-6 space-y-3 text-gray-600">
                    <li>Causar poluição de qualquer natureza em níveis que resultem ou possam resultar em danos à saúde humana, mortandade de animais ou destruição significativa da flora.</li>
                    <li>Lançar resíduos sólidos, líquidos ou gasosos, ou detritos, óleos ou substâncias oleosas em desacordo com as exigências estabelecidas em leis ou regulamentos.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-lg text-emerald-700 mb-4">4. Crimes contra o Ordenamento Urbano e o Patrimônio Cultural</h3>
                  <ul className="list-disc pl-6 space-y-3 text-gray-600">
                    <li>Destruir, inutilizar ou deteriorar bem especialmente protegido por lei, ato administrativo ou decisão judicial.</li>
                    <li>Pichar ou por outro meio conspurcar edificação ou monumento urbano.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-lg text-emerald-700 mb-4">5. Crimes contra a Administração Ambiental</h3>
                  <ul className="list-disc pl-6 space-y-3 text-gray-600">
                    <li>Obstar ou dificultar a ação fiscalizadora do Poder Público no trato de questões ambientais.</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="registration-login" className="border border-emerald-100 rounded-lg px-4 data-[state=open]:bg-emerald-50/50">
              <AccordionTrigger className="text-lg font-medium hover:text-emerald-600 transition-colors py-4">
                Cadastro e Login
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-gray-600 leading-relaxed pb-4">
                <div>
                  <h3 className="font-medium mb-2 text-emerald-700">Como faço para criar uma conta?</h3>
                  <p>Acesse a página de registro e preencha os campos obrigatórios, como nome, e-mail e senha. Após o preenchimento, clique em "Registrar" para concluir o cadastro.</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2 text-emerald-700">Posso fazer uma denúncia sem criar uma conta?</h3>
                  <p>Sim, o GDA permite o registro de denúncias anônimas. Para isso, acesse a página de denúncia anônima e forneça as informações solicitadas. Lembre-se de que, ao optar por essa modalidade, você não poderá acompanhar o status da denúncia posteriormente.</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2 text-emerald-700">Esqueci minha senha. O que devo fazer?</h3>
                  <p>Na página de login, clique em "Esqueci a senha". Você será redirecionado para a página de recuperação de senha, onde deverá inserir seu e-mail cadastrado. Siga as instruções enviadas para redefinir sua senha.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="how-to-use" className="border border-emerald-100 rounded-lg px-4 data-[state=open]:bg-emerald-50/50">
              <AccordionTrigger className="text-lg font-medium hover:text-emerald-600 transition-colors py-4">
                Como usar o sistema
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-gray-600 leading-relaxed pb-4">
                <div>
                  <h3 className="font-medium mb-2 text-emerald-700">Como faço para registrar uma denúncia?</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-emerald-600 mb-2">Com conta:</h4>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Faça login através da página de login.</li>
                        <li>Após acessar sua conta, navegue até a seção "Cadastrar Denúncia".</li>
                        <li>Preencha os detalhes da denúncia, incluindo descrição, localização e, se possível, anexos relevantes.</li>
                        <li>Envie a denúncia para que seja processada.</li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-emerald-600 mb-2">Sem conta (Anônima):</h4>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Acesse a página de denúncia anônima.</li>
                        <li>Forneça as informações solicitadas sobre a denúncia.</li>
                        <li>Envie a denúncia para que seja processada.</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2 text-emerald-700">Posso acompanhar minhas denúncias?</h3>
                  <p>Sim, ao fazer login em sua conta, você pode acessar a seção "Minhas Denúncias" para visualizar o status e detalhes de cada denúncia registrada. Denúncias anônimas não oferecem essa funcionalidade de acompanhamento.</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2 text-emerald-700">O que significam os diferentes status da denúncia?</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                      <span><strong>Em Análise:</strong> Sua denúncia foi registarda e será avaliada.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      <span><strong>Na fila:</strong> Sua denúncia foi aprovada e está aguardando o atendimento.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400"></span>
                      <span><strong>Concluída:</strong> A denúncia foi investigada e as ações necessárias foram tomadas.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-400"></span>
                      <span><strong>Rejeitada:</strong> A denúncia não pôde ser processada devido a informações insuficientes ou outros motivos.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2 text-emerald-700">Posso editar ou cancelar uma denúncia?</h3>
                  <p>Após o envio, as denúncias podem ser editadas ou canceladas a qualquer momento, antes de serem avaliadas pelo operadores.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="notifications-privacy" className="border border-emerald-100 rounded-lg px-4 data-[state=open]:bg-emerald-50/50">
              <AccordionTrigger className="text-lg font-medium hover:text-emerald-600 transition-colors py-4">
                Notificações e Privacidade
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-gray-600 leading-relaxed pb-4">
                <div>
                  <h3 className="font-medium mb-2 text-emerald-700">Receberei notificações sobre minha denúncia?</h3>
                  <p>Sim, para denúncias registradas com uma conta, você receberá atualizações por e-mail sobre o andamento de sua denúncia. Denúncias anônimas não oferecem notificações.</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2 text-emerald-700">Minhas informações estão protegidas?</h3>
                  <p>Sim, o GDA adota medidas de segurança para proteger seus dados pessoais e está em conformidade com as leis de privacidade vigentes.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="support" className="border border-emerald-100 rounded-lg px-4 data-[state=open]:bg-emerald-50/50">
              <AccordionTrigger className="text-lg font-medium hover:text-emerald-600 transition-colors py-4">
                Suporte
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-gray-600 leading-relaxed pb-4">
                <div>
                  <h3 className="font-medium mb-2 text-emerald-700">Preciso de ajuda. Como entro em contato?</h3>
                  <p>Se você tiver dúvidas ou enfrentar problemas, utilize a seção "Contato" disponível no site ou envie um e-mail para o suporte do GDA.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FAQ;