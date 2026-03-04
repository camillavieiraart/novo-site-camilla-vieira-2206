import { Link } from "wouter";
import { useEffect } from "react";

export default function Privacidade() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Política de Privacidade — Camilla Vieira";
  }, []);

  const lastUpdated = "04 de março de 2026";

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <div className="bg-[#2C1810] text-[#F5E6D3] py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-[#C97064] text-sm tracking-widest uppercase hover:text-[#F5E6D3] transition-colors">
            ← Voltar ao início
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl mt-6 mb-4">Política de Privacidade</h1>
          <p className="text-[#C4A882] text-sm">Última atualização: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">

        <section>
          <p className="text-[#4A3728] leading-relaxed text-lg">
            A sua privacidade é importante para nós. Esta Política de Privacidade descreve como a <strong>Camilla Vieira — Fotografia e Arte</strong> ("nós", "nosso" ou "Camilla Vieira"), inscrita sob CNPJ/CPF de responsabilidade de Camilla Vieira, com sede em Brasília, DF, coleta, usa, armazena e protege as suas informações pessoais ao utilizar o site <strong>camillavieira.art</strong> e seus serviços associados.
          </p>
          <p className="text-[#4A3728] leading-relaxed mt-4">
            Esta política está em conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018)</strong> e, onde aplicável, com o Regulamento Geral de Proteção de Dados da União Europeia (GDPR).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-[#2C1810] mb-4 pb-2 border-b border-[#E8D5C0]">1. Controlador dos Dados</h2>
          <p className="text-[#4A3728] leading-relaxed">
            O controlador responsável pelo tratamento dos seus dados pessoais é:
          </p>
          <div className="mt-4 bg-[#F5E6D3] rounded-lg p-6 text-[#2C1810]">
            <p><strong>Camilla Vieira — Fotografia e Arte</strong></p>
            <p className="mt-1">Brasília, DF — Setor Sudoeste, CEP 70680-350</p>
            <p className="mt-1">E-mail: <a href="mailto:ola@camillavieira.art" className="text-[#C97064] hover:underline">ola@camillavieira.art</a></p>
            <p className="mt-1">WhatsApp: <a href="https://wa.me/5561991087909" className="text-[#C97064] hover:underline">(61) 99108-7909</a></p>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-[#2C1810] mb-4 pb-2 border-b border-[#E8D5C0]">2. Dados que Coletamos</h2>
          <p className="text-[#4A3728] leading-relaxed mb-4">Coletamos as seguintes categorias de dados pessoais:</p>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-5 border border-[#E8D5C0]">
              <h3 className="font-semibold text-[#2C1810] mb-2">Dados fornecidos diretamente por você</h3>
              <p className="text-[#4A3728] text-sm leading-relaxed">Nome completo, endereço de e-mail, número de telefone/WhatsApp, mensagens enviadas pelo formulário de contato, preferências de conteúdo da newsletter, respostas a formulários de onboarding e pesquisas de satisfação.</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-[#E8D5C0]">
              <h3 className="font-semibold text-[#2C1810] mb-2">Dados de navegação (coletados automaticamente)</h3>
              <p className="text-[#4A3728] text-sm leading-relaxed">Endereço IP, tipo de navegador, sistema operacional, páginas visitadas, tempo de permanência, origem do acesso (referral) e dados de interação com e-mails (abertura e cliques em links da newsletter).</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-[#E8D5C0]">
              <h3 className="font-semibold text-[#2C1810] mb-2">Dados de transações</h3>
              <p className="text-[#4A3728] text-sm leading-relaxed">Quando você realiza uma compra, coletamos informações necessárias para processar o pagamento (via Stripe) e entregar o serviço ou produto. Não armazenamos dados de cartão de crédito — esses dados são tratados exclusivamente pela Stripe, Inc.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-[#2C1810] mb-4 pb-2 border-b border-[#E8D5C0]">3. Finalidade e Base Legal do Tratamento</h2>
          <p className="text-[#4A3728] leading-relaxed mb-4">Tratamos seus dados pessoais com as seguintes finalidades e bases legais, conforme o Art. 7º da LGPD:</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#2C1810] text-[#F5E6D3]">
                  <th className="text-left p-3 font-medium">Finalidade</th>
                  <th className="text-left p-3 font-medium">Base Legal (LGPD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8D5C0]">
                <tr className="bg-white">
                  <td className="p-3 text-[#4A3728]">Responder mensagens e solicitações de contato</td>
                  <td className="p-3 text-[#4A3728]">Legítimo interesse (Art. 7º, IX)</td>
                </tr>
                <tr className="bg-[#FAF7F2]">
                  <td className="p-3 text-[#4A3728]">Envio de newsletter e comunicações de marketing</td>
                  <td className="p-3 text-[#4A3728]">Consentimento (Art. 7º, I)</td>
                </tr>
                <tr className="bg-white">
                  <td className="p-3 text-[#4A3728]">Processamento de pedidos e pagamentos</td>
                  <td className="p-3 text-[#4A3728]">Execução de contrato (Art. 7º, V)</td>
                </tr>
                <tr className="bg-[#FAF7F2]">
                  <td className="p-3 text-[#4A3728]">Gestão de relacionamento com clientes (CRM)</td>
                  <td className="p-3 text-[#4A3728]">Legítimo interesse (Art. 7º, IX)</td>
                </tr>
                <tr className="bg-white">
                  <td className="p-3 text-[#4A3728]">Análise de desempenho do site e melhoria de serviços</td>
                  <td className="p-3 text-[#4A3728]">Legítimo interesse (Art. 7º, IX)</td>
                </tr>
                <tr className="bg-[#FAF7F2]">
                  <td className="p-3 text-[#4A3728]">Cumprimento de obrigações legais e fiscais</td>
                  <td className="p-3 text-[#4A3728]">Obrigação legal (Art. 7º, II)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-[#2C1810] mb-4 pb-2 border-b border-[#E8D5C0]">4. Compartilhamento de Dados</h2>
          <p className="text-[#4A3728] leading-relaxed mb-4">
            Não vendemos, alugamos nem comercializamos seus dados pessoais. Podemos compartilhá-los apenas com os seguintes terceiros, estritamente para a prestação dos nossos serviços:
          </p>
          <ul className="space-y-3 text-[#4A3728]">
            <li className="flex gap-3"><span className="text-[#C97064] font-bold mt-0.5">→</span><span><strong>Resend Inc.</strong> — plataforma de envio de e-mails transacionais e newsletter. Política de privacidade em <a href="https://resend.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#C97064] hover:underline">resend.com/privacy</a>.</span></li>
            <li className="flex gap-3"><span className="text-[#C97064] font-bold mt-0.5">→</span><span><strong>Stripe Inc.</strong> — processamento de pagamentos. Política em <a href="https://stripe.com/br/privacy" target="_blank" rel="noopener noreferrer" className="text-[#C97064] hover:underline">stripe.com/br/privacy</a>.</span></li>
            <li className="flex gap-3"><span className="text-[#C97064] font-bold mt-0.5">→</span><span><strong>Autoridades públicas</strong> — quando exigido por lei, ordem judicial ou regulamentação aplicável.</span></li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-[#2C1810] mb-4 pb-2 border-b border-[#E8D5C0]">5. Cookies e Tecnologias de Rastreamento</h2>
          <p className="text-[#4A3728] leading-relaxed">
            Utilizamos cookies e tecnologias similares para melhorar a experiência de navegação, analisar o tráfego do site e medir o desempenho das nossas comunicações por e-mail (pixels de rastreamento de abertura e cliques na newsletter). Você pode desativar cookies nas configurações do seu navegador, mas isso pode afetar algumas funcionalidades do site.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-[#2C1810] mb-4 pb-2 border-b border-[#E8D5C0]">6. Retenção de Dados</h2>
          <p className="text-[#4A3728] leading-relaxed">
            Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades descritas nesta política, ou conforme exigido por lei. Dados de assinantes da newsletter são mantidos enquanto a inscrição estiver ativa. Após o cancelamento da inscrição, os dados são anonimizados em até 30 dias. Dados de clientes e transações são mantidos por 5 anos para fins fiscais e legais, conforme a legislação brasileira.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-[#2C1810] mb-4 pb-2 border-b border-[#E8D5C0]">7. Seus Direitos (LGPD — Art. 18)</h2>
          <p className="text-[#4A3728] leading-relaxed mb-4">Você tem os seguintes direitos em relação aos seus dados pessoais:</p>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { right: "Confirmação e acesso", desc: "Saber se tratamos seus dados e obter uma cópia deles." },
              { right: "Correção", desc: "Corrigir dados incompletos, inexatos ou desatualizados." },
              { right: "Anonimização ou exclusão", desc: "Solicitar a anonimização ou exclusão de dados desnecessários." },
              { right: "Portabilidade", desc: "Receber seus dados em formato estruturado e interoperável." },
              { right: "Revogação do consentimento", desc: "Retirar o consentimento dado a qualquer momento." },
              { right: "Oposição", desc: "Opor-se ao tratamento realizado com base em legítimo interesse." },
            ].map((item) => (
              <div key={item.right} className="bg-white rounded-lg p-4 border border-[#E8D5C0]">
                <h3 className="font-semibold text-[#2C1810] text-sm mb-1">{item.right}</h3>
                <p className="text-[#4A3728] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-[#4A3728] leading-relaxed mt-4">
            Para exercer qualquer um desses direitos, entre em contato pelo e-mail <a href="mailto:ola@camillavieira.art" className="text-[#C97064] hover:underline">ola@camillavieira.art</a>. Responderemos em até 15 dias úteis.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-[#2C1810] mb-4 pb-2 border-b border-[#E8D5C0]">8. Segurança dos Dados</h2>
          <p className="text-[#4A3728] leading-relaxed">
            Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui criptografia de dados em trânsito (HTTPS/TLS), autenticação segura e controle de acesso restrito. Embora nos esforcemos para proteger suas informações, nenhum método de transmissão pela internet é 100% seguro.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-[#2C1810] mb-4 pb-2 border-b border-[#E8D5C0]">9. Menores de Idade</h2>
          <p className="text-[#4A3728] leading-relaxed">
            Nossos serviços não são direcionados a menores de 18 anos. Não coletamos intencionalmente dados pessoais de crianças ou adolescentes. Se você acredita que coletamos dados de um menor sem o consentimento dos responsáveis, entre em contato imediatamente para que possamos excluí-los.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-[#2C1810] mb-4 pb-2 border-b border-[#E8D5C0]">10. Alterações nesta Política</h2>
          <p className="text-[#4A3728] leading-relaxed">
            Podemos atualizar esta Política de Privacidade periodicamente. Quando fizermos alterações significativas, notificaremos você por e-mail (se for assinante da newsletter) ou por aviso em destaque no site. A data da última atualização está sempre indicada no topo desta página.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-[#2C1810] mb-4 pb-2 border-b border-[#E8D5C0]">11. Contato e Reclamações</h2>
          <p className="text-[#4A3728] leading-relaxed">
            Para dúvidas, solicitações ou reclamações relacionadas ao tratamento dos seus dados pessoais, entre em contato com nossa Encarregada de Dados (DPO):
          </p>
          <div className="mt-4 bg-[#F5E6D3] rounded-lg p-6 text-[#2C1810]">
            <p><strong>Camilla Vieira</strong> — Encarregada de Dados (DPO)</p>
            <p className="mt-1">E-mail: <a href="mailto:ola@camillavieira.art" className="text-[#C97064] hover:underline">ola@camillavieira.art</a></p>
          </div>
          <p className="text-[#4A3728] leading-relaxed mt-4">
            Você também tem o direito de apresentar reclamação à <strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong> em <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-[#C97064] hover:underline">gov.br/anpd</a>.
          </p>
        </section>

        <div className="border-t border-[#E8D5C0] pt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <p className="text-[#8B6F47] text-sm">© {new Date().getFullYear()} Camilla Vieira — Todos os direitos reservados.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/termos" className="text-[#C97064] hover:underline">Termos de Uso</Link>
            <Link href="/" className="text-[#8B6F47] hover:text-[#2C1810]">Página inicial</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
