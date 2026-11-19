import { Children, cloneElement, useEffect, useRef, useState } from 'react';
import { BookOpen, Check, ChevronLeft, ChevronRight, CreditCard, Download, Gift, Heart, Mail, MonitorSmartphone, Printer, Scissors, ShieldCheck, Star, Users } from 'lucide-react';
import { content } from './content.js';
import { comercial } from './comercial.js';

const painIcons = [BookOpen, Star, Scissors, Printer, Users, Heart];
const mechanismIcons = [BookOpen, Users, Star, Heart];
const materials = [
  ['/assets/poster.webp', 'Pôster do Advento', 'Pôster ilustrado com os 24 dias do Advento com Jesus'],
  ['/assets/estrelas.webp', 'Estrelinhas para colar', 'Folha com as 24 estrelinhas numeradas da jornada'],
  ['/assets/devocional.webp', 'Guia devocional', 'Guia Devocional para as Famílias'],
  ['/assets/novos/livro-colorir.jpg', 'Livro de colorir', 'Livro de colorir Advento com Jesus'],
  ['/assets/novos/natal-proposito.jpg', 'Natal com Propósito', 'Jogos e brincadeiras para reunir a família na ceia de Natal'],
  ['/assets/novos/receitas-natalinas.jpg', 'Receitas natalinas', 'Receitas natalinas para as crianças']
];

function CTA({ label = 'QUERO CONHECER OS KITS', href = '#oferta' }) {
  return <a className="btn" href={href}>{label}<span aria-hidden="true">→</span></a>;
}

function SectionTitle({ children, lead }) {
  return <header className="section-title"><h2>{children}</h2>{lead && <p>{lead}</p>}</header>;
}

function ProductComposition({ compact = false, memorable = false }) {
  return <div className={`product-composition advento-composition${compact ? ' product-composition--compact' : ''}`} aria-label={memorable ? 'Coleção do Kit Natal Memorável' : 'Pôster, guia devocional e estrelinhas do Advento com Jesus'}>
    <img className="product-sheet product-sheet--left" src="/assets/poster.webp" alt="Pôster ilustrado do Advento com Jesus" loading={compact ? 'lazy' : undefined} />
    <img className="product-sheet product-sheet--right" src={memorable ? '/assets/jogos.webp' : '/assets/estrelas.webp'} alt={memorable ? 'Jogos e dinâmicas Natal com Propósito' : 'Folha de estrelinhas da jornada'} loading={compact ? 'lazy' : undefined} />
    <img className="product-cover" src="/assets/devocional.webp" alt="Guia Devocional para Famílias" loading={compact ? 'lazy' : undefined} fetchPriority={compact ? undefined : 'high'} />
    {memorable && <img className="product-extra" src="/assets/colorir.webp" alt="Livro de colorir do Advento com Jesus" loading="lazy" />}
    <div className="quantity-seal"><strong>24</strong><span>DIAS DE<br/>ADVENTO</span></div>
  </div>;
}

function MaterialsMockup() {
  return <div className="materials-board" aria-label="Os seis materiais dos kits Advento com Jesus">
    <div className="materials-lineup">{materials.map(([src, title, alt], index) => <figure className="material-volume" key={title}>
      <span>{String(index + 1).padStart(2, '0')}</span><img src={src} alt={alt} loading={index > 2 ? 'lazy' : undefined}/><figcaption>{title}</figcaption>
    </figure>)}</div>
  </div>;
}

function CollectionComposition({ compact = false }) {
  return <div className="collection-composition" aria-label="Materiais dos kits Advento com Jesus">
    <img className="collection-item collection-item--poster" src="/assets/poster.webp" alt="Pôster do Advento" loading="lazy" />
    <img className="collection-item collection-item--guide" src="/assets/devocional.webp" alt="Guia devocional" loading="lazy" />
    <img className="collection-item collection-item--stars" src="/assets/estrelas.webp" alt="Estrelinhas da jornada" loading="lazy" />
    <img className="collection-item collection-item--color" src="/assets/novos/livro-colorir.jpg" alt="Livro de colorir" loading="lazy" />
    <img className="collection-item collection-item--games" src="/assets/novos/natal-proposito.jpg" alt="Natal com Propósito: jogos e dinâmicas em família" loading="lazy" />
    <img className="collection-item collection-item--recipes" src="/assets/novos/receitas-natalinas.jpg" alt="Receitas natalinas para crianças" loading="lazy" />
  </div>;
}

