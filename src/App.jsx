import { useState, useEffect, useRef } from "react";
import AOS from "aos";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import heroImage from "./assets/hero-airpods.png";
import airpodsPro from "./assets/airpods-pro.png";
import airpods4 from "./assets/airpods-4.png";
import airpodsMax from "./assets/airpods-max.png";

import product1 from "./assets/product-1.png";
import product2 from "./assets/product-2.png";
import product3 from "./assets/product-3.png";
import product4 from "./assets/product-4.png";

import galleryVideo1 from "./assets/gallery-1.mp4";
import galleryVideo2 from "./assets/gallery-2.mp4";
import galleryVideo3 from "./assets/gallery-3.mp4";
import galleryVideo4 from "./assets/gallery-4.mp4";
import galleryVideo5 from "./assets/gallery-5.mp4";

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    id: 1,
    name: "AirPods Pro 2",
    category: "PRO",
    price: 24900,
    oldPrice: 26900,
    image: product1,
    description: "Immersive audio. Intelligent noise cancellation.",
    tag: "BEST SELLER",
  },
  {
    id: 2,
    name: "AirPods 4",
    category: "WIRELESS",
    price: 17900,
    oldPrice: 19900,
    image: product2,
    description: "Comfort that stays. Sound that moves.",
    tag: "NEW",
  },
  {
    id: 3,
    name: "AirPods Max",
    category: "MAX",
    price: 59900,
    oldPrice: 62900,
    image: product3,
    description: "High-fidelity audio with a premium design.",
    tag: "PREMIUM",
  },
  {
    id: 4,
    name: "AirPods Essentials",
    category: "ESSENTIAL",
    price: 12900,
    oldPrice: 14900,
    image: product4,
    description: "Everyday audio. Extraordinary experience.",
    tag: "POPULAR",
  },
];

const slides = [
  {
    title: "AIRPODS PRO",
    text: "Silence the world. Hear what matters.",
    image: airpodsPro,
  },
  {
    title: "AIRPODS 4",
    text: "Your music. Your moment. Your freedom.",
    image: airpods4,
  },
  {
    title: "AIRPODS MAX",
    text: "A sound experience beyond imagination.",
    image: airpodsMax,
  },
];

