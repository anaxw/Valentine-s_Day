// App.tsx - Versão com cartas em grid 7x2 (desktop) e 2x7 (mobile) - Loop infinito na fita de filme
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHeart, FaGift, FaCalendarAlt, FaCamera, 
  FaMusic, FaStar, FaRegHeart,
  FaEnvelope, FaLeaf, FaInfinity, FaGem, FaClock as FaHistory, FaMask,
  FaHandHoldingHeart, FaGamepad, FaCheckCircle,
  FaArrowRight, FaArrowLeft, FaDice, FaRegLaugh, FaSpinner, FaPlay, 
  FaGraduationCap,FaEnvelopeOpen, FaRegEnvelope, FaRegEnvelopeOpen,
  FaPaperPlane
} from 'react-icons/fa';
import {  MdMarkEmailRead, MdOutlineMail } from 'react-icons/md';
import {GiLoveLetter, GiMailbox } from 'react-icons/gi';
import { IoMailOpenOutline, IoMailOutline, IoMailUnreadOutline} from 'react-icons/io5';
import { RiMailSendLine, RiMailCheckLine, RiMailUnreadLine } from 'react-icons/ri';

// Função auxiliar para tamanhos de ícone responsivos
function clampIconSize(min: number, max: number): number {
  if (typeof window !== 'undefined') {
    const screenWidth = window.innerWidth;
    if (screenWidth < 480) return min;
    if (screenWidth < 768) return min + (max - min) * 0.5;
    return max;
  }
  return max;
}

// Add CSS for the envelope card style
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .envelope-card {
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .envelope-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%);
    pointer-events: none;
    border-radius: 20px 20px 0 0;
  }
  .envelope-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 35px -10px rgba(0,0,0,0.2);
  }
  .envelope-seal {
    position: absolute;
    bottom: 12px;
    right: 12px;
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #ffd4d4, #ffb8b8);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    opacity: 0.7;
    transition: opacity 0.3s ease;
  }
  .envelope-card:hover .envelope-seal {
    opacity: 1;
    transform: scale(1.05);
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
  }
  .floating-heart {
    animation: float 3s ease-in-out infinite;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .spinning {
    animation: spin 0.5s ease-in-out;
  }
  
  /* Roulette Wheel Styles */
  .roulette-wheel-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem 0;
  }
  