function PageFlip() {
  const pages = [
    ['/assets/novos/devocional-dia-22.jpg', 'Dia 22 — Vamos espalhar o amor!'],
    ['/assets/novos/devocional-dia-23.jpg', 'Dia 23 — É tempo de celebrar!'],
    ['/assets/novos/devocional-dia-24.jpg', 'Dia 24 — Jesus é o maior presente!']
  ];
  const [page, setPage] = useState(0);
  const move = direction => setPage(current => (current + direction + pages.length) % pages.length);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setPage(current => (current + 1) % pages.length), 4200);
    return () => window.clearInterval(timer);
  }, [pages.length]);
  return <div className="page-flip" aria-label="Prévia sequencial de três páginas do guia devocional">
    <div className="page-flip-book"><div className="page-flip-spine" aria-hidden="true"/><img key={page} src={pages[page][0]} alt={pages[page][1]} /></div>
    <div className="page-flip-controls"><button type="button" onClick={() => move(-1)} aria-label="Ver página anterior"><ChevronLeft/></button><p aria-live="polite"><strong>{pages[page][1]}</strong><span>{page + 1} de {pages.length}</span></p><button type="button" onClick={() => move(1)} aria-label="Ver próxima página"><ChevronRight/></button></div>
  </div>;
}

function ScrollRail({ children, label, className = '', auto = false, interval = 3000 }) {
  const ref = useRef(null);
  const pausedRef = useRef(false);
  const visibleRef = useRef(false);
  const resumeTimerRef = useRef(null);
  const normalizeTimerRef = useRef(null);
  const items = Children.toArray(children);
  const renderedItems = auto ? [...items, ...items.map((child, index) => cloneElement(child, { key: `loop-${index}`, 'aria-hidden': true }))] : items;
  const cycleWidth = () => {
    const rail = ref.current;
    if (!rail || rail.children.length <= items.length) return 0;
    return rail.children[items.length].offsetLeft - rail.children[0].offsetLeft;
  };
  const normalize = () => {
    const rail = ref.current;
    const width = cycleWidth();
    if (rail && width && rail.scrollLeft >= width) rail.scrollLeft -= width;
  };
  const pauseTemporarily = () => {
    pausedRef.current = true;
    window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => { pausedRef.current = false; }, 4200);
  };
  const move = direction => {
    const rail = ref.current;
    if (!rail) return;
    pauseTemporarily();
    const width = cycleWidth();
    if (direction < 0 && width && rail.scrollLeft <= 2) rail.scrollLeft = width;
    rail.scrollBy({ left: direction * rail.clientWidth * .82, behavior: 'smooth' });
    window.clearTimeout(normalizeTimerRef.current);
    normalizeTimerRef.current = window.setTimeout(normalize, 700);
  };
  useEffect(() => {
    if (!auto || !ref.current) return undefined;
    const rail = ref.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(([entry]) => { visibleRef.current = entry.isIntersecting; }, { threshold: .18 });
    observer.observe(rail);
    const timer = window.setInterval(() => {
      if (reduceMotion.matches || pausedRef.current || !visibleRef.current || document.hidden) return;
      const first = rail.children[0];
      const second = rail.children[1];
      const step = second ? second.offsetLeft - first.offsetLeft : rail.clientWidth * .82;
      rail.scrollBy({ left: step, behavior: 'smooth' });
      window.clearTimeout(normalizeTimerRef.current);
      normalizeTimerRef.current = window.setTimeout(normalize, 700);
    }, interval);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      window.clearTimeout(resumeTimerRef.current);
      window.clearTimeout(normalizeTimerRef.current);
    };
  }, [auto, interval, items.length]);
  return <div className={`rail-stage ${className}`}>
    <button type="button" className="rail-arrow rail-arrow--left" onClick={() => move(-1)} aria-label={`Ver anteriores em ${label}`}><ChevronLeft /></button>
    <div className={`rail${auto ? ' rail--loop' : ''}`} ref={ref} tabIndex="0" aria-label={label} onMouseEnter={() => { pausedRef.current = true; }} onMouseLeave={() => { pausedRef.current = false; }} onFocus={() => { pausedRef.current = true; }} onBlur={() => { pausedRef.current = false; }} onPointerDown={() => { pausedRef.current = true; }} onPointerUp={pauseTemporarily} onTouchEnd={pauseTemporarily}>{renderedItems}</div>
    <button type="button" className="rail-arrow rail-arrow--right" onClick={() => move(1)} aria-label={`Ver próximos em ${label}`}><ChevronRight /></button>
  </div>;
}