const gallery = [
  { video: galleryVideo1, title: "PURE SOUND", subtitle: "Every note matters" },
  { video: galleryVideo2, title: "YOUR MOMENT", subtitle: "Listen without limits" },
  { video: galleryVideo3, title: "PURE DESIGN", subtitle: "Made for everyday" },
  { video: galleryVideo4, title: "FEEL MORE", subtitle: "Sound that moves you" },
  { video: galleryVideo5, title: "BEYOND AUDIO", subtitle: "Experience the difference" },
];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeGallery, setActiveGallery] = useState(0);
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [faqOpen, setFaqOpen] = useState(0);
  const [contactSent, setContactSent] = useState(false);

  const heroRef = useRef(null);
  const parallaxRef = useRef(null);
  const scrollExpandRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      offset: 80,
      easing: "ease-out-cubic",
    });

    const refresh = () => AOS.refresh();

    window.addEventListener("load", refresh);

    return () => window.removeEventListener("load", refresh);
  }, []);

  // HERO PARALLAX
  useEffect(() => {
    const hero = heroRef.current;
    const image = parallaxRef.current;

    if (!hero || !image) return;

    const handleMove = (e) => {
      const rect = hero.getBoundingClientRect();

      const x = (e.clientX - rect.left - rect.width / 2) / 30;
      const y = (e.clientY - rect.top - rect.height / 2) / 30;

      gsap.to(image, {
        x,
        y,
        rotateY: x * 0.15,
        rotateX: -y * 0.15,
        duration: 0.7,
        ease: "power2.out",
      });
    };

    const handleLeave = () => {
      gsap.to(image, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 1,
        ease: "power3.out",
      });
    };

    hero.addEventListener("mousemove", handleMove);
    hero.addEventListener("mouseleave", handleLeave);

    return () => {
      hero.removeEventListener("mousemove", handleMove);
      hero.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  // SCROLL EXPAND EFFECT
  useEffect(() => {
    const section = scrollExpandRef.current;

    if (!section) return;

    const image = section.querySelector(".expand-image");

    const animation = gsap.fromTo(
      image,
      {
        scale: 0.72,
        borderRadius: "40px",
      },
      {
        scale: 1,
        borderRadius: "0px",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "center center",
          scrub: 1,
        },
      }
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, []);

  // CROSSHAIR CURSOR
  useEffect(() => {
    const handleMove = (e) => {
      setCursor({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMove);

    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // CURSOR GRID
  useEffect(() => {
    const grid = gridRef.current;

    if (!grid) return;

    const handleMove = (e) => {
      const rect = grid.getBoundingClientRect();

      grid.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      grid.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    };

    grid.addEventListener("mousemove", handleMove);

    return () => grid.removeEventListener("mousemove", handleMove);
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });

    setCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);

    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const faqs = [
    {
      question: "What makes AirPods different?",
      answer:
        "AirPods combine comfortable design, intelligent audio technology, seamless device connectivity and a premium listening experience.",
    },
    {
      question: "Are the AirPods compatible with Android?",
      answer:
        "Yes. AirPods can connect to Android phones and other Bluetooth-compatible devices. Some Apple-specific features may not be available.",
    },
    {
      question: "How long does battery life last?",
      answer:
        "Battery life varies by model and usage. Check the specific product specifications for playback and charging details.",
    },
    {
      question: "Can I return or exchange my product?",
      answer:
        "Return and exchange availability depends on the applicable store policies. Please review the terms before purchase.",
    },
    {
      question: "Are these original Apple products?",
      answer:
        "This demo storefront is designed as a product showcase. Verify product authenticity, seller details and warranty before purchasing.",
    },
  ];

  return (
    <div className="air-shop">

      {/* CUSTOM CROSSHAIR */}
      <div
        className="custom-crosshair"
        style={{
          left: cursor.x,
          top: cursor.y,
        }}
      />

      {/* NAVBAR */}
      <nav className="air-navbar">
        <div className="air-nav-container">

          <a href="#home" className="air-logo">
            <i className="bi bi-earbuds"></i>
            <span>AIR<span className="logo-highlight">WAVE</span></span>
          </a>

          <div className={`air-nav-links ${menuOpen ? "active" : ""}`}>
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#products" onClick={() => setMenuOpen(false)}>Products</a>
            <a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a>
            <a href="#gallery" onClick={() => setMenuOpen(false)}>Gallery</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          </div>

          <div className="air-nav-actions">
            <button
              className="cart-icon-btn"
              onClick={() => setCartOpen(true)}
              aria-label="Open shopping cart"
            >
              <i className="bi bi-bag"></i>
              <span>{totalItems}</span>
            </button>

            <button
              className="menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <i className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"}`}></i>
            </button>
          </div>
        </div>
      </nav>
{/* HERO */}
<section id="home" className="air-hero" ref={heroRef}>
  <div className="hero-grid-bg"></div>

  <div className="hero-content container">
    <div className="hero-text" data-aos="fade-up">

      <div className="hero-badge">
        <span className="pulse-dot"></span>
        NEXT LEVEL AUDIO EXPERIENCE
      </div>

      <h1>
        FEEL
        <br />
        <span>EVERY</span>
        <br />
        BEAT.
      </h1>

      <p>
        Elevate your everyday listening with powerful
        bass, crystal-clear audio and a seamless
        wireless experience designed for you.
      </p>

      <div className="hero-buttons">
        <a href="#products" className="btn-main">
          SHOP NOW <i className="bi bi-arrow-up-right"></i>
        </a>

        <a href="#experience" className="btn-outline">
          EXPLORE SOUND
        </a>
      </div>

      <div className="hero-stats">
        <div>
          <h4>40H</h4>
          <span>BATTERY LIFE</span>
        </div>
        <div>
          <h4>ANC</h4>
          <span>NOISE CANCELLING</span>
        </div>
        <div>
          <h4>HD</h4>
          <span>CRYSTAL CLEAR SOUND</span>
        </div>
      </div>
    </div>

    <div className="hero-image-area" data-aos="zoom-in">
      <div className="hero-orbit orbit-1"></div>
      <div className="hero-orbit orbit-2"></div>
      <div className="hero-glow"></div>

      <img
        ref={parallaxRef}
        src={heroImage}
        alt="Premium AirPods"
        className="hero-product-image"
      />

      <div className="floating-label label-one">
        DEEP BASS
      </div>

      <div className="floating-label label-two">
        WIRELESS FREEDOM
      </div>
    </div>
  </div>
</section>
{/* MARQUEE */}
<section className="air-marquee">
  <div className="marquee-track">
    {[1, 2, 3, 4].map((item) => (
      <span key={item}>
        PURE SOUND <i className="bi bi-soundwave"></i>
        DEEP BASS <i className="bi bi-stars"></i>
        BUILT FOR MUSIC <i className="bi bi-earbuds"></i>
      </span>
    ))}
  </div>
</section>
 {/* PRODUCTS */}
<section id="products" className="air-products section-padding">
  <div className="container">

    <div className="section-head" data-aos="fade-up">
      <span className="section-kicker">CURATED AUDIO COLLECTION</span>
      <h2>
        SOUND MADE <span>EXTRAORDINARY.</span>
      </h2>
      <p>
        Discover thoughtfully engineered audio essentials
        crafted for exceptional sound, effortless comfort
        and everyday sophistication.
      </p>
    </div>

    <div className="row g-4">
      {products.map((product, index) => (
        <div
          className="col-12 col-sm-6 col-lg-3"
          key={product.id}
          data-aos="fade-up"
          data-aos-delay={index * 100}
        >
          <div className="product-card">

            <div className="product-image-wrap">
              <span className="product-tag">{product.tag}</span>

              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
              />

              <button
                className="quick-add"
                onClick={() => addToCart(product)}
              >
                <i className="bi bi-plus-lg"></i>
              </button>
            </div>

            <div className="product-details">
              <span className="product-category">
                {product.category}
              </span>

              <h3>{product.name}</h3>
              <p>{product.description}</p>

              <div className="product-price">
                <strong>{formatPrice(product.price)}</strong>
                <del>{formatPrice(product.oldPrice)}</del>
              </div>

              <button
                className="product-add-btn"
                onClick={() => addToCart(product)}
              >
                ADD TO CART <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>

  </div>
</section>
{/* SCROLL EXPAND */}
<section
  className="scroll-expand-section"
  ref={scrollExpandRef}
>
  <div className="expand-image">
    <div className="expand-overlay"></div>

    <div className="expand-content" data-aos="fade-up">
      <span className="section-kicker light-kicker">
        SOUND BEYOND EXPECTATIONS
      </span>

      <h2>
        SOUND
        <br />
        <span>REDEFINED.</span>
        <br />
        YOURS.
      </h2>

      <p>
        Precision-engineered audio meets timeless design.
        Immerse yourself in sound that moves with every moment.
      </p>

      <a href="#experience" className="btn-main">
        DISCOVER THE DIFFERENCE
        <i className="bi bi-arrow-up-right"></i>
      </a>
    </div>

    <img
      src={airpods4}
      alt="Premium audio listening experience"
      className="expand-background-img"
    />
  </div>
</section>
{/* EXPERIENCE */}
<section id="experience" className="air-experience section-padding">
  <div className="container">

    <div className="section-head" data-aos="fade-up">
      <span className="section-kicker">BUILT AROUND YOUR SOUND</span>
      <h2>
        EVERY DETAIL.
        <span> EVERY MOMENT.</span>
      </h2>
      <p>
        Discover the perfect balance of precision audio,
        intelligent technology and effortless comfort.
      </p>
    </div>

    <div className="experience-grid">
      <div className="experience-main" data-aos="fade-right">
        <img src={airpodsPro} alt="AirPods Pro" loading="lazy" />

        <div className="experience-main-content">
          <span>IMMERSION</span>
          <h3>Audio without boundaries.</h3>
          <p>
            Experience remarkable clarity, rich tones and
            immersive sound designed to bring your music
            closer than ever.
          </p>
        </div>
      </div>

      <div className="experience-side">

        <div className="experience-card" data-aos="fade-left">
          <div className="experience-card-icon">
            <i className="bi bi-soundwave"></i>
          </div>
          <span>PRECISION</span>
          <h3>Every note, perfected.</h3>
          <p>
            Balanced audio and refined acoustics
            deliver a richer, more detailed listening experience.
          </p>
        </div>

        <div className="experience-card" data-aos="fade-left" data-aos-delay="150">
          <div className="experience-card-icon">
            <i className="bi bi-lightning-charge"></i>
          </div>
          <span>EFFICIENCY</span>
          <h3>Power for your day.</h3>
          <p>
            Stay connected to your favourite sounds
            with reliable battery performance and effortless charging.
          </p>
        </div>

        <div className="experience-card" data-aos="fade-left" data-aos-delay="300">
          <div className="experience-card-icon">
            <i className="bi bi-bluetooth"></i>
          </div>
          <span>CONNECTIVITY</span>
          <h3>Seamlessly connected.</h3>
          <p>
            Enjoy smooth wireless connectivity
            and a more effortless listening experience.
          </p>
        </div>

      </div>
    </div>
  </div>
</section>
 {/* CIRCULAR CAROUSEL */}
<section className="circular-carousel-section section-padding">
  <div className="container">

    <div className="section-head" data-aos="fade-up">
      <span className="section-kicker">DISCOVER OUR SIGNATURE COLLECTION</span>
      <h2>
        FIND YOUR <span>PERFECT SOUND.</span>
      </h2>
      <p>
        Explore premium audio crafted for your lifestyle,
        your comfort and your everyday listening.
      </p>
    </div>

    <div className="circle-carousel" data-aos="zoom-in">
      <div className="carousel-circle-bg"></div>

      <div className="carousel-slide">
        <img
          key={activeSlide}
          src={slides[activeSlide].image}
          alt={slides[activeSlide].title}
          className="carousel-product-img"
        />
      </div>

      <div className="carousel-info">

        <h3>{slides[activeSlide].title}</h3>
        <p>{slides[activeSlide].text}</p>

        <div className="carousel-controls">
          <button
            onClick={() =>
              setActiveSlide(
                (activeSlide - 1 + slides.length) % slides.length
              )
            }
            aria-label="Previous product"
          >
            <i className="bi bi-arrow-left"></i>
          </button>

          <div className="carousel-dots">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                className={activeSlide === index ? "active" : ""}
                onClick={() => setActiveSlide(index)}
                aria-label={`Show ${slide.title}`}
              />
            ))}
          </div>

          <button
            onClick={() =>
              setActiveSlide((activeSlide + 1) % slides.length)
            }
            aria-label="Next product"
          >
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>

  </div>
</section>
 {/* CURSOR GRID */}
<section className="cursor-grid-section section-padding" ref={gridRef}>
  <div className="cursor-grid-bg"></div>

  <div className="container cursor-grid-container">
    <div className="section-head" data-aos="fade-up">
      <span className="section-kicker">CRAFTED FOR PERFECTION</span>
      <h2>
        INNOVATION.
        <span> IN EVERY DETAIL.</span>
      </h2>
      <p>
        Discover the technology, precision and thoughtful
        engineering behind a truly premium listening experience.
      </p>
    </div>

    <div className="detail-grid">

      <div className="detail-box" data-aos="fade-up">
        <i className="bi bi-earbuds"></i>

        <h3>Ergonomic Design</h3>
        <p>Lightweight comfort designed to fit your lifestyle.</p>
      </div>

      <div className="detail-box" data-aos="fade-up" data-aos-delay="100">
        <i className="bi bi-soundwave"></i>

        <h3>Precision Audio</h3>
        <p>Rich acoustics with clarity in every frequency.</p>
      </div>

      <div className="detail-box" data-aos="fade-up" data-aos-delay="200">
        <i className="bi bi-bluetooth"></i>

        <h3>Seamless Wireless</h3>
        <p>Effortless connectivity wherever life takes you.</p>
      </div>

      <div className="detail-box" data-aos="fade-up" data-aos-delay="300">
        <i className="bi bi-lightning-charge"></i>

        <h3>All-Day Performance</h3>
        <p>Reliable power built for your everyday routine.</p>
      </div>

    </div>
  </div>
</section>
 {/* ANIMATED LIST */}
<section className="animated-list-section section-padding">
  <div className="container">

    <div className="animated-list-layout">

      <div className="animated-list-intro" data-aos="fade-right">
        <span className="section-kicker">THE AIRWAVE ADVANTAGE</span>
        <h2>
          SOUND THAT
          <span> MOVES YOU.</span>
        </h2>
        <p>
          Discover the perfect balance of immersive audio,
          effortless comfort and refined wireless technology.
        </p>
        <a href="#products" className="btn-main">
          EXPLORE PRODUCTS
          <i className="bi bi-arrow-up-right"></i>
        </a>
      </div>

      <div className="animated-list">
        {[
          ["", "Immersive sound", "Experience rich audio, powerful bass and crystal-clear details."],
          ["", "Freedom to move", "Enjoy seamless wireless listening wherever your day takes you."],
          ["", "All-day comfort", "Lightweight ergonomics designed for effortless everyday wear."],
          ["", "Premium aesthetics", "Minimalist design with a refined look and feel."],
          ["", "Sound for every moment", "Elevate your music, calls and entertainment with every beat."],
        ].map((item, index) => (
          <div
            className="animated-list-item"
            key={item[0]}
            data-aos="fade-left"
            data-aos-delay={index * 100}
          >
            <span className="list-number">{item[0]}</span>

            <div>
              <h3>{item[1]}</h3>
              <p>{item[2]}</p>
            </div>

            <i className="bi bi-arrow-up-right"></i>
          </div>
        ))}
      </div>

    </div>
  </div>
</section>
{/* ACCORDION GALLERY */}
<section id="gallery" className="accordion-gallery-section section-padding">
  <div className="container">

    <div className="section-head" data-aos="fade-up">
      <span className="section-kicker">EXPLORE THE AIRWAVE EXPERIENCE</span>
      <h2>
        SOUND IN <span>EVERY FRAME.</span>
      </h2>
      <p>Discover the design, technology and feeling behind every listening experience.</p>
    </div>

    <div className="accordion-gallery" data-aos="fade-up">
      {gallery.map((item, index) => (
        <div
          key={item.title}
          className={`gallery-panel ${
            activeGallery === index ? "active" : ""
          }`}
          onMouseEnter={() => setActiveGallery(index)}
          onClick={() => setActiveGallery(index)}
        >
          <video
            className="gallery-panel-video"
            src={item.video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />

          <div className="gallery-panel-overlay"></div>

          <div className="gallery-panel-content">

            <div>
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
            </div>
            <i className="bi bi-arrow-up-right"></i>
          </div>
        </div>
      ))}
    </div>

  </div>
</section>
 {/* ABOUT */}
<section id="about" className="air-about section-padding">
  <div className="container">

    <div className="about-layout">

      <div className="about-image" data-aos="fade-right">
        <img src={airpodsMax} alt="AirPods premium design" loading="lazy" />
        <div className="about-image-label">
          <i className="bi bi-stars"></i>
          <span>DESIGNED FOR SOUND</span>
        </div>
      </div>

      <div className="about-content" data-aos="fade-left">
        <span className="section-kicker">THE AIRWAVE STORY</span>

        <h2>
          SOUND
          <br />
          WITH <span>SOUL.</span>
        </h2>

        <p>
          AIRWAVE brings together premium audio,
          thoughtful design and innovative technology
          to redefine the way you experience sound.
        </p>

        <p>
          From immersive music to effortless everyday
          listening, we believe every moment deserves
          exceptional audio and uncompromising comfort.
        </p>

        <div className="about-stat-row">
          <div>
            <h3>01</h3>
            <span>INNOVATION</span>
          </div>
          <div>
            <h3>02</h3>
            <span>CRAFTSMANSHIP</span>
          </div>
          <div>
            <h3>03</h3>
            <span>IMMERSION</span>
          </div>
        </div>

        <a href="#products" className="btn-main">
          DISCOVER YOUR SOUND
          <i className="bi bi-arrow-up-right"></i>
        </a>
      </div>

    </div>
  </div>
</section>
{/* CARD NAV */}
<section className="card-nav-section section-padding">
  <div className="container">

    <div className="section-head" data-aos="fade-up">
      <span className="section-kicker">EXPLORE THE AIRWAVE WORLD</span>
      <h2>
        DISCOVER <span>WHAT'S NEXT.</span>
      </h2>
    </div>

    <div className="card-nav-grid">

      <a href="#products" className="card-nav-item" data-aos="fade-up">
        <img src={product3} alt="Shop AirPods" loading="lazy" />
        <div className="card-nav-overlay">
          <span>COLLECTION</span>
          <h3>FIND YOUR SOUND</h3>
          
        </div>
      </a>

      <a href="#experience" className="card-nav-item" data-aos="fade-up" data-aos-delay="100">
        <img src={airpods4} alt="Audio experience" loading="lazy" />
        <div className="card-nav-overlay">
          <span>TECHNOLOGY</span>
          <h3>BUILT TO IMPRESS</h3>
          
        </div>
      </a>

      <a href="#gallery" className="card-nav-item" data-aos="fade-up" data-aos-delay="200">
        <img src={product4} alt="AirPods gallery" loading="lazy" />
        <div className="card-nav-overlay">
          <span>DESIGN</span>
          <h3>BEYOND THE DETAILS</h3>
          
        </div>
      </a>

    </div>

  </div>
</section>
 {/* CONTACT */}
<section id="contact" className="air-contact section-padding">
  <div className="container">
    <div className="section-head" data-aos="fade-up">
      <span className="section-kicker">WE'RE HERE FOR YOU</span>
      <h2>LET'S CONNECT <span>WITH SOUND.</span></h2>
      <p>We're here to answer your questions and make your AIRWAVE experience exceptional.</p>
    </div>

    <div className="contact-layout">
      <div className="contact-info" data-aos="fade-right">

        <div className="contact-info-card">
          <div className="contact-icon">
            <i className="bi bi-envelope"></i>
          </div>
          <div>
            <span>EMAIL SUPPORT</span>
            <h3>uk556513@gmail.com</h3>
            <a href="mailto:uk556513@gmail.com">
              Contact via email <i className="bi bi-arrow-up-right"></i>
            </a>
          </div>
        </div>

        <div className="contact-info-card">
          <div className="contact-icon">
            <i className="bi bi-telephone"></i>
          </div>
          <div>
            <span>PHONE SUPPORT</span>
            <h3>+91 93425 68375</h3>
            <a href="tel:+919342568375">
              Speak with us <i className="bi bi-arrow-up-right"></i>
            </a>
          </div>
        </div>

        <div className="contact-info-card">
          <div className="contact-icon">
            <i className="bi bi-geo-alt"></i>
          </div>
          <div>
            <span>OUR PRESENCE</span>
            <h3>Krishnagiri,Tamil Nadu</h3>
            <p>Premium audio experiences, wherever you are.</p>
          </div>
        </div>

        <div className="contact-note">
          <i className="bi bi-headset"></i>
          <p>
            Need help choosing the right product, tracking an order
            or exploring our collection? Our team is here to assist
            you every step of the way.
          </p>
        </div>

      </div>

      <form
        className="contact-form"
        data-aos="fade-left"
        onSubmit={(e) => {
          e.preventDefault();
          setContactSent(true);
          e.currentTarget.reset();
        }}
      >
        <div className="contact-form-heading">
          <span>GET IN TOUCH</span>
          <h3>We'd love to hear from you.</h3>
          <p>Share your thoughts, questions or feedback with our team.</p>
        </div>

        <div className="contact-form-row">
          <div className="contact-field">
            <label htmlFor="contact-name">FULL NAME</label>
            <input
              id="contact-name"
              type="text"
              placeholder="Your full name"
              required
            />
          </div>

          <div className="contact-field">
            <label htmlFor="contact-email">EMAIL ADDRESS</label>
            <input
              id="contact-email"
              type="email"
              placeholder="Your email address"
              required
            />
          </div>
        </div>

        <div className="contact-field">
          <label htmlFor="contact-subject">SUBJECT</label>
          <input
            id="contact-subject"
            type="text"
            placeholder="What would you like to discuss?"
            required
          />
        </div>

        <div className="contact-field">
          <label htmlFor="contact-message">YOUR MESSAGE</label>
          <textarea
            id="contact-message"
            rows="5"
            placeholder="Tell us how we can help..."
            required
          ></textarea>
        </div>

        <button type="submit" className="contact-submit">
          SUBMIT YOUR MESSAGE <i className="bi bi-arrow-up-right"></i>
        </button>

        {contactSent && (
          <p className="contact-success">
            <i className="bi bi-check-circle-fill"></i>
            Thank you! Your message has been recorded in this demo.
          </p>
        )}
      </form>
    </div>
  </div>
</section>
 {/* FAQ */}
<section id="faq" className="air-faq section-padding">
  <div className="container">

    <div className="faq-layout">
      <div className="faq-intro" data-aos="fade-right">
        <span className="section-kicker">HERE TO HELP</span>
        <h2>
          EVERYTHING
          <span> YOU NEED TO KNOW.</span>
        </h2>
        <p>
          Get the answers you need about our products,
          features and premium listening experience.
        </p>
      </div>

      <div className="faq-list" data-aos="fade-left">
        {faqs.map((faq, index) => (
          <div
            className={`faq-item ${
              faqOpen === index ? "open" : ""
            }`}
            key={faq.question}
          >
            <button
              className="faq-question"
              onClick={() =>
                setFaqOpen(faqOpen === index ? -1 : index)
              }
            >
              <span>{faq.question}</span>
              <i
                className={`bi ${
                  faqOpen === index
                    ? "bi-dash-lg"
                    : "bi-plus-lg"
                }`}
              ></i>
            </button>

            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

  </div>
</section>
{/* NEWSLETTER */}
<section className="newsletter-section">
  <div className="container">
    <div className="newsletter-content" data-aos="zoom-in">

      <span className="section-kicker">
        STAY CONNECTED TO GREAT SOUND
      </span>

      <h2>
        YOUR SOUND.
        <span> YOUR WORLD.</span>
      </h2>

      <p>
        Stay inspired with the latest AIRWAVE collections,
        exclusive updates and everything happening in premium audio.
      </p>

      <a href="#products" className="btn-main">
        EXPLORE COLLECTION
        <i className="bi bi-arrow-up-right"></i>
      </a>

    </div>
  </div>
</section>
 {/* FOOTER */}
<footer className="air-footer">
  <div className="container">

    <div className="footer-top">
      <div className="footer-brand">
        <a href="#home" className="air-logo">
          <i className="bi bi-earbuds"></i>
          <span>AIR<span className="logo-highlight">WAVE</span></span>
        </a>

        <p>
          Experience sound without limits.
          Designed for comfort. Engineered for perfection.
        </p>

        <div className="footer-socials">
          <a href="#home" aria-label="Instagram">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="#home" aria-label="Facebook">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="#home" aria-label="YouTube">
            <i className="bi bi-youtube"></i>
          </a>
          <a href="#home" aria-label="Twitter">
            <i className="bi bi-twitter-x"></i>
          </a>
        </div>
      </div>

      <div className="footer-links">
        <div>
          <h4>EXPLORE</h4>
          <a href="#home">Home</a>
          <a href="#products">Our Products</a>
          <a href="#experience">Experience</a>
          <a href="#gallery">Gallery</a>
        </div>

        <div>
          <h4>ABOUT AIRWAVE</h4>
          <a href="#about">Our Story</a>
          <a href="#faq">FAQs</a>
          <a href="#products">Our Collection</a>
          <a href="#home">Back to Top</a>
        </div>

        <div>
          <h4>GET IN TOUCH</h4>
          <a href="mailto:hello@airwave.example">Email Support</a>
          <a href="#contact">Contact Us</a>
          <a href="#faq">Help & Support</a>
          <a href="#products">Shop Now</a>
        </div>
      </div>
    </div>

    <div className="footer-bottom">
      <p>© 2026 AIRWAVE. ALL RIGHTS RESERVED.</p>
      <p>ENGINEERED FOR SOUND. DESIGNED FOR LIFE.</p>
    </div>

  </div>
</footer>
      {/* CART DRAWER */}
      {cartOpen && (
        <div className="cart-backdrop" onClick={() => setCartOpen(false)}>
          <div
            className="cart-drawer"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="cart-header">
              <h3>YOUR BAG <span>({totalItems})</span></h3>
              <button
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <i className="bi bi-bag"></i>
                <h4>Your bag is empty.</h4>
                <p>Discover your next audio experience.</p>
                <button
                  className="btn-main"
                  onClick={() => setCartOpen(false)}
                >
                  EXPLORE PRODUCTS
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img src={item.image} alt={item.name} />

                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <p>{formatPrice(item.price)}</p>

                        <div className="cart-quantity">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="remove-item"
                          onClick={() => removeFromCart(item.id)}
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-total">
                  <div>
                    <span>SUBTOTAL</span>
                    <strong>{formatPrice(totalPrice)}</strong>
                  </div>

                  <p>Shipping and applicable charges are calculated separately.</p>

                  <button
                    className="checkout-btn"
                    onClick={() => {
                      alert("Demo storefront: checkout is not connected.");
                    }}
                  >
                    CHECKOUT <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default App;