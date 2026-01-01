import { useState, useRef, useEffect } from "react";
import avatarMaeAguia from "@/assets/avatar-mae-aguia.png";
import heroIntroVideo from "@/assets/hero-intro-video.mp4";
import heroVideo from "@/assets/hero-video.mp4";
import { useGA4, useCaktoPurchaseDetection } from "@/hooks/useGA4";
import Footer from "@/components/landing/Footer";

const CHECKOUT_URL = "https://pay.cakto.com.br/c88zju2_683076";

const Index = () => {
  const { trackCtaInicioClick, trackCheckoutClick, trackPurchase } = useGA4();
  useCaktoPurchaseDetection(trackPurchase);
  
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [countdown, setCountdown] = useState(15 * 60); // 15 minutos
  const videoRef = useRef<HTMLVideoElement>(null);

  // Timer de urgência
  useEffect(() => {
    if (!showContent) return;
    const timer = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, [showContent]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartVideo = () => {
    setVideoStarted(true);
    trackCtaInicioClick();
    videoRef.current?.play();
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  const handleSkipVideo = () => {
    setVideoEnded(true);
  };

  const handleQuizAnswer = (isYes: boolean) => {
    setQuizAnswered(true);
    if (isYes) {
      setShowContent(true);
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    }
  };

  const handleCheckoutClick = () => {
    trackCheckoutClick();
  };

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════════════════════════════════════════
          VÍDEO FULLSCREEN
      ═══════════════════════════════════════════════════════════ */}
      <div className={`fixed inset-0 z-50 bg-background flex items-center justify-center transition-all duration-700 ${videoEnded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Tela inicial - SIMPLIFICADA */}
        {!videoStarted && (
          <div 
            onClick={handleStartVideo}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center cursor-pointer px-6"
            style={{
              background: 'radial-gradient(ellipse at center top, hsl(var(--primary) / 0.15) 0%, hsl(var(--background)) 50%)'
            }}
          >
            {/* Avatar */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full scale-125"></div>
              <img 
                src={avatarMaeAguia} 
                alt="Mãe Águia" 
                className="relative w-32 h-32 rounded-full border-4 border-primary/50 object-cover"
              />
            </div>

            {/* Headline única e chocante */}
            <h1 className="text-4xl md:text-5xl font-black text-center leading-tight mb-4">
              <span className="text-destructive">ENGASGO</span>
              <span className="text-foreground"> mata bebê</span>
              <br />
              <span className="text-foreground">em </span>
              <span className="text-primary">4 minutos</span>
            </h1>

            <p className="text-muted-foreground text-lg text-center mb-8 max-w-xs">
              Você saberia o que fazer?
            </p>
            
            {/* Botão de play GRANDE */}
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-primary/50 blur-3xl rounded-full animate-pulse scale-150"></div>
              <div className="relative bg-primary rounded-full p-8 shadow-glow hover:scale-110 transition-transform">
                <span className="text-5xl text-primary-foreground">▶</span>
              </div>
            </div>

            <p className="text-foreground text-lg font-bold mb-2">
              Toque para assistir
            </p>
            <p className="text-muted-foreground text-sm">
              🔊 Ative o som • 2 min
            </p>
          </div>
        )}

        <video
          ref={videoRef}
          src={heroIntroVideo}
          playsInline
          onEnded={handleVideoEnd}
          className="w-full h-full object-cover"
        />
        
        {videoStarted && (
          <button 
            onClick={handleSkipVideo}
            className="absolute bottom-8 right-8 bg-secondary/80 backdrop-blur-sm border border-border px-4 py-2 rounded-full text-sm text-muted-foreground hover:text-foreground transition-all"
          >
            Pular →
          </button>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          PÓS-VÍDEO - QUIZ DE 1 PERGUNTA
      ═══════════════════════════════════════════════════════════ */}
      <div className={`transition-all duration-700 ${videoEnded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        {!showContent ? (
          <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md">
              
              {!quizAnswered ? (
                // QUIZ - UMA PERGUNTA APENAS
                <div className="gradient-card border-2 border-primary/30 rounded-2xl p-8 text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                    <img src={avatarMaeAguia} alt="Mãe Águia" className="relative w-28 h-28 mx-auto rounded-full border-4 border-primary/50 object-cover" />
                  </div>
                  
                  <div className="bg-destructive/20 border border-destructive/40 rounded-full px-4 py-2 inline-block mb-5">
                    <span className="text-destructive font-bold text-sm">⚠️ PERGUNTA IMPORTANTE</span>
                  </div>
                  
                  <h2 className="text-2xl font-black mb-3 leading-tight">
                    Você quer aprender a <span className="text-primary">SALVAR</span> seu bebê de um engasgo?
                  </h2>
                  
                  <p className="text-muted-foreground mb-8">
                    Em menos de 5 minutos você aprende técnicas que podem salvar uma vida.
                  </p>
                  
                  <div className="space-y-4">
                    <button
                      onClick={() => handleQuizAnswer(true)}
                      className="w-full gradient-primary text-primary-foreground py-5 rounded-xl font-black text-lg uppercase tracking-wide shadow-glow hover:scale-[1.02] transition-transform"
                    >
                      🦅 SIM, QUERO APRENDER!
                    </button>
                    
                    <button
                      onClick={() => handleQuizAnswer(false)}
                      className="w-full bg-secondary/50 text-muted-foreground py-3 rounded-xl text-sm border border-border/50 hover:border-border transition-all"
                    >
                      Não, tenho outras pessoas pra me ajudar
                    </button>
                  </div>
                </div>
              ) : (
                // RESPOSTA NEGATIVA - RECONSIDERAÇÃO RÁPIDA
                <div className="gradient-card border-2 border-destructive/30 rounded-2xl p-8 text-center">
                  <span className="text-5xl mb-4 block">💔</span>
                  
                  <h2 className="text-xl font-black mb-3">
                    E se essas pessoas <span className="text-destructive">não estiverem por perto</span>?
                  </h2>
                  
                  <div className="bg-secondary/80 border border-border rounded-xl p-4 mb-6 text-left">
                    <p className="text-foreground text-sm leading-relaxed">
                      Um bebê de <span className="text-primary font-bold">1 ano</span> em Petrópolis engasgou com maçã. 
                      Os adultos presentes <span className="text-destructive font-bold">não sabiam o que fazer</span>. 
                      Levou 11 minutos até chegar ajuda. Foi tarde demais.
                    </p>
                  </div>
                  
                  <p className="text-foreground font-bold mb-6">
                    Você quer estar preparada?
                  </p>
                  
                  <button
                    onClick={() => { setShowContent(true); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100); }}
                    className="w-full gradient-primary text-primary-foreground py-4 rounded-xl font-black uppercase shadow-glow hover:scale-[1.02] transition-transform"
                  >
                    🛡️ Sim, quero me preparar
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          // CONTEÚDO FINAL - DIRETO AO PONTO
          <>
            {/* TIMER FIXO NO TOPO */}
            <div className="fixed top-0 left-0 right-0 z-40 bg-destructive/95 backdrop-blur-sm py-2 px-4">
              <div className="flex items-center justify-center gap-3">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span className="text-white font-bold text-sm">
                  Oferta expira em: <span className="font-mono text-lg">{formatTime(countdown)}</span>
                </span>
              </div>
            </div>

            {/* CTA FIXO NO RODAPÉ */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border p-4">
              <a
                href={CHECKOUT_URL}
                onClick={handleCheckoutClick}
                className="block w-full max-w-md mx-auto gradient-primary py-4 rounded-xl font-black text-primary-foreground text-center uppercase tracking-wide shadow-glow hover:scale-[1.02] transition-transform"
              >
                🦅 GARANTIR MEU ACESSO →
              </a>
              <div className="flex items-center justify-center gap-3 mt-2 text-muted-foreground text-xs">
                <span>🔒 Seguro</span>
                <span>•</span>
                <span>🛡️ 7 dias garantia</span>
                <span>•</span>
                <span>💳 Parcele</span>
              </div>
            </div>

            <div className="container py-6 pt-16 pb-40">
              
              {/* HERO RÁPIDO */}
              <section className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 mb-4">
                  <span className="text-green-400 font-bold text-sm">🦅 Você é uma MÃE ÁGUIA!</span>
                </div>

                <div className="mb-6">
                  <video 
                    src={heroVideo} 
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full max-w-[280px] mx-auto rounded-2xl border-2 border-primary/30 shadow-glow"
                  />
                </div>

                <h1 className="text-2xl font-black leading-tight mb-4">
                  Aprenda a proteger seu bebê <span className="text-primary">para sempre</span>
                </h1>
                
                <p className="text-muted-foreground">
                  Acesso vitalício ao Kit completo de primeiros socorros infantis
                </p>
              </section>

              {/* O QUE VOCÊ RECEBE - COMPACTO */}
              <section className="gradient-card border border-border rounded-2xl p-6 mb-8">
                <h2 className="font-black text-lg mb-4 text-center">
                  O que está incluído:
                </h2>
                
                <div className="space-y-3">
                  {[
                    "Guia completo de primeiros socorros",
                    "Técnica de desengasgo passo a passo",
                    "Checklist de sinais de alerta",
                    "Atualizações vitalícias incluídas",
                    "BÔNUS: Grupo VIP de mães"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-primary">✓</span>
                      <span className="text-foreground text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* GARANTIAS - COMPACTO */}
              <section className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                  <span className="text-2xl mb-1 block">🛡️</span>
                  <p className="text-green-400 font-bold text-sm">7 dias garantia</p>
                </div>
                <div className="bg-secondary/50 border border-border rounded-xl p-4 text-center">
                  <span className="text-2xl mb-1 block">♾️</span>
                  <p className="text-foreground font-bold text-sm">Acesso vitalício</p>
                </div>
              </section>

              {/* PROVA SOCIAL */}
              <section className="bg-secondary/50 border border-border rounded-2xl p-5 mb-8">
                <p className="text-center text-muted-foreground text-sm mb-3">
                  Mais de <span className="text-primary font-bold">2.000+ mães</span> já estão protegendo seus filhotes
                </p>
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
              </section>

              {/* CTA PRINCIPAL */}
              <section className="gradient-offer border-2 border-primary/40 rounded-2xl p-8 text-center shadow-offer mb-8">
                <div className="bg-primary/30 border border-primary inline-block px-4 py-2 rounded-full text-sm font-bold uppercase mb-4">
                  👑 Oferta de Fundadora
                </div>

                <h2 className="text-2xl font-black mb-3">
                  Garanta agora seu acesso
                </h2>
                
                <p className="text-muted-foreground mb-6 text-sm">
                  Condições especiais para Mães Águia no checkout
                </p>

                <a
                  href={CHECKOUT_URL}
                  onClick={handleCheckoutClick}
                  className="block w-full gradient-primary py-5 rounded-xl font-black text-primary-foreground text-lg uppercase shadow-glow hover:scale-[1.02] transition-transform"
                >
                  🦅 VER OFERTA ESPECIAL →
                </a>
              </section>
              
              <Footer />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