function OfferCard({ offer, featured = false }) {
  const href = offer.checkoutUrl || '#checkout-pendente';
  return <article className={`plan-card${featured ? ' plan-card--featured' : ''}`}>
    <p className="plan-badge">{offer.badge}</p><p className="plan-kicker">{offer.kicker}</p><h3>{offer.name}</h3>
    <div className="plan-mockup"><ProductComposition compact memorable={featured} /></div>
    <ul>{offer.items.map(item => <li key={item}><Check size={20}/><span>{item}</span></li>)}</ul>
    <div className="price"><small>Pagamento único</small><strong>{offer.price}</strong></div>
    <CTA label={offer.cta} href={href} />
    <div className="payment-trust"><span><Mail size={18}/>Acesso por e-mail</span><span><Download size={18}/>PDF para baixar</span><span><Printer size={18}/>Pronto para imprimir</span></div>
  </article>;
}

export default function App() {
  return <>
    <main>
      <section className="hero"><div className="content content--860 hero-flow">
        <p className="hero-pill"><span aria-hidden="true" />{content.hero.badge}</p><h1>{content.hero.title}</h1>
        <div className="hero-media"><ProductComposition /></div><p className="hero-sub">{content.hero.subtitle}</p>
        <CTA label="QUERO VER OS MATERIAIS" href="#previas" />
        <ul className="hero-bullets">{content.hero.bullets.map(item => <li key={item}><Check size={20}/><span>{item}</span></li>)}</ul>
        <p className="scope-line">{content.hero.amplitude}</p>
      </div></section>

      <section className="section pain"><div className="content content--880 section-flow">
        <SectionTitle>{content.pain.title}<br/>{content.pain.emphasis}</SectionTitle><div className="ornament" aria-hidden="true"><span /></div>
        <div className="pain-grid">{content.pains.map((item, index) => { const Icon = painIcons[index]; return <div className="pain-chip" key={item}><Icon size={18}/><span>{item}</span></div>; })}</div>
        <p className="bridge"><strong>{content.pain.bridge}</strong></p>
      </div></section>

      <section className="section section--tint gallery" id="previas"><div className="content content--1180 section-flow">
        <SectionTitle lead={content.gallerySection.lead}>{content.gallerySection.title}</SectionTitle>
        <MaterialsMockup />
      </div></section>

      <section className="section mechanism"><div className="content content--1120 section-flow">
        <SectionTitle lead={content.mechanismSection.lead}>{content.mechanismSection.title}</SectionTitle>
        <PageFlip />
        <div className="mechanism-grid">{content.mechanism.map(([title, text], index) => { const Icon = mechanismIcons[index]; return <article key={title}><span className="mechanism-icon"><Icon size={25}/></span><h3>{title}</h3><p>{text}</p></article>; })}</div>
        <p className="mechanism-close">{content.mechanismClose}</p><CTA />
      </div></section>

      <section className="usage-carousel" aria-label="Cenas ilustrativas de uso do material"><div className="content content--860 usage-heading"><p>NA ROTINA DA FAMÍLIA</p><h2>{content.usage.title}</h2><span>{content.usage.lead}</span></div>
        <ScrollRail label="Formas de viver o Advento com Jesus" className="usage-rail" auto interval={3200}>{content.usage.photos.map(([src, alt]) => <figure className="usage-photo" key={src}><img src={src} alt={alt} loading="lazy"/></figure>)}</ScrollRail>
        <p className="usage-caption">Cenas ilustrativas de uso. Não representam depoimentos ou clientes.</p>
      </section>

      <section className="section mid-pitch"><div className="content content--1040 mid-pitch-grid"><div className="mid-pitch-media mid-pitch-media--collection"><CollectionComposition compact /></div><div className="mid-pitch-copy"><h2>{content.midPitch.title}</h2><p>{content.midPitch.text}</p><CTA /></div></div></section>

      <section className="section audiences"><div className="content content--1040 section-flow"><SectionTitle lead={content.audienceSection.lead}>{content.audienceSection.title}</SectionTitle><div className="audience-grid">{content.audiences.map(([title, text]) => <article key={title}><span><Check size={17}/></span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></section>

      <section className="section section--tint receive"><div className="content content--1000 section-flow"><SectionTitle>{content.benefitsSection.title}</SectionTitle><div className="receive-media"><CollectionComposition /></div><article className="receive-card"><p className="access-badge">{content.benefitsSection.badge}</p><h3>{content.benefitsSection.name}</h3><p>{content.benefitsSection.summary}</p><ul>{content.benefits.map(item => <li key={item}><Check size={20}/><span>{item}</span></li>)}</ul></article></div></section>

      <section className="section bonuses"><div className="content content--980 section-flow"><header className="bonus-intro"><p>NO KIT NATAL MEMORÁVEL</p><h2>MAIS MOMENTOS PARA VIVER JUNTOS</h2><span><Gift size={17}/>{content.complements.length} COMPLEMENTOS INCLUÍDOS</span></header><div className="bonus-grid bonus-grid--three">{content.complements.map(item => <article className="bonus-card" key={item.title}><div className="bonus-card-top"><p className="bonus-num">{item.number}</p><div className="bonus-art bonus-art--single"><div className="bonus-book"><img src={item.image} alt={item.alt} loading="lazy"/></div></div></div><div className="bonus-card-body"><h3>{item.title}</h3><p>{item.text}</p><div className="bonus-gain"><Check size={18}/><span>{item.gain}</span></div><div className="bonus-price complement-value"><strong>INCLUÍDO NO KIT MEMORÁVEL</strong></div></div></article>)}</div></div></section>

      <section className="section offer" id="oferta"><div className="content content--1120 section-flow"><SectionTitle lead={content.offer.lead}>{content.offer.title}</SectionTitle><div className="offer-summary"><p>{content.offer.summary} <strong>{content.offer.emphasis}</strong></p></div><div className="offer-plans">{comercial.offers.map((offer, index) => <OfferCard key={offer.name} offer={offer} featured={index === 1} />)}</div><p className="offer-close">{content.offer.pending}</p></div></section>

      <section className="section purchase-safety"><div className="content content--1000 safety-layout"><article className="guarantee-card"><div className="guarantee-seal" aria-label="Garantia de 7 dias"><ShieldCheck size={30}/><strong>7</strong><span>DIAS</span><small>DE GARANTIA</small></div><h2>{comercial.guarantee.title}</h2><p>{comercial.guarantee.text}</p></article><div className="safety-cards"><article><Mail size={30}/><div><h3>Acesso por e-mail</h3><p>Após a confirmação do pagamento, os arquivos digitais são enviados para o e-mail informado na compra.</p></div></article><article><Printer size={30}/><div><h3>PDFs para baixar e imprimir</h3><p>Use os arquivos digitais e imprima os materiais necessários para cada momento da jornada.</p></div></article></div></div></section>

      <section className="section section--tint access-steps"><div className="content content--980 section-flow"><SectionTitle>Como funciona depois da compra</SectionTitle><div className="steps-grid"><article><span>1</span><CreditCard/><h3>Escolha seu kit</h3><p>Selecione o Kit Natal Especial ou o Kit Natal Memorável.</p></article><article><span>2</span><Mail/><h3>Receba no e-mail</h3><p>{comercial.access}</p></article><article><span>3</span><MonitorSmartphone/><h3>Baixe e prepare</h3><p>Abra os PDFs, imprima o material e organize o primeiro encontro.</p></article></div><CTA /></div></section>

      <section className="section faq"><div className="content content--780 section-flow"><SectionTitle>Perguntas frequentes</SectionTitle><div className="faq-list">{content.faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>

      <section className="closing"><div className="content content--780 closing-inner"><p>{content.closing.eyebrow}</p><h2>{content.hero.title}</h2><p className="closing-copy">{content.closing.text}</p><CTA/><small>Material digital em PDF. Kit Especial R$ 17,00. Kit Memorável R$ 27,00.</small></div></section>
    </main>
    <footer className="footer"><div className="footer-inner"><p>Suporte: {comercial.supportEmail}</p><p>{comercial.company}</p><p className="footer-legal">Produto digital independente para uso familiar. Confira as condições comerciais antes da publicação.</p><nav><span>Termos: [LINK PENDENTE]</span><span>•</span><span>Privacidade: [LINK PENDENTE]</span></nav></div></footer>
  </>;
}
