import { Link } from "wouter";
import { useEffect } from "react";

export default function Termos() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Termos de Uso — Camilla Vieira";
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
          <h1 className="font-serif text-4xl md:text-5xl mt-6 mb-4">Termos de Uso</h1>
          <p className="text-[#C4A882] text-sm">Última atualização: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">

        <section>
          <p className="text-[#4A3728] leading-relaxed text-lg">
            Ao acessar e utilizar o site <strong>camillavieira.art</strong> e os serviços oferecidos pela <strong>Camilla Vieira — Fotografia e Arte</strong>, você concorda com os presentes Termos de Uso. Leia-os atentamente antes de utilizar nossos serviços.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-[#2C1810] mb-4 pb-2 border-b border-[#E8D5C0]">1. Aceitação dos Termos</h2>
          <p className="text-[#4A3728] leading-relaxed">
            O uso deste site implica a aceitação integral destes Termos de Uso e da nossa <Link href="/privacidade" className="text-[#C97064] hover:underline">Política de Privacidade</Link>. Caso não concorde com qualquer disposição, solicitamos que não utilize o site. Reservamo-nos o direito de modificar estes termos a qualquer momento, sendo sua responsabilidade verificar periodicamente se houve alterações.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-[#2C1810] mb-4 pb-2 border-b border-[#E8D5C0]">2. Descrição dos Serviços</h2>
          <p className="text-[#4A3728] leading-relaxed mb-4">
            O site <strong>camillavieira.art</strong> é uma plataforma digital de Camilla Vieira que oferece:
          </p>
          <ul className="space-y-2 text-[#4A3728]">
            {[
              "Portfólio fotográfico e artístico",
              "Informações sobre ensaios fotográficos e agendamento",
              "Venda de obras de arte originais, cerâmicas artesanais e prints fotográficos",
              "Mentorias de marca pessoal (individuais e em pacotes)",
              "Newsletter com conteúdo sobre fotografia, arte e marca pessoal",
              "Blog com artigos autorais",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#C97064] font-bold mt-0.5">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-[#2C1810] mb-4 pb-2 border-b border-[#E8D5C0]">3. Propriedade Intelectual</h2>
          <p className="text-[#4A3728] leading-relaxed mb-4">
            Todo o conteúdo disponível neste site — incluindo, sem limitação, fotografias, obras de arte, textos, logotipos, vídeos, áudios, layouts e código-fonte — é de propriedade exclusiva de Camilla Vieira e está protegido pela <strong>Lei nº 9.610/1998 (Lei de Direitos Autorais)</strong> e demais legislações aplicáveis.
          </p>
          <p className="text-[#4A3728] leading-relaxed">
            É expressamente proibido reproduzir, distribuir, modificar, exibir publicamente, criar obras derivadas ou utilizar qualquer conteúdo deste site para fins comerciais sem autorização prévia e por escrito de Camilla Vieira. O uso pessoal e não comercial é permitido desde que mantida a atribuição de autoria.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-[#2C1810] mb-4 pb-2 border-b border-[#E8D5C0]">4. Compras e Pagamentos</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-[#2C1810] mb-2">4.1 Processamento de Pagamentos</h3>
              <p className="text-[#4A3728] leading-relaxed text-sm">
                Os pagamentos são processados pela <strong>Stripe Inc.</strong>, plataforma segura e certificada PCI DSS. Não armazenamos dados de cartão de crédito em nossos servidores. Ao realizar uma compra, você concorda também com os <a href="https://stripe.com/br/legal/consumer" target="_blank" rel="noopener noreferrer" className="text-[#C97064] hover:underline">Termos de Serviço da Stripe</a>.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#2C1810] mb-2">4.2 Produtos Físicos (Obras, Cerâmicas, Prints)</h3>
              <p className="text-[#4A3728] leading-relaxed text-sm">
                Após a confirmação do pagamento, o prazo de envio é de até 10 dias úteis para obras e cerâmicas, e até 7 dias úteis para prints. O frete é calculado no momento da compra. Peças sob encomenda têm prazo específico informado na descrição do produto. Em caso de dano no transporte, entre em contato em até 48 horas após o recebimento com fotos do produto e da embalagem.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#2C1810] mb-2">4.3 Serviços (Ensaios e Mentorias)</h3>
              <p className="text-[#4A3728] leading-relaxed text-sm">
                Para ensaios fotográficos, é solicitado um sinal de 50% para confirmação da data. O saldo restante é pago até o dia do ensaio. Para mentorias, o pagamento integral é realizado no momento da contratação. O agendamento é confirmado por e-mail após a confirmação do pagamento.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#2C1810] mb-2">4.4 Cancelamentos e Reembolsos</h3>
              <p className="text-[#4A3728] leading-relaxed text-sm">
                Para produtos físicos, aceitamos devoluções em até 7 dias corridos após o recebimento (conforme o Código de Defesa do Consumidor — Lei nº 8.078/1990), desde que o produto esteja em perfeitas condições e na embalagem original. Para serviços, cancelamentos com mais de 72 horas de antecedência têm reembolso integral. Cancelamentos com menos de 72 horas estão sujeitos à retenção do sinal. Casos excepcionais são analisados individualmente.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-[#2C1810] mb-4 pb-2 border-b border-[#E8D5C0]">5. Newsletter e Comunicações</h2>
          <p className="text-[#4A3728] leading-relaxed">
            Ao se inscrever na newsletter, você consente em receber comunicações periódicas sobre fotografia, arte, marca pessoal e novidades de Camilla Vieira. Você pode cancelar sua inscrição a qualquer momento clicando no link "Descadastrar" presente em todos os e-mails ou entrando em contato pelo e-mail <a href="mailto:ola@camillavieira.art" className="text-[#C97064] hover:underline">ola@camillavieira.art</a>. Respeitamos sua escolha de frequência de recebimento conforme as preferências indicadas no momento da inscrição.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-[#2C1810] mb-4 pb-2 border-b border-[#E8D5C0]">6. Conduta do Usuário</h2>
          <p className="text-[#4A3728] leading-relaxed mb-4">Ao utilizar este site, você concorda em não:</p>
          <ul className="space-y-2 text-[#4A3728] text-sm">
            {[
              "Utilizar o site para fins ilegais ou não autorizados",
              "Reproduzir, copiar ou vender qualquer parte do conteúdo sem autorização",
              "Transmitir vírus, malware ou qualquer código malicioso",
              "Tentar acessar áreas restritas do site sem autorização",
              "Utilizar ferramentas automatizadas para coletar dados do site (scraping) sem permissão",
              "Fazer-se passar por Camilla Vieira ou qualquer pessoa associada ao site",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#C97064] font-bold mt-0.5">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-[#2C1810] mb-4 pb-2 border-b border-[#E8D5C0]">7. Limitação de Responsabilidade</h2>
          <p className="text-[#4A3728] leading-relaxed">
            Camilla Vieira não se responsabiliza por danos diretos, indiretos, incidentais ou consequentes resultantes do uso ou da impossibilidade de uso deste site, desde que não decorrentes de dolo ou culpa grave. O site é fornecido "como está", sem garantias de disponibilidade ininterrupta. Nos reservamos o direito de modificar, suspender ou encerrar qualquer parte do site a qualquer momento, sem aviso prévio.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-[#2C1810] mb-4 pb-2 border-b border-[#E8D5C0]">8. Links para Sites de Terceiros</h2>
          <p className="text-[#4A3728] leading-relaxed">
            Este site pode conter links para sites de terceiros. Esses links são fornecidos apenas para conveniência e não implicam endosso ou responsabilidade pelo conteúdo, políticas ou práticas desses sites. Recomendamos que você leia os termos e políticas de privacidade de qualquer site de terceiros que visitar.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-[#2C1810] mb-4 pb-2 border-b border-[#E8D5C0]">9. Lei Aplicável e Foro</h2>
          <p className="text-[#4A3728] leading-relaxed">
            Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Para dirimir quaisquer controvérsias decorrentes destes termos, fica eleito o foro da Comarca de Brasília, Distrito Federal, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-[#2C1810] mb-4 pb-2 border-b border-[#E8D5C0]">10. Contato</h2>
          <p className="text-[#4A3728] leading-relaxed">
            Para dúvidas sobre estes Termos de Uso, entre em contato:
          </p>
          <div className="mt-4 bg-[#F5E6D3] rounded-lg p-6 text-[#2C1810]">
            <p><strong>Camilla Vieira — Fotografia e Arte</strong></p>
            <p className="mt-1">Brasília, DF — Setor Sudoeste</p>
            <p className="mt-1">E-mail: <a href="mailto:ola@camillavieira.art" className="text-[#C97064] hover:underline">ola@camillavieira.art</a></p>
            <p className="mt-1">WhatsApp: <a href="https://wa.me/5511910868299" className="text-[#C97064] hover:underline">(11) 91086-8299</a></p>
          </div>
        </section>

        <div className="border-t border-[#E8D5C0] pt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <p className="text-[#8B6F47] text-sm">© {new Date().getFullYear()} Camilla Vieira — Todos os direitos reservados.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacidade" className="text-[#C97064] hover:underline">Política de Privacidade</Link>
            <Link href="/" className="text-[#8B6F47] hover:text-[#2C1810]">Página inicial</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