.wheel {
  position: relative;
  width: clamp(200px, 70vw, 280px);
  height: clamp(200px, 70vw, 280px);
  border-radius: 50%;
 background-color: #ff6b6b; /* cor de fallback */
  background: conic-gradient(
    from 0deg,
    #FF6B6B 0deg 36deg,
    #FF4444 36deg 72deg,      /* cores mais fortes */
    #FF6666 72deg 108deg,
    #FF8888 108deg 144deg,
    #FFAAAA 144deg 180deg,
    #FF6B9E 180deg 216deg,
    #FF8EB8 216deg 252deg,
    #FFB0D0 252deg 288deg,
    #FF6B6B 288deg 324deg,
    #FF8E8E 324deg 360deg
  );
  box-shadow: 0 0 20px rgba(0,0,0,0.2), inset 0 0 20px rgba(255,255,255,0.5);
  transition: transform 0.3s ease;
  cursor: pointer;
}
  .wheel-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: clamp(40px, 15vw, 60px);
    height: clamp(40px, 15vw, 60px);
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 15px rgba(0,0,0,0.2);
    z-index: 10;
    font-size: clamp(18px, 6vw, 28px);
    color: #ff6b6b;
  }
  
  .wheel-pointer {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: clamp(12px, 4vw, 20px) solid transparent;
    border-right: clamp(12px, 4vw, 20px) solid transparent;
    border-top: clamp(25px, 8vw, 40px) solid #ff6b6b;
    filter: drop-shadow(0 2px 5px rgba(0,0,0,0.2));
    z-index: 5;
  }
  
  @keyframes wheelSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .spinning-wheel {
    animation: wheelSpin 2s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
  }
  
  .roulette-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 30px;
    padding: 1.5rem;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    border: 2px solid rgba(255, 107, 107, 0.3);
    transition: all 0.3s ease;
  }
  
  .result-card {
    background: linear-gradient(135deg, #fff5f5, #ffe0e7);
    border-radius: 20px;
    padding: 1rem;
    margin: 1rem 0;
    border-left: 5px solid #ff6b6b;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }

  /* Responsividade Global */
  @media (max-width: 968px) {
    .story-grid {
      flex-direction: column !important;
    }
    .story-grid > div {
      width: 100% !important;
    }
  }
  
  @media (max-width: 768px) {
    /* Estilo para grid de cartas em 2 colunas no mobile */
    .cards-grid {
      display: grid !important;
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 0.8rem !important;
    }
    
    .story-grid > div:first-child {
      margin-bottom: 1.5rem;
    }
    
    .photo-story-grid {
      flex-direction: column !important;
    }
    
    .photo-story-grid > div {
      width: 100% !important;
      min-height: auto !important;
    }
    
    .photo-story-grid img {
      height: auto !important;
      min-height: 300px !important;
      object-fit: cover !important;
    }
    
    .wheel-pointer {
      top: -18px;
    }
  }
  
  @media (max-width: 640px) {
    .cards-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 0.6rem !important;
    }
    
    .result-card {
      padding: 0.8rem;
    }
    
    .result-card p {
      font-size: 0.85rem;
    }
  }
  
  @media (max-width: 480px) {
    .cards-grid {
      gap: 0.5rem !important;
    }
    
    .roulette-card {
      padding: 1rem;
    }
    
    .wheel-pointer {
      top: -15px;
      border-left-width: 10px;
      border-right-width: 10px;
      border-top-width: 22px;
    }
  }
  
  /* Ajustes para telas muito pequenas */
  @media (max-width: 380px) {
    .cards-grid {
      gap: 0.4rem;
    }
    
    .wheel {
      width: 180px;
      height: 180px;
    }
    
    .wheel-center {
      width: 35px;
      height: 35px;
      font-size: 16px;
    }
  }

  /* Desktop: 7 colunas */
  @media (min-width: 769px) {
    .cards-grid {
      display: grid !important;
      grid-template-columns: repeat(7, 1fr) !important;
      gap: 0.8rem !important;
    }
  }
`;
document.head.appendChild(styleSheet);

// Quiz questions
const quizQuestions = [
  { id: 1, question: "O que a Ana prefere?", options: ["Gato", "Cachorro"], correct: "Gato" },
  { id: 2, question: "O que a Ana prefere?", options: ["Salgado", "Doce"], correct: "Doce" },
  { id: 3, question: "O que a Ana prefere?", options: ["Frio", "Calor"], correct: "Calor" },
  { id: 4, question: "Qual a cor favorita da Ana?", options: ["Roxo", "Preto", "Vermelho", "Azul"], correct: "Azul" },
  { id: 5, question: "Qual é meu doce favorito?", options: ["Pudim", "Sorvete", "Açaí", "Chocolate"], correct: "Sorvete" },
  { id: 6, question: "Ana prefere:", options: ["Praia", "Piscina"], correct: "Praia" },
  { id: 7, question: "Qual estilo musical favorito da Ana?", options: ["Funk", "Trap", "Sertanejo", "MPB"], correct: "Sertanejo" }
];

// 100 Reasons
const reasons = Array(100).fill(null).map((_, i) => {
  const reasonsList = [
    "Seu sorriso ilumina meu dia",
    "Seu jeito de cuidar de mim",
    "Sua risada contagiante",
    "Sua determinação em tudo que faz",
    "Seu carinho infinito",
    "Seu olhar profundo",
    "Sua forma de me fazer sentir especial",
    "Sua inteligência brilhante",
    "Sua honestidade",
    "Sua lealdade",
    "Sua paciência comigo",
    "Sua força nos momentos difíceis",
    "Sua delicadeza",
    "Sua paixão pela vida",
    "Sua criatividade",
    "Seu senso de humor",
    "Sua generosidade",
    "Sua empatia",
    "Sua coragem",
    "Sua autenticidade",
    "Sua forma de me escutar",
    "Sua companhia em silêncio",
    "Sua energia positiva",
    "Seus abraços apertados",
    "Seus beijos doces",
    "Sua forma de dançar",
    "Seu gosto musical",
    "Sua forma de ver o mundo",
    "Seu jeito único",
    "Sua persistência",
    "Sua sensibilidade",
    "Sua alegria contagiante",
    "Sua paz de espírito",
    "Seu talento escondido",
    "Sua sabedoria",
    "Sua humildade",
    "Sua bondade",
    "Sua forma de amar",
    "Seu apoio incondicional",
    "Sua presença mesmo na distância",
    "Sua forma de me motivar",
    "Sua lembrança constante",
    "Seus pequenos gestos",
    "Sua forma de me surpreender",
    "Sua confiança em mim",
    "Seu cheiro gostoso",
    "Sua forma de me encaixar no seu dia",
    "Sua prioridade em nós",
    "Seu futuro ao meu lado",
    "Sua forma de me fazer rir",
    "Seu jeito de me abraçar",
    "Sua voz quando canta",
    "Seu jeito de dançar na chuva",
    "Sua forma de me olhar",
    "Seu jeito carinhoso",
    "Sua preocupação comigo",
    "Sua forma de me defender",
    "Seu jeito único de ser",
    "Sua alma linda",
    "Seu coração gigante",
    "Sua forma de me completar",
    "Seu jeito de tornar tudo melhor",
    "Sua paciência infinita",
    "Sua forma de me entender",
    "Seu jeito de me fazer feliz",
    "Sua presença aconchegante",
    "Seu jeito de me chamar de amor",
    "Sua forma de me surpreender sempre",
    "Seu jeito de cuidar de mim quando estou doente",
    "Sua forma de me fazer sentir segura",
    "Seu jeito de me olhar com amor",
    "Sua capacidade de me fazer sentir especial",
    "Sua forma de me apoiar nos meus sonhos",
    "Seu jeito de celebrar minhas conquistas",
    "Sua forma de me fazer acreditar no amor",
    "Seu jeito de estar presente mesmo longe",
    "Sua forma de me fazer querer ser melhor",
    "Seu jeito de me dar paz",
    "Sua forma de me fazer sentir em casa",
    "Seu jeito de me fazer voar",
    "Sua forma de me segurar quando preciso",
    "Seu jeito de me soltar quando é hora",
    "Sua forma de me fazer completa",
    "Seu jeito de me amar do seu jeitinho",
    "Sua forma de me fazer sentir única",
    "Seu jeito de cuidar de nós",
    "Sua forma de priorizar nosso amor",
    "Seu jeito de me fazer sorrir até nos dias ruins",
    "Sua forma de me aquecer com um olhar",
    "Seu jeito de me fazer sentir desejada",
    "Sua forma de me fazer sentir amada",
    "Seu jeito de me fazer sentir viva",
    "Sua forma de me fazer querer viver cada dia ao seu lado",
    "Seu jeito de me fazer acreditar em finais felizes",
    "Sua forma de me fazer sentir que tudo vale a pena",
    "Seu jeito de me fazer ser eu mesma",
    "Sua forma de me aceitar como sou",
    "Seu jeito de me fazer sentir que pertenço a você",
    "Sua forma de me fazer sentir que somos uma"
  ];
  return reasonsList[i % reasonsList.length];
});

// Roulette options
const rouletteOptions = [
  { type: "lembranca", text: "Lembra do nosso primeiro beijo? Foi mágico! ✨", icon: FaHistory },
  { type: "elogio", text: "Você é a pessoa mais incrível que já conheci! 💖", icon: FaRegHeart },
  { type: "foto", text: "Sua foto favorita: aquela sua sorrindo no parque... 😊", icon: FaCamera },
  { type: "promessa", text: "Prometo te fazer sorrir todos os dias da minha vida! 💕", icon: FaHandHoldingHeart },
  { type: "engracado", text: "Lembra quando derrubamos o sorvete um no outro? Kkkk 🍦", icon: FaRegLaugh },
  { type: "lembranca", text: "Nossa primeira viagem juntas... Que saudade! 🚗", icon: FaHistory },
  { type: "elogio", text: "Seu cabelo está sempre perfeito, mesmo bagunçado! 😍", icon: FaRegHeart },
  { type: "foto", text: "A foto que tirei de você dormindo, tão fofa! 📸", icon: FaCamera },
  { type: "promessa", text: "Prometo nunca deixar você esquecer o quanto é especial! 💗", icon: FaHandHoldingHeart },
  { type: "engracado", text: "Aquele dia que dançamos na chuva... Molhados mas felizes! 🌧️", icon: FaRegLaugh }
];

const App: React.FC = () => {
  const [showLoveLetter, setShowLoveLetter] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [selectedCard, setSelectedCard] = useState<{ id: number; title: string; message: string; icon: any; color: string } | null>(null);
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; size: number; duration: number }>>([]);
  const [timeTogether, setTimeTogether] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // Quiz states
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  
  // Reasons states
  const [currentReasonIndex, setCurrentReasonIndex] = useState(0);
  
  // Roulette states
  const [rouletteResult, setRouletteResult] = useState<{ type: string; text: string; icon: any } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showWheel, setShowWheel] = useState(false);
  const [rotation, setRotation] = useState(0);
  
  // Window width state for responsive adjustments
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Tentar tocar música automaticamente ao carregar
  useEffect(() => {
    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsMusicPlaying(true);
          })
          .catch(() => {
          setIsMusicPlaying(false);
        })
      }
    }
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsMusicPlaying(true))
          .catch(error => console.log("Erro ao tocar música:", error));
      }
    }
  };

  // Relógio de contagem de tempo desde 15/02/2026 às 23h
  useEffect(() => {
    const startDate = new Date(2026, 1, 15, 23, 0, 0);
    
    const updateTimer = () => {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - startDate.getTime()) / 1000);
      
      if (diffInSeconds >= 0) {
        const days = Math.floor(diffInSeconds / (3600 * 24));
        const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((diffInSeconds % 3600) / 60);
        const seconds = diffInSeconds % 60;
        
        setTimeTogether({ days, hours, minutes, seconds });
      }
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Scroll automático da fita de filme (loop infinito suave)
  useEffect(() => {
    const filmStrip = document.getElementById('filmStrip');
    if (!filmStrip) return;

    let scrollInterval: number | undefined;
    let isHovering = false;

    const autoScroll = () => {
      if (!isHovering && filmStrip) {
        // Rola para a direita
        filmStrip.scrollBy({ left: 1, behavior: 'smooth' });
        
        // Quando chegar perto do fim, volta suavemente para o início (cria looping)
        if (filmStrip.scrollLeft + filmStrip.clientWidth >= filmStrip.scrollWidth - 10) {
          setTimeout(() => {
            filmStrip.scrollTo({ left: 0, behavior: 'smooth' });
          }, 100);
        }
      }
    };

    const startAutoScroll = () => {
      if (scrollInterval) clearInterval(scrollInterval);
      scrollInterval = window.setInterval(autoScroll, 30);
    };

    const stopAutoScroll = () => {
      if (scrollInterval) {
        window.clearInterval(scrollInterval);
        scrollInterval = undefined;
      }
    };

    const handleMouseEnter = () => {
      isHovering = true;
      stopAutoScroll();
    };

    const handleMouseLeave = () => {
      isHovering = false;
      startAutoScroll();
    };

    filmStrip.addEventListener('mouseenter', handleMouseEnter);
    filmStrip.addEventListener('mouseleave', handleMouseLeave);

    startAutoScroll();

    return () => {
      stopAutoScroll();
      filmStrip.removeEventListener('mouseenter', handleMouseEnter);
      filmStrip.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  // Corações flutuantes
  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart = {
        id: Date.now(),
        x: Math.random() * window.innerWidth,
        size: Math.random() * 30 + 20,
        duration: Math.random() * 5 + 5,
      };
      setHearts(prev => [...prev, newHeart]);
      
      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== newHeart.id));
      }, newHeart.duration * 1000);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Efeito de confetti
  useEffect(() => {
    if (showConfetti) {
      const colors = ['#ff6b6b', '#ff8e8e', '#ffb8b8', '#ffd4d4', '#ff9e9e'];
      for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '2px';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.animation = `confetti-fall ${Math.random() * 3 + 2}s linear forwards`;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
      }
      setTimeout(() => setShowConfetti(false), 1000);
    }
  }, [showConfetti]);

  const handleQuizAnswer = (questionId: number, answer: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

const handleQuizSubmit = () => {
  let correctCount = 0;
  quizQuestions.forEach(q => {
    if (quizAnswers[q.id] === q.correct) {
      correctCount++;
    }
  });
  const percentage = (correctCount / quizQuestions.length) * 100;
  setQuizScore(percentage);
  setQuizSubmitted(true);
  
  // Mostrar confetti apenas para 100%
  if (percentage === 100) {
    setShowConfetti(true);
  }
};

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const closeQuiz = () => {
    setShowQuiz(false);
    resetQuiz();
  };
  
  // Functions for Reasons - Slide style
  const nextReason = () => {
    setCurrentReasonIndex((prev) => (prev + 1) % reasons.length);
    setShowConfetti(true);
  };
  
  const prevReason = () => {
    setCurrentReasonIndex((prev) => (prev - 1 + reasons.length) % reasons.length);
    setShowConfetti(true);
  };
  
  const goToReason = (index: number) => {
    setCurrentReasonIndex(index);
    setShowConfetti(true);
  };
  
  
  const spinRoulette = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setRouletteResult(null);
    
    // Gerar rotação aleatória entre 1440 e 2520 graus (4 a 7 voltas completas)
    const randomRotations = 1440 + Math.random() * 1080;
    const newRotation = rotation + randomRotations;
    setRotation(newRotation);
    
    // Calcular resultado baseado na rotação final
    setTimeout(() => {
      const finalRotation = newRotation % 360;
      // Cada fatia tem 36 graus (360 / 10 opções)
      const segmentIndex = Math.floor(finalRotation / 36);
      const resultIndex = (10 - segmentIndex) % 10;
      const result = rouletteOptions[resultIndex];
      setRouletteResult(result);
      setIsSpinning(false);
      setShowConfetti(true);
    }, 2000);
  };
  
  const closeRoulette = () => {
    setShowWheel(false);
    setRouletteResult(null);
    setIsSpinning(false);
    setRotation(0);
  };

  // Cartões "Abra quando..." - 14 cartões
  const openWhenCards = [
    { 
      id: 1, 
      title: "Estiver feliz", 
      icon: GiLoveLetter,
      color: "#4CAF50",
      message: "Que bom que você está feliz! Saber disso me faz tão bem. Eu amo ver seu sorriso, ele ilumina meu mundo inteiro. Guarde esse momento e lembre-se: eu estou sempre torcendo pela sua felicidade. Continue assim, meu amor! ❤️"
    },
    { 
      id: 2, 
      title: "Estiver ansiosa", 
      icon: FaEnvelope,
      color: "#FF9800",
      message: "Respira fundo, meu amor. Tudo vai dar certo, confia em mim. Você é mais forte do que imagina, e eu estou aqui do seu lado pra te acalmar e te dar todo o suporte. Vamos juntas, passo a passo. Te amo!🧡 "
    },
    { 
      id: 3, 
      title: "Sentir saudades", 
      icon: MdOutlineMail,
      color: "#E91E63",
      message: "Sinto tanto a sua falta também... Mas lembre-se: a distância não importa quando o amor é verdadeiro. Estou sempre contigo em pensamento e coração. Em breve estaremos juntas de novo. Até lá, guarde esse abraço virtual gigante! 💕"
    },
    { 
      id: 4, 
      title: "Estiver triste", 
      icon: IoMailOutline,
      color: "#2196F3",
      message: "Meu amor, não fique triste. Eu sei que a vida tem altos e baixos, mas quero que saiba que você nunca está sozinha. Estou aqui pra te ouvir, te abraçar e te ajudar a passar por isso. Você é incrível e vai superar! Chore se precisar, mas depois se levante. Estou com você! 💖"
    },
    { 
      id: 5, 
      title: "Estiver com medo", 
      icon: RiMailSendLine,
      color: "#9C27B0",
      message: "Não tenha medo, meu amor. Você é muito mais forte do que qualquer desafio. Lembre-se de tudo que já superamos juntas. Estou aqui pra te proteger e te dar forças. Segura na minha mão  e vamos enfrentar qualquer coisa juntas! 💪💗"
    },
    { 
      id: 6, 
      title: "Se sentir fraca", 
      icon: FaRegEnvelope,
      color: "#FF5722",
      message: "Você não é fraca, meu amor! Todo mundo tem dias difíceis, isso não te define. Você é uma mulher incrível, forte e guerreira. Nos dias em que parecer difícil, lembre-se do tanto que você já conquistou. Eu acredito em você mais do que em qualquer outra pessoa. ❤️"
    },
    { 
      id: 7, 
      title: "Eu estiver chata", 
      icon: GiMailbox,
      color: "#FFC107",
      message: "Me desculpa se estou sendo chata, amor. Às vezes o estresse ou a rotina me pegam, mas nunca é culpa sua. Saiba que te amo e que qualquer coisa que eu tenha falado não é sobre você. Te amo pra sempre! 💕"
    },
    { 
      id: 8, 
      title: "Duvidar do meu amor", 
      icon: IoMailUnreadOutline,
      color: "#F44336",
      message: "Isso nunca, jamais vai ser verdade. Eu te amo mais do que palavras podem expressar. Se algum dia você duvidar, leia isso: você é o amor da minha vida, minha razão de sorrir, meu porto seguro. Nada nesse mundo muda o que sinto por você. Nunca duvide disso. 💖💖💖"
    },
    { 
      id: 9, 
      title: "Precisar de amor", 
      icon: MdMarkEmailRead,
      color: "#E91E63",
      message: "Eu te amo mais que todas as estrelas do céu, mais que todas as ondas do mar, mais que todos os grãos de areia. É um amor infinito, que só cresce a cada dia. Você é minha alma gêmea, minha melhor amiga, minha paixão. Eu te amo hoje, amanhã e para sempre! ♾️❤️"
    },
    { 
      id: 10, 
      title: "Tiver estressada", 
      icon: FaEnvelopeOpen,
      color: "#FF6B35",
      message: "Calma, amor... Respira. O estresse passa, a gente fica. Vamos fazer uma pausa juntas? Imagina a gente tomando um chá ou vendo um filme. Tudo vai se resolver, confia em mim. Tira um tempinho pra você, se cuida. Depois a gente conversa. Estou aqui! 🍵"
    },
    { 
      id: 11, 
      title: "Chateada comigo", 
      icon: FaRegEnvelopeOpen,
      color: "#795548",
      message: "Me desculpa por qualquer coisa que eu tenha feito. Nunca é minha intenção te magoar. Vamos conversar com calma, eu estou aqui pra te ouvir e melhorar. Ninguém é perfeito, mas meu amor por você é verdadeiro. Desculpa, meu amor. Me dá a chance de fazer as pazes? 💔"
    },
    { 
      id: 12, 
      title: "Em dúvida sobre nós", 
      icon: RiMailCheckLine,
      color: "#607D8B",
      message: "Nós somos feitas uma pra outra. Cada desafio que passamos só fortaleceu nosso amor. Não tenha dúvidas: você é a pessoa que eu escolhi, o amor da minha vida. Somos um time, e juntas somos mais fortes. Confia no nosso amor, ele é verdadeiro e resiste a tudo! ✨"
    },
    { 
      id: 13, 
      title: "Eu for grossa", 
      icon: FaPaperPlane,
      color: "#FF5252",
      message: "Me desculpa por ter sido grossa, meu amor. Às vezes eu falo sem pensar, mas nunca é contra você. Saiba que eu te amo e que vou tentar melhorar. Obrigada por ter paciência comigo. Você é a melhor coisa da minha vida! 💕"
    },
    { 
      id: 14, 
      title: "Estivermos brigando", 
      icon: RiMailUnreadLine,
      color: "#D32F2F",
      message: "Brigas acontecem, mas nada vai mudar o que sinto por você. Vamos resolver isso juntas, com calma e amor. Nós somos mais fortes do que qualquer discussão. Te amo e quero fazer as pazes. Vamos conversar? Saudades de te ver feliz! 💟"
    }
  ];

  const openMessageModal = (card: { id: number; title: string; message: string; icon: any; color: string }) => {
    setSelectedCard(card);
    setShowConfetti(true);
  };

  // Get previous and next reasons for slide preview
  const prevReasonText = reasons[(currentReasonIndex - 1 + reasons.length) % reasons.length];
  const nextReasonText = reasons[(currentReasonIndex + 1) % reasons.length];

  // Lista de fotos para o carrossel infinito
  const filmPhotos = [
    { src: "/photos/Foto4.jpeg", alt: "Momento especial 1" },
    { src: "/photos/Foto5.jpeg", alt: "Momento especial 2" },
    { src: "/photos/Foto6.jpeg", alt: "OBA Festival" },
    { src: "/photos/Foto7.jpeg", alt: "Momento especial 3" },
    { src: "/photos/Foto2.png", alt: "Momento especial 4" },
    { src: "/photos/Foto1.png", alt: "OBA Festival" },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden',
      fontFamily: "'Poppins', 'Segoe UI', sans-serif",
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 25%, #ffd1ff 50%, #ffe6f0 75%, #ffccdd 100%)',
    }}>
      {/* Player de Música */}
      <audio
        ref={audioRef}
        src="/music/nossa_musica.mp3"
        loop
        preload="auto"
      />

     

      {/* Camada de efeito de vidro */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(255,200,220,0.3) 0%, rgba(255,180,200,0.1) 100%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      
      {/* Partículas brilhantes */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.8) 1px, transparent 1px)',
        backgroundSize: 'clamp(25px, 8vw, 40px) clamp(25px, 8vw, 40px)',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.3
      }} />

      {/* Corações Flutuantes */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
        <AnimatePresence>
          {hearts.map(heart => (
            <motion.div
              key={heart.id}
              initial={{ y: '100vh', x: heart.x, opacity: 1, scale: 0 }}
              animate={{ y: '-10vh', opacity: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: heart.duration, ease: 'linear' }}
              style={{ position: 'absolute', left: heart.x, fontSize: heart.size, color: '#ff6b6b' }}
            >
              <FaHeart />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      // Header - Responsivo com ícone de música no header
<motion.header 
  initial={{ y: -100 }}
  animate={{ y: 0 }}
  style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backdropFilter: 'blur(20px)',
    background: 'rgba(255, 245, 250, 0.9)',
    borderBottom: '2px solid rgba(255, 107, 107, 0.3)',
    padding: 'clamp(0.6rem, 2vh, 1rem) clamp(0.8rem, 4vw, 1.5rem)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
  }}
>
  <div style={{
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem'
  }}>
    <motion.div 
      whileHover={{ scale: 1.05 }}
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
    >
      <FaHeart style={{ color: '#ff6b6b', filter: 'drop-shadow(0 0 10px #ff6b6b)' }} size={clampIconSize(20, 28)} />
<h1 style={{ 
  fontSize: 'clamp(1rem, 5vw, 1.8rem)', 
  fontWeight: 'bold',
  fontFamily: "'Dancing Script', 'Brush Script MT', cursive",  // ← Fonte cursiva
  background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
}}>
  Happy Valentine's Day
</h1>
    </motion.div>
    
    {/* Botão de Música no Header */}
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleMusic}
      style={{
        background: 'rgba(255, 245, 250, 0.95)',
        border: '2px solid rgba(255,107,107,0.4)',
        borderRadius: '50%',
        width: 'clamp(36px, 10vw, 44px)',
        height: 'clamp(36px, 10vw, 44px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}
    >
      {isMusicPlaying ? (
        <FaMusic size={clampIconSize(16, 22)} color="#ff6b6b" />
      ) : (
        <FaMusic size={clampIconSize(16, 22)} color="#ffb8b8" style={{ opacity: 0.6 }} />
      )}
    </motion.button>
  </div>
</motion.header>

      {/* Hero Section - Responsivo */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(5rem, 15vh, 8rem) clamp(0.8rem, 4vw, 1.5rem) clamp(2rem, 10vh, 3rem)',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%',
          background: 'radial-gradient(circle, rgba(255,107,107,0.2) 0%, rgba(255,200,220,0) 70%)',
          filter: 'blur(60px)',
          zIndex: 0
        }} />
        
        <div style={{ textAlign: 'center', zIndex: 10, maxWidth: '800px', width: '100%' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="floating-heart"
            >
              <FaHeart style={{ 
                color: '#ff6b6b', 
                fontSize: 'clamp(2.5rem, 12vw, 5rem)',
                marginBottom: '1rem',
                filter: 'drop-shadow(0 0 20px #ff6b6b)'
              }} />
            </motion.div>
            
            <h2 style={{
              fontSize: 'clamp(1.5rem, 7vw, 4rem)',
              fontWeight: 'bold',
              marginBottom: '0.8rem',
              color: '#ff6b6b',
              fontFamily: "'Dancing Script', 'Brush Script MT', cursive"
            }}>
              Feliz Dia dos Namorados
            </h2>
            
            <p style={{ 
              fontSize: 'clamp(0.9rem, 4vw, 1.5rem)', 
              marginBottom: '1.5rem',
              color: '#ff6b6b',
              fontWeight: '300'
            }}>
              Para o amor da minha vida
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ 
              display: 'flex', 
              gap: 'clamp(0.6rem, 3vw, 1.5rem)', 
              justifyContent: 'center', 
              flexWrap: 'wrap'
            }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLoveLetter(true)}
              style={{
                padding: 'clamp(0.6rem, 2.5vw, 1rem) clamp(1rem, 5vw, 2.5rem)',
                background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
                border: 'none',
                borderRadius: '50px',
                color: 'white',
                fontWeight: 'bold',
                fontSize: 'clamp(0.8rem, 3.5vw, 1.1rem)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 0 20px rgba(255,107,107,0.5)'
              }}
            >
              <FaGift size={clampIconSize(14, 20)} /> Carta Especial
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowConfetti(true)}
              style={{
                padding: 'clamp(0.6rem, 2.5vw, 1rem) clamp(1rem, 5vw, 2.5rem)',
                background: 'rgba(255,107,107,0.2)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,107,107,0.5)',
                borderRadius: '50px',
                color: '#ff6b6b',
                fontWeight: 'bold',
                fontSize: 'clamp(0.8rem, 3.5vw, 1.1rem)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FaStar size={clampIconSize(14, 20)} /> Celebrar
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO: CONTADOR DE TEMPO JUNTAS COM TÍTULO - Responsivo */}
      <section style={{ padding: 'clamp(1rem, 5vh, 4rem) clamp(0.8rem, 4vw, 1.5rem) clamp(1rem, 5vh, 1rem) clamp(0.8rem, 4vw, 1.5rem)', position: 'relative' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(15px)',
              borderRadius: 'clamp(20px, 6vw, 40px)',
              padding: 'clamp(1rem, 4vw, 2rem) clamp(0.8rem, 4vw, 1.5rem)',
              textAlign: 'center',
              border: '2px solid rgba(255, 107, 107, 0.3)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.5)'
            }}
          >
            {/* Título da contagem */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(0.5rem, 3vw, 1rem)',
              marginBottom: 'clamp(1rem, 5vw, 2rem)',
              flexWrap: 'wrap'
            }}>
              <FaHeart size={clampIconSize(20, 28)} color="#ff6b6b" />
              <h4 style={{
                fontSize: 'clamp(1.2rem, 5vw, 2rem)',
                fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
                background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}>
                Contagem do Amor
              </h4>
              <FaHeart size={clampIconSize(20, 28)} color="#ff6b6b" />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'clamp(0.6rem, 3vw, 1.5rem)',
              flexWrap: 'wrap',
              marginBottom: '1rem'
            }}>
              <div style={{ textAlign: 'center', flex: '1', minWidth: '70px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #ff6b6b20, #ff8e8e20)',
                  borderRadius: 'clamp(12px, 4vw, 20px)',
                  padding: 'clamp(0.6rem, 3vw, 1rem) clamp(0.5rem, 2vw, 1.2rem)',
                }}>
                  <div style={{ fontSize: 'clamp(1.5rem, 7vw, 3rem)', fontWeight: 'bold', color: '#ff6b6b', lineHeight: 1 }}>
                    {timeTogether.days}
                  </div>
                  <div style={{ fontSize: 'clamp(0.7rem, 3vw, 0.85rem)', color: '#ff8e8e', fontWeight: 500 }}>Dias</div>
                </div>
              </div>
              
              <div style={{ textAlign: 'center', flex: '1', minWidth: '70px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #ff6b6b20, #ff8e8e20)',
                  borderRadius: 'clamp(12px, 4vw, 20px)',
                  padding: 'clamp(0.6rem, 3vw, 1rem) clamp(0.5rem, 2vw, 1.2rem)',
                }}>
                  <div style={{ fontSize: 'clamp(1.5rem, 7vw, 3rem)', fontWeight: 'bold', color: '#ff6b6b', lineHeight: 1 }}>
                    {timeTogether.hours.toString().padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: 'clamp(0.7rem, 3vw, 0.85rem)', color: '#ff8e8e', fontWeight: 500 }}>Horas</div>
                </div>
              </div>
              
              <div style={{ textAlign: 'center', flex: '1', minWidth: '70px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #ff6b6b20, #ff8e8e20)',
                  borderRadius: 'clamp(12px, 4vw, 20px)',
                  padding: 'clamp(0.6rem, 3vw, 1rem) clamp(0.5rem, 2vw, 1.2rem)',
                }}>
                  <div style={{ fontSize: 'clamp(1.5rem, 7vw, 3rem)', fontWeight: 'bold', color: '#ff6b6b', lineHeight: 1 }}>
                    {timeTogether.minutes.toString().padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: 'clamp(0.7rem, 3vw, 0.85rem)', color: '#ff8e8e', fontWeight: 500 }}>Minutos</div>
                </div>
              </div>
              
              <div style={{ textAlign: 'center', flex: '1', minWidth: '70px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #ff6b6b20, #ff8e8e20)',
                  borderRadius: 'clamp(12px, 4vw, 20px)',
                  padding: 'clamp(0.6rem, 3vw, 1rem) clamp(0.5rem, 2vw, 1.2rem)',
                }}>
                  <div style={{ fontSize: 'clamp(1.5rem, 7vw, 3rem)', fontWeight: 'bold', color: '#ff6b6b', lineHeight: 1 }}>
                    {timeTogether.seconds.toString().padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: 'clamp(0.7rem, 3vw, 0.85rem)', color: '#ff8e8e', fontWeight: 500 }}>Segundos</div>
                </div>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                marginTop: '1rem',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <span style={{
                fontSize: 'clamp(0.8rem, 4vw, 1.3rem)',
                fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
                fontWeight: '500',
                color: '#ff8e8e',
                textAlign: 'center',
                display: 'inline-block'
              }}>
                ... Te Amando e Te Escolhendo
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Seção: Onde Tudo Começou - Com altura total corrigida */}
      <section style={{
        padding: 'clamp(2rem, 8vh, 4rem) 0',
        position: 'relative',
        background: '#fff5f5'
      }}>
        <div style={{ 
          width: '100%', 
          margin: '0 auto'
        }}>
          
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              textAlign: 'center',
              marginBottom: 'clamp(1.5rem, 6vh, 3rem)',
              padding: '0 clamp(0.8rem, 4vw, 1.5rem)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(0.5rem, 3vw, 1rem)',
              flexWrap: 'wrap'
            }}>
              <FaMask size={clampIconSize(24, 32)} color="#ff6b6b" />
              <h3 style={{
                fontSize: 'clamp(1.5rem, 6vw, 2.8rem)',
                fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
                color: '#ff6b6b',
                margin: 0
              }}>
                Onde Tudo Começou
              </h3>
              <FaMask size={clampIconSize(24, 32)} color="#ff6b6b" />
            </div>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 'clamp(80px, 20vw, 120px)' }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{
                height: '3px',
                background: '#ff6b6b',
                margin: '0.5rem auto 0'
              }}
            />
          </motion.div>

          <div style={{
            display: 'flex',
            gap: 'clamp(1rem, 5vw, 3rem)',
            alignItems: 'stretch',
            flexWrap: 'wrap',
            padding: '0 clamp(0.8rem, 4vw, 1.5rem)'
          }} className="story-grid">
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                flex: 1,
                minWidth: '280px',
              }}
            >
              <div style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: 'clamp(1rem, 4vw, 2rem)',
                border: '1px solid rgba(255, 107, 107, 0.3)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                height: '93%',
              }}>
                <p style={{
                  fontSize: 'clamp(0.85rem, 3.5vw, 1rem)',
                  lineHeight: '1.6',
                  color: '#4a4a4a',
                  marginBottom: '0.8rem'
                }}>
                  É engraçado pensar que tudo começou no <strong style={{ color: '#ff6b6b' }}>OBA Festival</strong> em <strong style={{ color: '#ff6b6b' }}>15 de Fevereiro de 2026</strong>, talvez um dos últimos lugares onde alguém esperaria encontrar o amor. Mas, de alguma forma, aconteceu.
                </p>
                
                <p style={{
                  fontSize: 'clamp(0.85rem, 3.5vw, 1rem)',
                  lineHeight: '1.6',
                  color: '#4a4a4a',
                  marginBottom: '0.8rem'
                }}>
                  E quanto mais eu penso nisso, mais acredito que era para acontecer. Afinal, nenhuma de nós tinha planejado estar lá. Foi uma decisão de última hora, sem combinações, sem expectativas, sem imaginar que aquele dia mudaria tantas coisas.
                </p>
                
                <p style={{
                  fontSize: 'clamp(0.85rem, 3.5vw, 1rem)',
                  lineHeight: '1.6',
                  color: '#4a4a4a',
                  marginBottom: '0.8rem'
                }}>
                  O mais curioso é que ambas tomamos atitudes que normalmente nunca tomaríamos. Pequenas escolhas, pequenos impulsos que, sem que soubéssemos, estavam nos conduzindo uma até a outra. Como não acreditar que o destino teve uma ajudinha nisso? Kkkkk
                </p>
                
                <p style={{
                  fontSize: 'clamp(0.85rem, 3.5vw, 1rem)',
                  lineHeight: '1.6',
                  color: '#ff6b6b',
                  marginBottom: '0.8rem',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                  Apenas estávamos no lugar certo, na hora certa, no momento certo.
                </p>
                
                <p style={{
                  fontSize: 'clamp(0.85rem, 3.5vw, 1rem)',
                  lineHeight: '1.6',
                  color: '#4a4a4a',
                  marginBottom: '0.8rem'
                }}>
                  E entre todas as lembranças daquele dia no <strong style={{ color: '#ff6b6b' }}>OBA Festival</strong>, existe uma que sempre vai me fazer sorrir: um Instagram escrito em um papel-toalha de um trailer de comida. Quem diria que algo tão simples se transformaria no início de uma das histórias de amor mais especiais da minha vida?
                </p>
                
                <p style={{
                  fontSize: 'clamp(0.85rem, 3.5vw, 1rem)',
                  color: '#ff6b6b',
                  marginTop: '1rem',
                  fontStyle: 'italic',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  Às vezes, os momentos mais importantes chegam sem avisar. E foi a partir desse dia, <strong>15 de Fevereiro de 2026 no OBA Festival</strong>, que tudo começou a fazer sentido... ✨
                </p>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  marginTop: '1rem',
                  padding: '0.8rem',
                  background: 'rgba(255, 107, 107, 0.1)',
                  borderRadius: '15px',
                  flexWrap: 'wrap'
                }}>
                  <FaCalendarAlt color="#ff6b6b" size={clampIconSize(18, 24)} />
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#ff6b6b', fontSize: 'clamp(0.8rem, 3vw, 0.9rem)' }}>15 de Fevereiro de 2026</div>
                    <div style={{ color: '#666', fontSize: 'clamp(0.7rem, 3vw, 0.85rem)' }}>OBA Festival - O dia que nossas vidas se encontraram</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                flex: 1,
                minWidth: '280px',
                display: 'flex',
              }}
            >
              <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                minHeight: 'clamp(400px, 70vh, 550px)',
                borderRadius: '20px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #fff5f5, #ffe0e7)',
                border: '2px solid rgba(255,107,107,0.3)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <img
                  src="/photos/Oba.png"
                  alt="OBA Festival - Nosso primeiro encontro"
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    flex: 1
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600/ffd4d4/ff6b6b?text=OBA+Festival+2026';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(255,107,107,0.1), rgba(255,200,220,0.05))',
                  pointerEvents: 'none'
                }} />
                
                <div style={{
                  position: 'absolute',
                  bottom: 'clamp(10px, 3vw, 20px)',
                  left: 'clamp(10px, 3vw, 20px)',
                  right: 'clamp(10px, 3vw, 20px)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  padding: 'clamp(0.6rem, 2.5vw, 0.9rem) clamp(0.8rem, 3vw, 1.2rem)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,107,107,0.3)'
                }}>
                  <div style={{ 
                    fontWeight: 'bold', 
                    color: '#ff6b6b', 
                    fontSize: 'clamp(0.75rem, 3.5vw, 0.9rem)',
                    letterSpacing: '0.5px'
                  }}>
                    🎭 OBA Festival - 15/02/2026 🎭
                  </div>
                  <div style={{ 
                    color: '#666', 
                    fontSize: 'clamp(0.65rem, 2.8vw, 0.75rem)',
                    marginTop: '2px'
                  }}>
                    O dia mais feliz das nossas vidas
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: 100 MOTIVOS - SLIDE STYLE WITH BACKGROUND CARDS - Responsivo */}
      <section style={{ padding: 'clamp(2rem, 8vh, 4rem) clamp(0.8rem, 4vw, 1.5rem)', position: 'relative' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              textAlign: 'center',
              marginBottom: 'clamp(1.5rem, 6vh, 3rem)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(0.5rem, 3vw, 1rem)',
              flexWrap: 'wrap'
            }}>
              <FaHeart size={clampIconSize(24, 32)} color="#ff6b6b" />
              <h3 style={{
                fontSize: 'clamp(1.5rem, 6vw, 2.8rem)',
                fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
                background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}>
                Motivos Pelos Quais Eu Te Amo
              </h3>
              <FaHeart size={clampIconSize(24, 32)} color="#ff6b6b" />
            </div>
          </motion.div>

          {/* Slide container com cards laterais no fundo - Responsivo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(0.3rem, 2vw, 1rem)',
            position: 'relative',
            perspective: '1000px'
          }}>
            {/* Seta Esquerda */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevReason}
              style={{
                background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
                border: 'none',
                borderRadius: '50%',
                width: 'clamp(30px, 10vw, 45px)',
                height: 'clamp(30px, 10vw, 45px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 5px 15px rgba(255,107,107,0.3)',
                transition: 'all 0.3s ease',
                zIndex: 10,
                flexShrink: 0
              }}
            >
              <FaArrowLeft size={clampIconSize(14, 20)} color="white" />
            </motion.button>

            {/* Card container com cards de fundo */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '450px',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {/* Card anterior (fundo atrás) - Escondido em mobile */}
              {windowWidth >= 640 && (
                <motion.div
                  initial={{ opacity: 0, x: -30, scale: 0.85 }}
                  animate={{ opacity: 0.6, x: -20, scale: 0.85 }}
                  style={{
                    position: 'absolute',
                    left: '-30px',
                    zIndex: 1,
                    width: '100%',
                    maxWidth: 'clamp(250px, 70vw, 380px)',
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '30px',
                    padding: 'clamp(0.8rem, 3vw, 1.5rem)',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 107, 107, 0.2)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    pointerEvents: 'none',
                  }}
                >
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#ffb8b8',
                    marginBottom: '0.5rem'
                  }}>
                    Anterior
                  </div>
                  <div style={{
                    fontSize: 'clamp(0.7rem, 3vw, 0.9rem)',
                    color: '#999',
                    lineHeight: '1.3'
                  }}>
                    {prevReasonText} 💖
                  </div>
                </motion.div>
              )}

              {/* Card principal (foco) */}
              <motion.div
                key={currentReasonIndex}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, type: "spring" }}
                style={{
                  position: 'relative',
                  zIndex: 3,
                  width: '100%',
                  maxWidth: '420px',
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: 'clamp(25px, 8vw, 40px)',
                  padding: 'clamp(1rem, 5vw, 2rem) clamp(1rem, 5vw, 1.8rem)',
                  textAlign: 'center',
                  border: '2px solid rgba(255, 107, 107, 0.5)',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.8)',
                  minHeight: 'clamp(200px, 40vh, 300px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <div style={{
                  fontSize: 'clamp(1rem, 5vw, 1.6rem)',
                  color: '#4a4a4a',
                  lineHeight: '1.4',
                  marginBottom: '1rem',
                  fontWeight: '500'
                }}>
                  {reasons[currentReasonIndex]} 💖
                </div>
                <div style={{
                  width: '40px',
                  height: '2px',
                  background: 'linear-gradient(90deg, #ffb8b8, #ff6b6b)',
                  margin: '0 auto'
                }} />
              </motion.div>

              {/* Card próximo (fundo atrás - direita) - Escondido em mobile */}
              {windowWidth >= 640 && (
                <motion.div
                  initial={{ opacity: 0, x: 30, scale: 0.85 }}
                  animate={{ opacity: 0.6, x: 20, scale: 0.85 }}
                  style={{
                    position: 'absolute',
                    right: '-30px',
                    zIndex: 1,
                    width: '100%',
                    maxWidth: 'clamp(250px, 70vw, 380px)',
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '30px',
                    padding: 'clamp(0.8rem, 3vw, 1.5rem)',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 107, 107, 0.2)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    pointerEvents: 'none',
                  }}
                >
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#ffb8b8',
                    marginBottom: '0.5rem'
                  }}>
                    Próximo
                  </div>
                  <div style={{
                    fontSize: 'clamp(0.7rem, 3vw, 0.9rem)',
                    color: '#999',
                    lineHeight: '1.3'
                  }}>
                    {nextReasonText} 💖
                  </div>
                </motion.div>
              )}
            </div>

            {/* Seta Direita */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextReason}
              style={{
                background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
                border: 'none',
                borderRadius: '50%',
                width: 'clamp(30px, 10vw, 45px)',
                height: 'clamp(30px, 10vw, 45px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 5px 15px rgba(255,107,107,0.3)',
                transition: 'all 0.3s ease',
                zIndex: 10,
                flexShrink: 0
              }}
            >
              <FaArrowRight size={clampIconSize(14, 20)} color="white" />
            </motion.button>
          </div>

          {/* Indicadores de progresso - Responsivo */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(0.2rem, 2vw, 0.4rem)',
            marginTop: 'clamp(1rem, 4vh, 2rem)',
            flexWrap: 'wrap'
          }}>
            {Array.from({ length: Math.ceil(reasons.length / 10) }).map((_, i) => (
              <motion.button
                key={i}
                onClick={() => goToReason(i * 10)}
                whileHover={{ scale: 1.2 }}
                style={{
                  width: Math.floor(currentReasonIndex / 10) === i ? 'clamp(20px, 8vw, 32px)' : 'clamp(6px, 2vw, 8px)',
                  height: 'clamp(4px, 1.5vw, 6px)',
                  borderRadius: '3px',
                  background: Math.floor(currentReasonIndex / 10) === i ? '#ff6b6b' : '#ffb8b8',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      </section>

    {/* SEÇÃO: NOSSA HISTÓRIA EM IMAGENS - CORRIGIDA */}
      <section style={{ 
        padding: 'clamp(2rem, 8vh, 4rem) 0', 
        position: 'relative',
        width: '100%',
        background: '#fff5f5'
      }}>
        <div style={{ 
          width: '100%', 
          margin: '0 auto'
        }}>
          
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              textAlign: 'center',
              marginBottom: 'clamp(1.5rem, 6vh, 3rem)',
              padding: '0 clamp(0.8rem, 4vw, 1.5rem)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(0.5rem, 3vw, 1rem)',
              flexWrap: 'wrap'
            }}>
            </div>
           
          </motion.div>

          <div style={{
            display: 'flex',
            width: '100%',
            minHeight: 'clamp(500px, 80vh, 600px)',
            flexWrap: 'wrap',
          }} className="photo-story-grid">
            
            {/* Lado Esquerdo - Imagem (50%) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                flex: '1',
                width: '50%',
                minWidth: '280px',
                position: 'relative',
                overflow: 'hidden',
                background: '#ffe0e7',
                minHeight: 'clamp(350px, 60vh, 600px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src="/photos/Foto1.png"
                alt="Momento especial nosso"
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  transition: 'transform 0.5s ease'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600/ffd4d4/ff6b6b?text=Nossa+Foto';
                }}
              />
            </motion.div>

            {/* Lado Direito - Texto (50%) - CORRIGIDO */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                flex: '1',
                width: '50%',
                minWidth: '280px',
                background: '#fff0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{
                maxWidth: '600px',
                width: '100%',
                padding: 'clamp(1.5rem, 5vw, 3rem)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxSizing: 'border-box'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  marginBottom: '1.5rem',
                  flexWrap: 'wrap'
                }}>
                  <FaHeart style={{ color: '#ff6b6b' }} size={clampIconSize(24, 32)} />
                  <h4 style={{
                    fontSize: 'clamp(1.3rem, 5vw, 2rem)',
                    fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
                    color: '#ff6b6b',
                    margin: 0,
                    textAlign: 'center'
                  }}>
                    Cada Foto, Uma História
                  </h4>
                  <FaHeart style={{ color: '#ff6b6b' }} size={clampIconSize(24, 32)} />
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: 'clamp(1rem, 4vw, 2rem)',
                  border: '1px solid rgba(255, 107, 107, 0.3)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <div style={{
                    fontSize: 'clamp(0.85rem, 3.5vw, 1rem)',
                    lineHeight: '1.6',
                    color: '#4a4a4a',
                    textAlign: 'left'
                  }}>
                    <p style={{ marginBottom: '0.8rem' }}>
                      Nem sempre é fácil explicar o que nós somos, porque algumas coisas simplesmente acontecem da forma mais bonita possível. Entre conversas, risadas, momentos bons e até os desafios que enfrentamos, fomos construindo algo que hoje faz parte de quem somos.
                    </p>
                    
                    <p style={{ marginBottom: '0.8rem' }}>
                      Cada dia ao seu lado trouxe novas memórias, novos aprendizados e a certeza de que algumas pessoas entram na nossa vida para deixar tudo mais especial. Você se tornou meu porto seguro nos dias difíceis, minha companhia favorita nos dias felizes e a pessoa com quem eu quero compartilhar cada conquista, cada sonho e cada momento simples da vida.
                    </p>
                    
                    <p style={{ marginBottom: '0.8rem' }}>
                      Nossa história não é perfeita, mas é real. É feita de carinho, compreensão, saudade, reencontros, planos para o futuro e principalmente amor. E são justamente essas imperfeições que tornam tudo tão único e tão nosso.
                    </p>
                  </div>
                </div>
                
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: '#ffe0e7',
                  borderRadius: '15px',
                  textAlign: 'center',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <FaInfinity style={{ color: '#ff6b6b', marginRight: '0.5rem' }} />
                  <span style={{ color: '#ff6b6b', fontWeight: '500', fontSize: 'clamp(0.85rem, 3.5vw, 1rem)' }}>
                    E ainda temos tantas fotos para tirar juntas... ❤️
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    
      {/* Seção: Quiz - Responsivo */}
      <section style={{ padding: 'clamp(1rem, 5vh, 2rem) clamp(0.8rem, 4vw, 1.5rem) clamp(2rem, 8vh, 4rem) clamp(0.8rem, 4vw, 1.5rem)', position: 'relative' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(15px)',
              borderRadius: 'clamp(25px, 8vw, 40px)',
              padding: 'clamp(1.5rem, 6vw, 2.5rem) clamp(1rem, 4vw, 2rem)',
              textAlign: 'center',
              border: '2px solid rgba(255, 107, 107, 0.4)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(0.5rem, 3vw, 1rem)',
              marginBottom: '0.8rem',
              flexWrap: 'wrap'
            }}>
              <FaGamepad size={clampIconSize(24, 32)} color="#ff6b6b" />
              <h3 style={{
                fontSize: 'clamp(1.3rem, 5vw, 2.5rem)',
                fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
                background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}>
                Vamos ver se você me conhece
              </h3>
              <FaGamepad size={clampIconSize(24, 32)} color="#ff6b6b" />
            </div>
            
            <p style={{
              color: '#ff8e8e',
              marginBottom: '1.5rem',
              fontSize: 'clamp(0.85rem, 3vw, 0.95rem)'
            }}>
              Será que você acerta tudo sobre mim? Vamos testar! 
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQuiz(true)}
              style={{
                padding: 'clamp(0.8rem, 3vw, 1rem) clamp(1.5rem, 5vw, 2rem)',
                background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
                border: 'none',
                borderRadius: '50px',
                color: 'white',
                fontWeight: 'bold',
                fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 0 20px rgba(255,107,107,0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              <FaStar size={clampIconSize(14, 18)} /> Iniciar Tentativa <FaStar size={clampIconSize(14, 18)} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO: CARTAS "ABRA QUANDO..." - Grid 7x2 no desktop, 2x7 no mobile */}
      <section style={{ 
        padding: 'clamp(2rem, 8vh, 4rem) clamp(0.8rem, 4vw, 1.5rem)', 
        position: 'relative',
        background: 'linear-gradient(135deg, #fff5f5 0%, #ffe0e7 100%)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              textAlign: 'center',
              marginBottom: 'clamp(2rem, 6vh, 3rem)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(0.5rem, 3vw, 1rem)',
              flexWrap: 'wrap'
            }}>
              <FaEnvelope size={clampIconSize(28, 40)} color="#ff6b6b" />
              <h3 style={{
                fontSize: 'clamp(1.8rem, 6vw, 2.8rem)',
                fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
                background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}>
                Abra Quando...
              </h3>
              <FaEnvelope size={clampIconSize(28, 40)} color="#ff6b6b" />
            </div>
            <p style={{
              color: '#ff8e8e',
              marginTop: '0.5rem',
              fontSize: 'clamp(0.85rem, 3.5vw, 1rem)',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              Abra cada carta no momento certo, cada uma tem uma mensagem especial para você 💌
            </p>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 'clamp(80px, 20vw, 120px)' }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{
                height: '3px',
                background: '#ff6b6b',
                margin: '0.8rem auto 0'
              }}
            />
          </motion.div>

          {/* Grid de cartas com CSS classes para responsividade */}
          <div className="cards-grid" style={{
            display: 'grid',
            gap: '0.8rem'
          }}>
            {openWhenCards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, delay: card.id * 0.02 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                onClick={() => openMessageModal(card)}
                style={{
                  cursor: 'pointer',
                  background: `linear-gradient(135deg, white, ${card.color}10)`,
                  borderRadius: 'clamp(16px, 4vw, 16px)',
                  padding: 'clamp(0.8rem, 2.5vw, 1.2rem)',
                  textAlign: 'center',
                  border: `2px solid ${card.color}40`,
                  boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  height: '68%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <div style={{
                  background: `${card.color}20`,
                  borderRadius: '50%',
                  padding: 'clamp(0.4rem, 2vw, 0.7rem)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {React.createElement(card.icon, { size: clampIconSize(20, 28), color: card.color })}
                </div>
                <h4 style={{
                  fontSize: 'clamp(0.7rem, 2.5vw, 0.85rem)',
                  fontWeight: 'bold',
                  color: card.color,
                  margin: 0,
                  lineHeight: '1.2'
                }}>
                  {card.title}
                </h4>
                <div style={{
                  width: '30px',
                  height: '2px',
                  background: card.color,
                  margin: '0 auto',
                  borderRadius: '2px'
                }} />
                <div style={{
                  fontSize: 'clamp(0.6rem, 2vw, 0.7rem)',
                  color: '#888',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  marginTop: 'auto'
                }}>
                  <FaRegHeart size={8} />
                  <span>Abrir</span>
                  <FaRegHeart size={8} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO: NUTRIÇÃO E FACULDADE - COM FUNDO #ffd6f1 */}
      <section style={{ 
        padding: 'clamp(2rem, 8vh, 4rem) clamp(0.8rem, 4vw, 1.5rem)', 
        position: 'relative',
        background: '#ffd6f1',
        borderTop: '2px solid rgba(255,107,107,0.2)',
        borderBottom: '2px solid rgba(255,107,107,0.2)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              textAlign: 'center',
              marginBottom: 'clamp(1.5rem, 6vh, 2.5rem)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(0.5rem, 3vw, 1rem)',
              flexWrap: 'wrap'
            }}>
              <FaLeaf size={clampIconSize(28, 40)} color="#ff6b6b" />
              <h3 style={{
                fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
                fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
                background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}>
                Sua Jornada na Nutrição
              </h3>
              <FaLeaf size={clampIconSize(28, 40)} color="#ff6b6b" />
            </div>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 'clamp(80px, 20vw, 120px)' }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{
                height: '3px',
                background: '#ff6b6b',
                margin: '0.8rem auto 0',
                borderRadius: '2px'
              }}
            />
          </motion.div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(1.5rem, 4vw, 2.5rem)',
            justifyContent: 'center'
          }}>

            {/* Lado Direito - Mensagem Motivacional */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                flex: 1,
                minWidth: '280px',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: 'clamp(20px, 6vw, 30px)',
                padding: 'clamp(1.2rem, 4vw, 2rem)',
                border: '2px solid rgba(255, 107, 107, 0.3)',
                boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  background: '#ff6b6b20',
                  borderRadius: '50%',
                  padding: '0.6rem',
                  display: 'inline-flex'
                }}>
                  <FaGraduationCap size={clampIconSize(28, 36)} color="#ff6b6b" />
                </div>
                <h4 style={{
                  fontSize: 'clamp(1rem, 4vw, 1.4rem)',
                  color: '#ff6b6b',
                  margin: 0
                }}>
                  Você é minha inspiração!
                </h4>
              </div>
              
              <p style={{
                fontSize: 'clamp(0.85rem, 3.5vw, 1rem)',
                lineHeight: '1.6',
                color: '#4a4a4a',
                marginBottom: '1rem'
              }}>
                Escolher Nutrição não foi à toa. Você tem um dom especial para cuidar das pessoas, 
                e essa faculdade é só o começo de uma jornada incrível onde você vai transformar vidas 
                através da alimentação e do conhecimento.
              </p>

              <p style={{
                fontSize: 'clamp(0.85rem, 3.5vw, 1rem)',
                lineHeight: '1.6',
                color: '#4a4a4a',
                marginBottom: '1rem'
              }}>
                Eu sei que nem sempre é fácil. Tem dias que cansa, que a matéria parece difícil, 
                que dá vontade de desistir. Mas olha pra trás e vê tudo que você já conquistou! 
                Cada prova, cada trabalho, cada madrugada estudando... Tudo isso está te construindo 
                como a profissional incrível que você vai se tornar.
              </p>

              <p style={{
                fontSize: 'clamp(0.85rem, 3.5vw, 1rem)',
                lineHeight: '1.6',
                color: '#4a4a4a',
                marginBottom: '1rem'
              }}>
                Quando os desafios aparecerem, nunca se esqueça do motivo que te fez começar. 
                Você é forte, dedicada e muito capaz. Não deixe que um momento difícil faça você 
                duvidar de todo o seu potencial e de tudo o que ainda vai conquistar.
              </p>

              <p style={{
                fontSize: 'clamp(0.85rem, 3.5vw, 1rem)',
                lineHeight: '1.6',
                color: '#4a4a4a',
                marginBottom: '1rem'
              }}>
                E saiba que eu vou estar sempre aqui, torcendo por você, apoiando você e acreditando nos 
                seus sonhos. Nos dias bons e nos dias difíceis, quero que você se lembre que não está sozinha. 
                Tenho muito orgulho de você e sei que seu futuro será incrível.
              </p>

              <div style={{
                background: '#ff6b6b10',
                borderRadius: '12px',
                padding: '1rem',
                borderLeft: `4px solid #ff6b6b`,
                marginBottom: '1rem'
              }}>
                <p style={{ fontSize: '0.85rem', color: '#ff6b6b', fontStyle: 'italic', margin: 0, lineHeight: '1.5' }}>
                  💪 "Não desista. Você é mais forte do que imagina. Cada obstáculo é uma oportunidade 
                  de crescer. Eu acredito em você mais do que em qualquer pessoa. Quando os dias difíceis 
                  chegarem, lembra que eu tô aqui na torcida, te apoiando em cada passo. Você vai 
                  conquistar tudo o que sonhar!"
                </p>
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                justifyContent: 'center',
                marginTop: '0.5rem'
              }}>
                <span style={{
                  background: '#ff6b6b15',
                  padding: '0.3rem 0.7rem',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  color: '#ff6b6b'
                }}>
                  🎯 Você consegue
                </span>
                <span style={{
                  background: '#ff6b6b15',
                  padding: '0.3rem 0.7rem',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  color: '#ff6b6b'
                }}>
                  📚 Estudo leva longe
                </span>
                <span style={{
                  background: '#ff6b6b15',
                  padding: '0.3rem 0.7rem',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  color: '#ff6b6b'
                }}>
                  💖 Eu tô contigo
                </span>
              </div>
            </motion.div>
            
            {/* Lado Esquerdo - Foto da Faculdade */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                flex: 1,
                minWidth: '280px',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: 'clamp(20px, 6vw, 30px)',
                padding: 'clamp(1.2rem, 4vw, 2rem)',
                border: '2px solid rgba(255, 107, 107, 0.3)',
                boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}
            >
              <div style={{
                position: 'relative',
                width: '100%',
                borderRadius: '20px',
                overflow: 'hidden',
                marginBottom: '1rem'
              }}>
                <img
                  src="/photos/Foto3.jpeg"
                  alt="Ana na faculdade de Nutrição"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '16px',
                    transition: 'transform 0.5s ease',
                    objectFit: 'cover'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600/ffd4d4/ff6b6b?text=Faculdade+de+Nutri%C3%A7%C3%A3o';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                  padding: '1rem 0.8rem 0.8rem',
                  borderRadius: '0 0 16px 16px',
                  textAlign: 'center'
                }}>
                  <span style={{
                    color: 'white',
                    fontSize: 'clamp(0.7rem, 3vw, 0.85rem)',
                    fontWeight: '500'
                  }}>
                    🎓 Sua caminhada na Nutrição
                  </span>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem'
              }}>
                <FaHeart size={14} color="#ff6b6b" />
                <span style={{ fontSize: '0.8rem', color: '#ff8e8e' }}>Você vai longe!</span>
                <FaHeart size={14} color="#ff6b6b" />
              </div>
            </motion.div>
          </div>

          {/* Mensagem final da seção */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              marginTop: 'clamp(2rem, 6vh, 3rem)',
              textAlign: 'center',
              padding: 'clamp(1rem, 3vw, 1.5rem)',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 'clamp(20px, 6vw, 30px)',
              border: '1px solid rgba(255, 107, 107, 0.2)'
            }}
          >
            <p style={{
              fontSize: 'clamp(0.9rem, 4vw, 1.1rem)',
              color: '#ff6b6b',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              ✨ "O conhecimento em Nutrição não é só sobre alimentos, é sobre cuidar de pessoas. E ninguém sabe cuidar melhor do que você." ✨
            </p>
            <p style={{
              fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
              color: '#888'
            }}>
              Continue firme, meu amor. O mundo precisa de uma nutricionista com o seu coração! 🥗💕
            </p>
          </motion.div>
        </div>
      </section>

        {/* SEÇÃO: NOSSA HISTÓRIA EM IMAGENS - CARROSSEL INFINITO */}
        <section style={{ 
          padding: 'clamp(2rem, 8vh, 4rem) clamp(0.8rem, 4vw, 1.5rem)', 
          position: 'relative',
          background: '#1a1a2e',
          borderTop: '3px solid #ff6b6b',
          borderBottom: '3px solid #ff6b6b',
          overflow: 'hidden',
          zIndex: 5
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            
            {/* Título da seção */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                textAlign: 'center',
                marginBottom: 'clamp(1.5rem, 5vh, 2.5rem)'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'clamp(0.5rem, 3vw, 1rem)',
                flexWrap: 'wrap'
              }}>
              </div>
            </motion.div>

            {/* Container do Carrossel */}
            <div style={{
              position: 'relative',
              width: '100%',
              borderRadius: 'clamp(16px, 4vw, 24px)',
              background: '#0a0a14',
              padding: 'clamp(20px, 4vw, 30px) 0',
            }}>
              
              {/* FAITA SUPERIOR - Perfurações do filme (totalmente opacas) */}
              <div style={{
                position: 'absolute',
                top: 'clamp(10px, 2vw, 15px)',
                left: 0,
                right: 0,
                height: 'clamp(14px, 3vw, 22px)',
                background: '#2a2a3e',
                zIndex: 10,
                borderTop: '2px solid #ff6b6b',
                borderBottom: '2px solid #ff6b6b',
              }}>
                {/* Orifícios redondos da fita superior */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0 10px',
                  gap: 'clamp(15px, 3vw, 25px)'
                }}>
                  {[...Array(30)].map((_, i) => (
                    <div key={`top-hole-${i}`} style={{
                      width: 'clamp(6px, 1.5vw, 10px)',
                      height: 'clamp(6px, 1.5vw, 10px)',
                      background: '#0a0a14',
                      borderRadius: '50%',
                      flexShrink: 0
                    }} />
                  ))}
                </div>
              </div>
              
              {/* FAITA INFERIOR - Perfurações do filme (totalmente opacas) */}
              <div style={{
                position: 'absolute',
                bottom: 'clamp(10px, 2vw, 15px)',
                left: 0,
                right: 0,
                height: 'clamp(14px, 3vw, 22px)',
                background: '#2a2a3e',
                zIndex: 10,
                borderTop: '2px solid #ff6b6b',
                borderBottom: '2px solid #ff6b6b',
              }}>
                {/* Orifícios redondos da fita inferior */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0 10px',
                  gap: 'clamp(15px, 3vw, 25px)'
                }}>
                  {[...Array(30)].map((_, i) => (
                    <div key={`bottom-hole-${i}`} style={{
                      width: 'clamp(6px, 1.5vw, 10px)',
                      height: 'clamp(6px, 1.5vw, 10px)',
                      background: '#0a0a14',
                      borderRadius: '50%',
                      flexShrink: 0
                    }} />
                  ))}
                </div>
              </div>

              {/* Carrossel com as imagens */}
              <div
                style={{
                  display: 'flex',
                  gap: 'clamp(0.8rem, 2vw, 1.5rem)',
                  overflow: 'hidden',
                  position: 'relative',
                  width: '100%',
                }}
              >
                <motion.div
                  animate={{ x: ['0%', '-50%'] }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop"
                  }}
                  style={{
                    display: 'flex',
                    gap: 'clamp(0.8rem, 2vw, 1.5rem)',
                    flexShrink: 0,
                  }}
                >
                  {/* Duas cópias das fotos para loop infinito */}
                  {[...filmPhotos, ...filmPhotos].map((photo, idx) => (
                    <motion.div
                      key={`photo-${idx}`}
                      whileHover={{ scale: 1.05, y: -5, zIndex: 20, transition: { duration: 0.2 } }}
                      style={{
                        flex: '0 0 auto',
                        width: 'clamp(200px, 28vw, 280px)',
                        background: '#fff',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                        border: '3px solid #ff6b6b',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => setShowConfetti(true)}
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        style={{
                          width: '100%',
                          height: 'clamp(180px, 25vw, 250px)',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x250/ffd4d4/ff6b6b?text=Nossa+Foto';
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Indicador de rolagem */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 'clamp(0.8rem, 3vw, 1.5rem)',
              marginTop: 'clamp(1.2rem, 4vh, 2rem)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255,107,107,0.2)',
                padding: '0.4rem 1rem',
                borderRadius: '50px',
              }}>
              </div>
            </div>
          </div>
        </section>

      {/* FOOTER - Rodapé romântico */}
      <footer style={{
        background: 'linear-gradient(135deg, #2d1b2e 0%, #1a0f1a 100%)',
        padding: 'clamp(2rem, 8vh, 3rem) clamp(0.8rem, 4vw, 1.5rem)',
        position: 'relative',
        borderTop: '3px solid #ff6b6b',
        color: '#fff'
      }}>
        {/* Efeito de corações no fundo */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 40%, rgba(255,107,107,0.08) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          pointerEvents: 'none'
        }} />
        
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
          textAlign: 'center'
        }}>
          {/* Linha decorativa com corações */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(0.8rem, 3vw, 1.5rem)',
            marginBottom: 'clamp(1.5rem, 5vh, 2rem)',
            flexWrap: 'wrap'
          }}>
            <FaHeart size={clampIconSize(18, 24)} color="#ff6b6b" />
            <FaHeart size={clampIconSize(22, 28)} color="#ff8e8e" />
            <FaHeart size={clampIconSize(26, 32)} color="#ff6b6b" />
            <FaHeart size={clampIconSize(22, 28)} color="#ff8e8e" />
            <FaHeart size={clampIconSize(18, 24)} color="#ff6b6b" />
          </div>

          {/* Mensagem principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p style={{
              fontSize: 'clamp(1rem, 4.5vw, 1.4rem)',
              fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
              color: '#ffb8b8',
              marginBottom: '1rem',
              letterSpacing: '0.5px'
            }}>
              "Amar você é a coisa mais natural do mundo"
            </p>
            
            <p style={{
              fontSize: 'clamp(0.8rem, 3.5vw, 0.95rem)',
              color: '#ddd',
              maxWidth: '600px',
              margin: '0 auto 1.5rem auto',
              lineHeight: '1.6',
              opacity: 0.9
            }}>
              Obrigada por fazer parte da minha vida. Cada dia ao seu lado é um presente 
              que eu guardo com todo carinho no coração.
            </p>
          </motion.div>

          {/* Linha divisória */}
          <div style={{
            width: 'clamp(100px, 30vw, 150px)',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #ff6b6b, #ffb8b8, #ff6b6b, transparent)',
            margin: '1.5rem auto'
          }} />

          {/* Informações românticas */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(1rem, 5vw, 2.5rem)',
            flexWrap: 'wrap',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              textAlign: 'center',
              background: 'rgba(255,107,107,0.1)',
              padding: '0.6rem 1.2rem',
              borderRadius: '30px',
              backdropFilter: 'blur(5px)'
            }}>
              <FaInfinity size={clampIconSize(14, 18)} color="#ff6b6b" style={{ display: 'inline-block', marginRight: '0.5rem' }} />
              <span style={{ fontSize: 'clamp(0.7rem, 3vw, 0.85rem)', color: '#ddd' }}>Amor Infinito</span>
            </div>
            <div style={{
              textAlign: 'center',
              background: 'rgba(255,107,107,0.1)',
              padding: '0.6rem 1.2rem',
              borderRadius: '30px',
              backdropFilter: 'blur(5px)'
            }}>
              <FaGem size={clampIconSize(14, 18)} color="#ff6b6b" style={{ display: 'inline-block', marginRight: '0.5rem' }} />
              <span style={{ fontSize: 'clamp(0.7rem, 3vw, 0.85rem)', color: '#ddd' }}>Para Sempre</span>
            </div>
            <div style={{
              textAlign: 'center',
              background: 'rgba(255,107,107,0.1)',
              padding: '0.6rem 1.2rem',
              borderRadius: '30px',
              backdropFilter: 'blur(5px)'
            }}>
              <FaHandHoldingHeart size={clampIconSize(14, 18)} color="#ff6b6b" style={{ display: 'inline-block', marginRight: '0.5rem' }} />
              <span style={{ fontSize: 'clamp(0.7rem, 3vw, 0.85rem)', color: '#ddd' }}>Juntas Sempre</span>
            </div>
          </div>

          {/* Direitos autorais românticos */}
          <div style={{
            fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)',
            color: '#888',
            borderTop: '1px solid rgba(255,107,107,0.2)',
            paddingTop: '1.2rem',
            marginTop: '0.5rem'
          }}>
            <p>Feito com <FaHeart size={10} color="#ff6b6b" style={{ display: 'inline-block', verticalAlign: 'middle' }} /> para a pessoa mais especial do mundo</p>
            <p style={{ marginTop: '0.3rem' }}>© {new Date().getFullYear()} — Nosso amor, nossa história</p>
          </div>

          {/* Corações flutuantes no rodapé */}
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            opacity: 0.3,
            animation: 'floatFooterHeart 6s ease-in-out infinite'
          }}>
            <FaHeart size={30} color="#ff6b6b" />
          </div>
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '15px',
            opacity: 0.2,
            animation: 'floatFooterHeart 8s ease-in-out infinite reverse'
          }}>
            <FaHeart size={45} color="#ff6b6b" />
          </div>
        </div>

        <style>{`
          @keyframes floatFooterHeart {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(10deg); }
          }
        `}</style>
      </footer>

      {/* Modal da Carta de Amor - Responsivo */}
      <AnimatePresence>
        {showLoveLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.8rem',
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(10px)'
            }}
            onClick={() => setShowLoveLetter(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              style={{
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                background: 'linear-gradient(135deg, #fff5f5, #ffe0e7)',
                borderRadius: 'clamp(20px, 6vw, 30px)',
                padding: 'clamp(1rem, 5vw, 2.5rem)',
                border: '2px solid rgba(255,107,107,0.3)',
                boxShadow: '0 0 50px rgba(255,107,107,0.3)',
                overflowY: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <GiLoveLetter style={{ color: '#ff6b6b', margin: '0 auto', marginBottom: '0.8rem' }} size={clampIconSize(35, 50)} />
                <h3 style={{ fontSize: 'clamp(1.3rem, 6vw, 2.5rem)', fontWeight: 'bold', background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Para meu amor,
                </h3>
              </div>
              <div style={{ color: '#4a4a4a' }}>
                <p style={{ marginBottom: '0.8rem', lineHeight: '1.6', fontSize: 'clamp(0.85rem, 3vw, 1rem)' }}>Cada momento ao seu lado é especial...</p>
                <p style={{ marginBottom: '0.8rem', lineHeight: '1.6', fontSize: 'clamp(0.85rem, 3vw, 1rem)' }}>Você trouxe cor aos meus dias, sentido aos meus sorrisos e paz ao meu coração. Desde aquele dia no OBA Festival, sabia que algo diferente estava acontecendo.</p>
                <p style={{ marginBottom: '0.8rem', lineHeight: '1.6', fontSize: 'clamp(0.85rem, 3vw, 1rem)' }}>Te amo mais do que palavras podem dizer. Que possamos celebrar muitos e muitos dias dos namorados juntas, sempre renovando esse amor que só cresce a cada dia.</p>
                <p style={{ marginBottom: '0.8rem', lineHeight: '1.6', textAlign: 'center', fontStyle: 'italic', fontSize: 'clamp(0.85rem, 3vw, 1rem)' }}>Com todo meu amor, hoje e sempre. 💕</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowLoveLetter(false)}
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  padding: 'clamp(0.7rem, 3vw, 0.9rem)',
                  background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
                  border: 'none',
                  borderRadius: '50px',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: 'clamp(0.85rem, 3vw, 1rem)'
                }}
              >
                <MdMarkEmailRead /> Fechar Carta
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal das mensagens dos cartões - Responsivo */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.8rem',
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(10px)'
            }}
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotateY: 90 }}
              transition={{ duration: 0.4, type: "spring" }}
              style={{
                maxWidth: '550px',
                width: '100%',
                maxHeight: '85vh',
                background: `linear-gradient(135deg, #fff8f8, #fff0f0)`,
                borderRadius: 'clamp(20px, 6vw, 30px)',
                padding: 'clamp(1rem, 5vw, 2rem)',
                border: `3px solid ${selectedCard.color}`,
                overflowY: 'auto',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ textAlign: 'center', marginTop: '0.5rem', marginBottom: '1rem' }}>
                <div style={{
                  background: `${selectedCard.color}20`,
                  borderRadius: '50%',
                  padding: '0.8rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.5rem'
                }}>
                  {React.createElement(selectedCard.icon, { size: clampIconSize(35, 48), color: selectedCard.color })}
                </div>
                <h3 style={{
                  fontSize: 'clamp(1rem, 5vw, 1.8rem)',
                  fontWeight: 'bold',
                  color: selectedCard.color,
                  marginBottom: '0.3rem'
                }}>
                  {selectedCard.title}
                </h3>
                <div style={{
                  width: '50px',
                  height: '2px',
                  background: selectedCard.color,
                  margin: '0.5rem auto',
                  borderRadius: '2px'
                }} />
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '20px',
                padding: 'clamp(1rem, 4vw, 1.5rem)',
                marginBottom: '1rem',
                fontSize: 'clamp(0.9rem, 4vw, 1.1rem)',
                lineHeight: '1.6',
                color: '#4a4a4a',
                textAlign: 'center',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
              }}>
                {selectedCard.message}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCard(null)}
                style={{
                  width: '100%',
                  padding: 'clamp(0.6rem, 3vw, 0.8rem)',
                  background: `linear-gradient(135deg, ${selectedCard.color}, ${selectedCard.color}cc)`,
                  border: 'none',
                  borderRadius: '50px',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 'clamp(0.85rem, 3vw, 1rem)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <IoMailOpenOutline /> Fechar Mensagem
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal da Roleta - Responsivo */}
      <AnimatePresence>
        {showWheel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.8rem',
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)'
            }}
            onClick={closeRoulette}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.4, type: "spring" }}
              style={{
                maxWidth: '600px',
                width: '100%',
                background: 'linear-gradient(145deg, #fff8f8, #ffe8ec)',
                borderRadius: 'clamp(25px, 8vw, 40px)',
                padding: 'clamp(1rem, 5vw, 2rem)',
                border: '3px solid #ff6b6b',
                boxShadow: '0 0 50px rgba(255,107,107,0.4)',
                textAlign: 'center'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ marginBottom: '1rem' }}>
                <FaDice size={clampIconSize(35, 50)} color="#ff6b6b" />
                <h3 style={{
                  fontSize: 'clamp(1.2rem, 5vw, 2rem)',
                  fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
                  background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginTop: '0.3rem'
                }}>
                  Roleta do Amor
                </h3>
              </div>

              {/* Roleta Giratória */}
              <div className="roulette-wheel-container">
                <div className="wheel-pointer" />
                <motion.div
                  className="wheel"
                  animate={{ rotate: rotation }}
                  transition={isSpinning ? { duration: 2, ease: "easeOut", type: "tween" } : {}}
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    cursor: isSpinning ? 'wait' : 'pointer'
                  }}
                  onClick={!isSpinning ? spinRoulette : undefined}
                >
                  <div className="wheel-center">
                    <FaHeart />
                  </div>
                </motion.div>
              </div>

              {/* Botão Girar */}
              {!rouletteResult && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={spinRoulette}
                  disabled={isSpinning}
                  style={{
                    marginTop: '1.5rem',
                    padding: 'clamp(0.6rem, 3vw, 0.8rem) clamp(1rem, 5vw, 2rem)',
                    background: isSpinning 
                      ? '#ccc' 
                      : 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
                    border: 'none',
                    borderRadius: '50px',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)',
                    cursor: isSpinning ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 0 20px rgba(255,107,107,0.4)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isSpinning ? (
                    <>
                      <FaSpinner className="spinning" /> Girando...
                    </>
                  ) : (
                    <>
                      <FaPlay size={clampIconSize(12, 16)} /> Girar Roleta
                    </>
                  )}
                </motion.button>
              )}

              {/* Resultado */}
              {rouletteResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="result-card"
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.8rem',
                    marginBottom: '0.8rem',
                    flexWrap: 'wrap'
                  }}>
                    {React.createElement(rouletteResult.icon, { size: clampIconSize(30, 40), color: '#ff6b6b' })}
                    <span style={{
                      fontSize: 'clamp(0.9rem, 4vw, 1.2rem)',
                      fontWeight: 'bold',
                      color: '#ff6b6b'
                    }}>
                      {rouletteResult.type === 'lembranca' && '📝 Lembrança'}
                      {rouletteResult.type === 'elogio' && '💖 Elogio'}
                      {rouletteResult.type === 'foto' && '📸 Foto'}
                      {rouletteResult.type === 'promessa' && '💍 Promessa'}
                      {rouletteResult.type === 'engracado' && '😂 Engraçado'}
                    </span>
                  </div>
                  <p style={{
                    fontSize: 'clamp(0.85rem, 3.5vw, 1rem)',
                    lineHeight: '1.4',
                    color: '#4a4a4a'
                  }}>
                    {rouletteResult.text}
                  </p>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={closeRoulette}
                style={{
                  marginTop: '1rem',
                  padding: 'clamp(0.5rem, 2.5vw, 0.7rem) clamp(1rem, 4vw, 1.5rem)',
                  background: 'rgba(255,107,107,0.15)',
                  border: '1px solid rgba(255,107,107,0.3)',
                  borderRadius: '50px',
                  color: '#ff6b6b',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: 'clamp(0.8rem, 3vw, 0.9rem)'
                }}
              >
                Fechar
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

            {/* Modal do Quiz - Responsivo */}
      <AnimatePresence>
        {showQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.8rem',
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              overflowY: 'auto'
            }}
            onClick={closeQuiz}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.4, type: "spring" }}
              style={{
                maxWidth: '650px',
                width: '100%',
                maxHeight: '90vh',
                background: 'linear-gradient(145deg, #fff8f8, #ffe8ec)',
                borderRadius: 'clamp(20px, 6vw, 30px)',
                padding: 'clamp(1rem, 5vw, 2rem)',
                border: '3px solid #ff6b6b',
                boxShadow: '0 0 50px rgba(255,107,107,0.4)',
                overflowY: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <FaGamepad size={clampIconSize(35, 50)} color="#ff6b6b" style={{ marginBottom: '0.3rem' }} />
                <h3 style={{
                  fontSize: 'clamp(1.2rem, 5vw, 2rem)',
                  fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
                  background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Quiz: Você me conhece?
                </h3>
              </div>

              {!quizSubmitted ? (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    {quizQuestions.map((q, idx) => (
                      <div key={q.id} style={{
                        marginBottom: '1rem',
                        padding: '0.8rem',
                        background: 'rgba(255,255,255,0.7)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,107,107,0.2)'
                      }}>
                        <p style={{
                          fontWeight: 'bold',
                          color: '#ff6b6b',
                          marginBottom: '0.6rem',
                          fontSize: 'clamp(0.85rem, 3.5vw, 1rem)'
                        }}>
                          {idx + 1}. {q.question}
                        </p>
                        <div style={{
                          display: 'flex',
                          gap: '0.6rem',
                          flexWrap: 'wrap'
                        }}>
                          {q.options.map(opt => (
                            <motion.button
                              key={opt}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleQuizAnswer(q.id, opt)}
                              style={{
                                padding: 'clamp(0.4rem, 2vw, 0.5rem) clamp(0.8rem, 3vw, 1.2rem)',
                                background: quizAnswers[q.id] === opt 
                                  ? 'linear-gradient(135deg, #ff6b6b, #ff8e8e)'
                                  : 'rgba(255,107,107,0.15)',
                                border: quizAnswers[q.id] === opt 
                                  ? 'none'
                                  : '1px solid rgba(255,107,107,0.3)',
                                borderRadius: '30px',
                                color: quizAnswers[q.id] === opt ? 'white' : '#ff6b6b',
                                cursor: 'pointer',
                                fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
                                fontWeight: '500'
                              }}
                            >
                              {opt}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
                    style={{
                      width: '100%',
                      padding: 'clamp(0.8rem, 3vw, 1rem)',
                      background: Object.keys(quizAnswers).length === quizQuestions.length
                        ? 'linear-gradient(135deg, #ff6b6b, #ff8e8e)'
                        : '#ccc',
                      border: 'none',
                      borderRadius: '50px',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)',
                      cursor: Object.keys(quizAnswers).length === quizQuestions.length ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <FaCheckCircle size={clampIconSize(14, 18)} /> Ver Resultado
                  </motion.button>
                </>
              ) : (
                <>
                  <div style={{
                    textAlign: 'center',
                    padding: 'clamp(1rem, 4vw, 1.5rem)',
                    background: quizScore === 100 
                      ? 'rgba(76, 175, 80, 0.15)' 
                      : quizScore > 50 
                        ? 'rgba(255, 152, 0, 0.15)'
                        : 'rgba(244, 67, 54, 0.15)',
                    borderRadius: '20px',
                    marginBottom: '1rem'
                  }}>
                    {/* Imagem baseada na pontuação */}
                    {quizScore === 100 ? (
                      <img 
                        src="/photos/bom.png" 
                        alt="Bom!" 
                        style={{ 
                          width: 'clamp(120px, 30vw, 180px)', 
                          height: 'auto',
                          marginBottom: '0.8rem',
                          borderRadius: '16px'
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : quizScore > 50 ? (
                      <img 
                        src="/photos/medio.png" 
                        alt="Médio" 
                        style={{ 
                          width: 'clamp(120px, 30vw, 180px)', 
                          height: 'auto',
                          marginBottom: '0.8rem',
                          borderRadius: '16px'
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <img 
                        src="/photos/ruim.png" 
                        alt="Ruim" 
                        style={{ 
                          width: 'clamp(120px, 30vw, 180px)', 
                          height: 'auto',
                          marginBottom: '0.8rem',
                          borderRadius: '16px'
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    
                    {/* Frases personalizadas */}
                    {quizScore === 100 ? (
                      <>
                        <h4 style={{ color: '#4CAF50', fontSize: 'clamp(1.3rem, 5vw, 1.8rem)', marginBottom: '0.3rem' }}>🎉 PERFEITA! 🎉</h4>
                        <p style={{ color: '#4a4a4a', fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)', fontWeight: '500' }}>
                          Estamos juntas para sempre, você realmente me conhece mesmo! ❤️
                        </p>
                      </>
                    ) : quizScore > 50 ? (
                      <>
                        <h4 style={{ color: '#FF9800', fontSize: 'clamp(1.2rem, 5vw, 1.6rem)', marginBottom: '0.3rem' }}>🤔 QUASE LÁ...</h4>
                        <p style={{ color: '#4a4a4a', fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)', fontWeight: '500' }}>
                          Não tá pronta para casar, mas vou te dar um tempinho para me conhecer melhor! 💭
                        </p>
                      </>
                    ) : (
                      <>
                        <h4 style={{ color: '#F44336', fontSize: 'clamp(1.2rem, 5vw, 1.6rem)', marginBottom: '0.3rem' }}>⚠️ ATENÇÃO! ⚠️</h4>
                        <p style={{ color: '#4a4a4a', fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)', fontWeight: '500' }}>
                          Vamos ter uma conversa séria agora! 😤
                        </p>
                      </>
                    )}
                    
                    <div style={{
                      marginTop: '0.8rem',
                      fontSize: 'clamp(1rem, 4vw, 1.2rem)',
                      fontWeight: 'bold',
                      color: '#ff6b6b'
                    }}>
                      {Math.round(quizScore)}% de acertos
                    </div>
                  </div>

                  {/* Botões lado a lado */}
                  <div style={{
                    display: 'flex',
                    gap: '0.8rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={resetQuiz}
                      style={{
                        flex: 1,
                        minWidth: '140px',
                        padding: 'clamp(0.6rem, 2.5vw, 0.8rem)',
                        background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
                        border: 'none',
                        borderRadius: '50px',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 'clamp(0.85rem, 3vw, 1rem)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <FaGamepad size={clampIconSize(12, 16)} /> Tentar Novamente
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={closeQuiz}
                      style={{
                        flex: 1,
                        minWidth: '100px',
                        padding: 'clamp(0.6rem, 2.5vw, 0.8rem)',
                        background: 'rgba(255,107,107,0.15)',
                        border: '1px solid rgba(255,107,107,0.3)',
                        borderRadius: '50px',
                        color: '#ff6b6b',
                        fontWeight: 'bold',
                        fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      Fechar
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        ::-webkit-scrollbar {
          width: 4px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255,107,107,0.1);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
          border-radius: 10px;
        }

        @media (max-width: 768px) {
          .nossa-historia-texto {
            padding: 0 20px;
            box-sizing: border-box;
          }
        }

        /* CORREÇÃO: Centralizar a seção de história no mobile SEM MARGENS LATERAIS */
        @media (max-width: 968px) {
          .photo-story-grid {
            flex-direction: column !important;
          }
          
          .photo-story-grid > div {
            width: 100% !important;
            min-height: auto !important;
          }
          
          /* Remove padding lateral do container de texto no mobile */
          .photo-story-grid > div:last-child {
            padding: 0 !important;
          }
          
          .photo-story-grid > div:first-child {
            min-height: clamp(300px, 50vh, 400px) !important;
          }
          
          .story-grid {
            flex-direction: column !important;
          }
          
          .story-grid > div {
            width: 100% !important;
          }
          
          .story-grid > div:first-child {
            margin-bottom: 1.5rem;
          }
          
          .story-grid > div:last-child {
            min-height: clamp(350px, 55vh, 450px) !important;
          }
        }

        @media (max-width: 768px) {
          .story-grid img {
            min-height: 100% !important;
            object-fit: cover !important;
          }
        }

        @media (max-width: 480px) {
          body {
            font-size: 13px;
          }
          
          .story-grid > div:first-child {
            margin-bottom: 0.8rem;
          }
          
          .story-grid > div:last-child {
            min-height: clamp(300px, 50vh, 400px) !important;
          }
          
          .photo-story-grid > div:first-child {
            min-height: clamp(250px, 40vh, 350px) !important;
          }
        }

        /* Melhorias de toque para mobile */
        @media (max-width: 768px) {
          button, 
          [role="button"],
          .wheel,
          .wheel-center {
            touch-action: manipulation;
          }
          
          button:active {
            transform: scale(0.98);
          }
        }

        /* Prevenir zoom em inputs no iOS */
        @media (max-width: 768px) {
          input, 
          select, 
          textarea {
            font-size: 16px;
          }
        }

        /* Safe area para notchs */
        @supports (padding: max(0px)) {
          .safe-top {
            padding-top: max(env(safe-area-inset-top), 0px);
          }
          .safe-bottom {
            padding-bottom: max(env(safe-area-inset-bottom), 0px);
          }
        }

        .film-strip-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .film-strip-scroll::-webkit-scrollbar-track {
          background: rgba(255,107,107,0.2);
          border-radius: 10px;
        }
        .film-strip-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #ff6b6b, #ffb8b8);
          border-radius: 10px;
        }
        .film-strip-scroll {
          scrollbar-width: thin;
          scrollbar-color: #ff6b6b rgba(255,107,107,0.2);
        }
      `}</style>
    </div>
  );
};

export default App;