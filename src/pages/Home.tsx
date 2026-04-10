import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Heart, Briefcase, Baby, Home as HomeIcon, Target, Palette, Smile, Leaf } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, query, orderBy, limit, where } from 'firebase/firestore';

interface TestimonialData {
  name: string;
  text_fr: string;
  text_en: string;
  rating: number;
}

interface BlogPostData {
  slug: string;
  title_fr: string;
  title_en: string;
  excerpt_fr: string;
  excerpt_en: string;
  created_at: any;
  featured_image: string;
}

const Home = () => {
  const { t, language } = useLanguage();
  const [emblaRef] = useEmblaCarousel({ loop: true });
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPostData[]>([]);

  useEffect(() => {
    const testimonialsPath = 'testimonials';
    const unsubscribeTestimonials = onSnapshot(
      query(collection(db, testimonialsPath), orderBy('createdAt', 'desc'), limit(10)),
      (snapshot) => {
        const data = snapshot.docs.map(doc => doc.data() as TestimonialData);
        setTestimonials(data);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, testimonialsPath)
    );

    const blogPostsPath = 'blog_posts';
    const unsubscribeBlogPosts = onSnapshot(
      query(
        collection(db, blogPostsPath), 
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'), 
        limit(3)
      ),
      (snapshot) => {
        const data = snapshot.docs.map(doc => {
          const d = doc.data();
          return {
            ...d,
            created_at: d.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
          } as BlogPostData;
        });
        setBlogPosts(data);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, blogPostsPath)
    );

    return () => {
      unsubscribeTestimonials();
      unsubscribeBlogPosts();
    };
  }, []);

  const services = [
    {
      icon: Heart,
      title: t("Accompagnement personnel", "Personal Coaching"),
      desc: t("(Re)trouvez votre équilibre et votre raison d’être", "Rediscover your balance and purpose"),
      link: '/services/personnel'
    },
    {
      icon: Briefcase,
      title: t("Accompagnement professionnel", "Professional Coaching"),
      desc: t("Construisez un avenir aligné avec vos valeurs", "Build a future aligned with your values"),
      link: '/services/professionnel'
    },
    {
      icon: Baby,
      title: t("Accompagnement parentalité", "Parenting Support"),
      desc: t("Grandissez ensemble en famille", "Grow together as a family"),
      link: '/services/parentalite'
    },
    {
      icon: HomeIcon,
      title: "Home Organising",
      desc: t("Créez un environnement qui vous apaise", "Create an environment that soothes you"),
      link: '/services/home-organising'
    },
    {
      icon: Smile,
      title: t("Yoga du Rire", "Laughter Yoga"),
      desc: t("Libérez votre joie de vivre", "Release your joy of living"),
      link: '/services/yoga-du-rire'
    }
  ];

  const techniques = [
    {
      icon: Target,
      title: "Ikigaï",
      desc: t("Trouvez votre boussole intérieure", "Find your inner compass"),
      link: '/services/ikigai',
      color: '#0077B6'
    },
    {
      icon: Palette,
      title: t("Art-thérapie", "Art Therapy"),
      desc: t("Explorer, créer, se reconnecter à soi", "Explore, create, reconnect with yourself"),
      link: '/services/art-therapie',
      color: '#48CAE4'
    },
    {
      icon: Leaf,
      title: t("Pleine conscience", "Mindfulness"),
      desc: t("Cultivez la présence et la sérénité", "Cultivate presence and serenity"),
      link: '',
      color: '#90E0EF'
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t("Sophie Lamour – Coach de vie et développement personnel", "Sophie Lamour – Life Coach & Personal Development")}</title>
        <meta name="description" content={t(
          "Accompagnement personnalisé en développement personnel, coaching professionnel, parentalité et home organising. Ikigaï, yoga du rire, art-thérapie et pleine conscience.",
          "Personalized support in personal development, professional coaching, parenting and home organizing. Ikigai, laughter yoga, art therapy and mindfulness."
        )} />
      </Helmet>

      {/* Hero Section */}
      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight font-serif text-[#03045E] mb-6">
              {t("Découvrez votre raison d’être", "Discover Your Purpose")}
            </h1>
            <p className="text-base lg:text-lg leading-relaxed text-[#023E8A] font-sans mb-8">
              {t(
                "Bienvenue dans un espace dédié à votre transformation et à votre épanouissement. Mon approche bienveillante s’adapte à vos besoins uniques.",
                "Welcome to a space dedicated to your transformation and fulfillment. My caring approach adapts to your unique needs."
              )}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="bg-[#0077B6] text-white hover:bg-[#023E8A] rounded-full px-8 py-4 transition-all duration-300 font-medium tracking-wide shadow-sm hover:shadow-md"
              >
                {t("Prendre contact", "Get in Touch")}
              </Link>
              <Link
                to="/qui-suis-je"
                className="bg-transparent border border-[#48CAE4] text-[#023E8A] hover:bg-[#48CAE4] hover:text-white rounded-full px-8 py-4 transition-all duration-300 font-medium tracking-wide"
              >
                {t("En savoir plus", "Learn More")}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <img
              src="https://sophielamour.com/wp-content/uploads/2025/02/IMG-20250207-WA0001-e1740056629770.jpg"
              alt="Sophie Lamour"
              className="rounded-3xl shadow-[0_16px_48px_rgba(3,4,94,0.12)] w-full h-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24 bg-[#CAF0F8]/40">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-snug font-serif text-[#03045E] mb-4">
            {t("Quel accompagnement est fait pour vous ?", "Which Support is Right for You?")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <Link
                key={idx}
                to={service.link}
                className="bg-white rounded-3xl p-8 lg:p-10 border border-[#ADE8F4] shadow-[0_8px_32px_rgba(44,44,42,0.04)] hover:shadow-[0_16px_48px_rgba(0,119,182,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-start"
              >
                <div className="w-14 h-14 rounded-full bg-[#48CAE4]/10 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-[#0077B6]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-[#03045E] mb-3">{service.title}</h3>
                <p className="text-base leading-relaxed text-[#023E8A] font-sans mb-6">{service.desc}</p>
                <span className="text-sm uppercase tracking-[0.2em] font-bold text-[#48CAE4]">
                  {t("Découvrir", "Discover")} &rarr;
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Techniques & Approaches */}
      <section className="py-20 lg:py-24 px-6 md:px-12 lg:px-24 bg-[#03045E]">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-snug font-serif text-white mb-3">
            {t("Mes outils & approches", "My Tools & Approaches")}
          </h2>
          <p className="text-base lg:text-lg text-white/70 max-w-2xl mx-auto">
            {t(
              "Des méthodes complémentaires que j’intègre dans mes accompagnements pour enrichir votre parcours.",
              "Complementary methods I integrate into my coaching to enrich your journey."
            )}
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {techniques.map((tech, idx) => {
            const Icon = tech.icon;
            const inner = (
              <div className="flex flex-col items-center text-center group">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${tech.color}20` }}
                >
                  <Icon className="w-8 h-8" style={{ color: tech.color }} />
                </div>
                <h3 className="text-lg font-serif text-white mb-2">{tech.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{tech.desc}</p>
              </div>
            );
            if (tech.link) {
              return (
                <Link
                  key={idx}
                  to={tech.link}
                  className="p-6 rounded-2xl border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all duration-300"
                >
                  {inner}
                </Link>
              );
            }
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-white/10"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24 bg-[#48CAE4]/10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-snug font-serif text-[#03045E] mb-4">
              {t("Ce que disent mes clients", "What My Clients Say")}
            </h2>
          </div>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial, idx) => (
                <div key={idx} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-4">
                  <div className="bg-white rounded-3xl p-8 shadow-[0_8px_32px_rgba(44,44,42,0.04)] h-full">
                    <div className="text-5xl font-serif text-[#0077B6] mb-4">{"«"}</div>
                    <p className="text-base leading-relaxed text-[#023E8A] mb-6">
                      {language === 'fr' ? testimonial.text_fr : testimonial.text_en}
                    </p>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-[#0077B6] text-xl">{"★"}</span>
                      ))}
                    </div>
                    <p className="font-semibold text-[#03045E]">{testimonial.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Preview Section */}
      {blogPosts.length > 0 && (
        <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-snug font-serif text-[#03045E] mb-4">
              {t("Dernières réflexions", "Latest Thoughts")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, idx) => (
              <Link
                key={idx}
                to={`/blog/${post.slug}`}
                className="group"
              >
                {post.featured_image && (
                  <img
                    src={post.featured_image}
                    alt={language === 'fr' ? post.title_fr : post.title_en}
                    className="w-full h-48 object-cover rounded-2xl mb-4 group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <p className="text-sm text-[#48CAE4] mb-2">{new Date(post.created_at).toLocaleDateString(language)}</p>
                <h3 className="text-xl font-serif text-[#03045E] mb-2 group-hover:text-[#0077B6] transition-colors">
                  {language === 'fr' ? post.title_fr : post.title_en}
                </h3>
                <p className="text-base text-[#023E8A] mb-4">
                  {language === 'fr' ? post.excerpt_fr : post.excerpt_en}
                </p>
                <span className="text-sm uppercase tracking-[0.2em] font-bold text-[#48CAE4]">
                  {t("Lire la suite", "Read More")} &rarr;
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#0077B6]">
        <div className="text-center text-white">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif mb-6">
            {t("Prêt(e) à commencer votre transformation ?", "Ready to Start Your Transformation?")}
          </h2>
          <Link
            to="/contact"
            className="inline-block bg-white text-[#0077B6] hover:bg-[#CAF0F8] rounded-full px-8 py-4 transition-all duration-300 font-medium tracking-wide shadow-md hover:shadow-lg"
          >
            {t("Me contacter", "Contact Me")}
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
