import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';

const ServiceProfessionnel = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t("Accompagnement Professionnel - Sophie Lamour", "Professional Coaching - Sophie Lamour")}</title>
      </Helmet>

      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-tight font-serif text-[#03045E] mb-8">
            {t('Accompagnement Professionnel', 'Professional Coaching')}
          </h1>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#03045E] mb-6">
            {t('Construire un avenir en accord avec vos valeurs', 'Build a Future Aligned with Your Values')}
          </h2>

          <div className="rounded-2xl overflow-hidden mb-10">
            <img
              src="https://sophielamour.com/wp-content/uploads/2025/04/ChatGPT-Image-4-avr.-2025-15_08_04.png"
              alt="Accompagnement Professionnel"
              className="w-full h-80 object-cover"
            />
          </div>
          
          <div className="space-y-6 text-base lg:text-lg leading-relaxed text-[#023E8A] mb-12">
            <div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">{t('Vous êtes dans une période de transition professionnelle ?', 'Are you in a professional transition period?')}</h3>
              <p>{t('Que ce soit une réorientation choisie, une perte d’emploi ou une envie de changement, je vous aide à redéfinir votre parcours et à envisager des possibilités alignées avec vos aspirations profondes.', 'Whether it is a chosen reorientation, job loss or desire for change, I help you redefine your path and consider possibilities aligned with your deep aspirations.')}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">{t('Votre quotidien professionnel vous submerge-t-il ?', 'Does your professional daily life overwhelm you?')}</h3>
              <p>{t('Apprenons ensemble à mieux organiser vos journées, à prioriser et à vous reconnecter à une façon de travailler qui vous correspond.', 'Let\'s learn together to better organize your days, prioritize and reconnect with a way of working that suits you.')}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">{t('Vous avez une idée, un projet, mais vous hésitez à vous lancer ?', 'Do you have an idea, a project, but hesitate to launch?')}</h3>
              <p>{t('Transformons cette envie en un projet concret et structuré qui vous permettra de passer à l’action.', 'Let\'s transform this desire into a concrete and structured project that will allow you to take action.')}</p>
            </div>
          </div>

          <Link
            to="/contact"
            className="inline-block bg-[#0077B6] text-white hover:bg-[#023E8A] rounded-full px-8 py-4 transition-all duration-300 font-medium tracking-wide shadow-sm hover:shadow-md"
          >
            {t("Prendre contact", "Get in Touch")}
          </Link>
        </div>
      </section>
    </>
  );
};

export default ServiceProfessionnel;
