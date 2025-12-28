import { useEffect, useState, useRef } from "react";
import { Shield, CheckCircle, Printer, Home } from "lucide-react";
import { useGA4 } from "@/hooks/useGA4";
import { Link, useSearchParams } from "react-router-dom";

const ThankYou = () => {
  const { trackPurchase } = useGA4();
  const [searchParams] = useSearchParams();
  const [currentDate] = useState(new Date());
  const hasTracked = useRef(false);
  
  const [protocolNumber] = useState(() => {
    // Usa transaction_id do Cakto se disponível, senão gera um único
    const transactionId = searchParams.get('transaction_id') || searchParams.get('order_id');
    if (transactionId) return `MZ-${transactionId.toUpperCase().slice(-8)}`;
    return `MZ-${Date.now().toString(36).toUpperCase()}`;
  });

  // Dispara evento de purchase ao carregar a página (apenas uma vez)
  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;
    
    // Dispara purchase com dados do Cakto se disponíveis
    trackPurchase();
    
    // Limpa parâmetros da URL para evitar tracking duplicado em refresh
    if (searchParams.toString()) {
      window.history.replaceState({}, '', '/obrigado');
    }
  }, [trackPurchase, searchParams]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      {/* Comprovante estilo máquina Cielo */}
      <div className="w-full max-w-sm">
        {/* Efeito de papel rasgado no topo */}
        <div className="h-4 bg-foreground/5 rounded-t-lg relative overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,hsl(var(--background))_8px,hsl(var(--background))_16px)]" />
        </div>

        {/* Corpo do comprovante */}
        <div className="bg-foreground/[0.03] border-x border-foreground/10 px-6 py-8 font-mono text-sm">
          
          {/* Header com ícone de segurança */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 border-2 border-primary rounded-full mb-4 animate-pulse">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            
            <div className="text-xs text-muted-foreground tracking-widest mb-2">
              ═══════════════════════════
            </div>
            
            <h1 className="text-lg font-black text-primary tracking-wider mb-1">
              VOCÊ ACABOU DE ATIVAR O
            </h1>
            <h2 className="text-xl font-black text-foreground tracking-wide">
              SISTEMA DE PROTEÇÃO
            </h2>
            <h2 className="text-2xl font-black text-primary tracking-widest">
              MAMÃEZEN
            </h2>
            
            <div className="text-xs text-muted-foreground tracking-widest mt-2">
              ═══════════════════════════
            </div>
          </div>

          {/* Status de aprovação */}
          <div className="flex items-center justify-center gap-2 bg-green-500/20 border border-green-500/40 rounded-lg py-3 px-4 mb-6">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-bold text-sm tracking-wide">
              PAGAMENTO APROVADO
            </span>
          </div>

          {/* Linha pontilhada */}
          <div className="border-t-2 border-dashed border-foreground/20 my-6" />

          {/* Informações do protocolo */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-xs tracking-wider">PROTOCOLO:</span>
              <span className="text-primary font-black text-sm tracking-widest">
                MÃE-ÁGUIA-ATIVADO
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-xs tracking-wider">Nº TRANSAÇÃO:</span>
              <span className="text-foreground font-bold text-xs">{protocolNumber}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-xs tracking-wider">DATA/HORA:</span>
              <span className="text-foreground font-bold text-xs">{formatDate(currentDate)}</span>
            </div>
          </div>

          {/* Linha pontilhada */}
          <div className="border-t-2 border-dashed border-foreground/20 my-6" />

          {/* Detalhes do produto */}
          <div className="space-y-3">
            <div className="text-center">
              <span className="text-xs text-muted-foreground tracking-widest">PRODUTO</span>
              <p className="text-foreground font-black text-base mt-1">
                Kit MamãeZen — Vitalício
              </p>
            </div>

            <div className="flex justify-between items-center bg-secondary/50 rounded-lg p-3">
              <span className="text-muted-foreground text-xs tracking-wider">VALOR:</span>
              <span className="text-primary font-black text-xl">R$ 49,90</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-xs tracking-wider">FORMA:</span>
              <span className="text-foreground font-bold text-sm">Pagamento único</span>
            </div>
          </div>

          {/* Linha pontilhada */}
          <div className="border-t-2 border-dashed border-foreground/20 my-6" />

          {/* Selo de confirmação */}
          <div className="text-center space-y-3">
            <div className="inline-block bg-primary/10 border-2 border-primary/30 rounded-xl p-4">
              <p className="text-4xl mb-2">🦅</p>
              <p className="text-primary font-black text-sm tracking-wider">
                VOCÊ É UMA MÃE ÁGUIA!
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Acesso vitalício liberado
              </p>
            </div>
          </div>

          {/* Linha pontilhada */}
          <div className="border-t-2 border-dashed border-foreground/20 my-6" />

          {/* Mensagem de orientação */}
          <div className="bg-secondary/70 border border-border rounded-lg p-4 text-center">
            <p className="text-foreground text-xs leading-relaxed">
              📧 Você receberá o <span className="text-primary font-bold">acesso completo</span> no email cadastrado em até <span className="font-bold">5 minutos</span>.
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              Verifique também a caixa de spam.
            </p>
          </div>

          {/* Linha pontilhada */}
          <div className="border-t-2 border-dashed border-foreground/20 my-6" />

          {/* Footer do comprovante */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground tracking-wider">
              ════════════════════════════
            </p>
            <p className="text-xs text-muted-foreground">
              MAMÃEZEN DIGITAL LTDA
            </p>
            <p className="text-xs text-muted-foreground">
              CNPJ: XX.XXX.XXX/0001-XX
            </p>
            <p className="text-xs text-muted-foreground tracking-wider">
              ════════════════════════════
            </p>
          </div>

        </div>

        {/* Efeito de papel rasgado no fundo */}
        <div className="h-4 bg-foreground/5 rounded-b-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,hsl(var(--background))_8px,hsl(var(--background))_16px)]" />
        </div>

        {/* Botões de ação */}
        <div className="mt-6 space-y-3">
          <button 
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 bg-secondary border border-border py-3 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground hover:border-primary transition-all"
          >
            <Printer className="w-4 h-4" />
            Imprimir Comprovante
          </button>

          <Link 
            to="/"
            className="w-full flex items-center justify-center gap-2 gradient-primary py-4 rounded-xl text-base font-black text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform"
          >
            <Home className="w-5 h-5" />
            Voltar ao Início
          </Link>
        </div>

        {/* Mensagem final */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          💜 Obrigada por confiar no MamãeZen
        </p>
      </div>
    </div>
  );
};

export default ThankYou;
