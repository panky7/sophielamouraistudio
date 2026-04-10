import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';

const serviceImages = {
  personnel: 'https://sophielamour.com/wp-content/uploads/2025/02/IMG-20250207-WA0001-e1740056629770.jpg',
  professionnel: 'https://sophielamour.com/wp-content/uploads/2025/04/ChatGPT-Image-4-avr.-2025-15_08_04.png',
  parentalite: 'https://sophielamour.com/wp-content/uploads/2025/04/ChatGPT-Image-4-avr.-2025-15_42_16.png',
  homeOrganising: 'https://sophielamour.com/wp-content/uploads/2025/02/DALL%C2%B7E-2025-02-20-19.17.12-Une-photo-ultra-realiste-de-la-meme-piece-mais-parfaitement-rangee-et-organisee.-Les-vetements-sont-plies-et-ranges-dans-une-armoire-bien-ordonnee-l.webp',
  yogaDuRire: 'https://sophielamour.com/wp-content/uploads/2025/02/DALL%C2%B7E-2025-02-20-19.19.46-Une-photo-ultra-realiste-de-Sophie-Lamour-une-femme-rayonnante-et-souriante-animant-une-seance-de-yoga-du-rire.-Elle-est-entouree-de-personnes-de-tous.webp'
};

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      title: t("Accompagnement personnel", "Personal Coaching"),
      desc: t("(Re)trouvez votre équilibre et votre raison d’être", "Rediscover your balance and purpose"),
      link: '/services/personnel',
      image: serviceImages.personnel
    },
    {
      title: t("Accompagnement professionnel", "Professional Coaching"),
      desc: t("Construisez un avenir aligné avec vos valeurs", "Build a future aligned with your values"),
      link: '/services/professionnel',
      image: serviceImages.professionnel
    },
    {
      title: t("Accompagnement parentalité", "Parenting Support"),
      desc: t("Grandissez ensemble en famille", "Grow together as a family"),
      link: '/services/parentalite',
      image: serviceImages.parentalite
    },
    {
      title: "Home Organising",
      desc: t("Créez un environnement qui vous apaise", "Create an environment that soothes you"),
      link: '/services/home-organising',
      image: serviceImages.homeOrganising
    },
    {
      title: t("Yoga du Rire", "Laughter Yoga"),
      desc: t("Libérez votre joie de vivre par le rire et la respiration", "Release your joy of living through laughter and breathing"),
      link: '/services/yoga-du-rire',
      image: serviceImages.yogaDuRire
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t("Services – Sophie Lamour", "Services – Sophie Lamour")}</title>
        <meta name="description" content={t(
          "Découvrez mes services : coaching personnel, professionnel, parentalité et home organising.",
          "Discover my services: personal coaching, professional coaching, parenting and home organizing."
        )} />
      </Helmet>

      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight font-serif text-[#03045E] mb-6">
            {t("Mes services", "My Services")}
          </h1>
          <p className="text-base lg:text-lg leading-relaxed text-[#023E8A] max-w-3xl mx-auto">
            {t(
              "Un accompagnement personnalisé pour vous aider à atteindre vos objectifs et vivre une vie alignée avec vos valeurs.",
              "Personalized support to help you achieve your goals and live a life aligned with your values."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service, idx) => (
            <Link
              key={idx}
              to={service.link}
              className="group bg-white rounded-3xl overflow-hidden border border-[#ADE8F4] shadow-[0_8px_32px_rgba(44,44,42,0.04)] hover:shadow-[0_16px_48px_rgba(0,119,182,0.12)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03045E]/60 to-transparent" />
                <h2 className="absolute bottom-4 left-6 right-6 text-xl sm:text-2xl font-serif text-white leading-tight">
                  {service.title}
                </h2>
              </div>
              <div className="p-6">
                <p className="text-base leading-relaxed text-[#023E8A] mb-4">{service.desc}</p>
                <span className="text-sm uppercase tracking-[0.2em] font-bold text-[#48CAE4] group-hover:text-[#0077B6] transition-colors">
                  {t("Découvrir", "Learn More")} &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default Services;
