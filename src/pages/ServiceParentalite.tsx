import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';

const ServiceParentalite = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t("Accompagnement parentalité – Sophie Lamour", "Parenting Support – Sophie Lamour")}</title>
      </Helmet>

      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-tight font-serif text-[#03045E] mb-8">
            {t('Accompagnement Parentalité', 'Parenting Support')}
          </h1>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#03045E] mb-6">
            {t('Grandir ensemble', 'Grow Together')}
          </h2>

          <div className="rounded-2xl overflow-hidden mb-10">
            <img
              src="https://sophielamour.com/wp-content/uploads/2025/04/ChatGPT-Image-4-avr.-2025-15_42_16.png"
              alt="Accompagnement parentalité"
              className="w-full h-80 object-cover"
            />
          </div>
          
          <div className="space-y-6 text-base lg:text-lg leading-relaxed text-[#023E8A] mb-12">
            <div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">{t('Vous attendez un enfant ou venez d’accueillir un nouveau-né ?', 'Are you expecting a child or have just welcomed a newborn?')}</h3>
              <p>{t('Préparer cette grande étape avec sérénité, gérer les premiers moments avec votre bébé et trouver votre équilibre de parent.', 'Prepare for this big step with serenity, manage the first moments with your baby and find your balance as a parent.')}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">{t('Votre enfant traverse une période difficile ?', 'Is your child going through a difficult period?')}</h3>
              <p>{t('Qu’il s’agisse de gestion des émotions, de troubles du comportement ou de conflits au sein de la famille, nous trouverons des solutions adaptées.', 'Whether it is emotion management, behavioral problems or conflicts within the family, we will find appropriate solutions.')}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">{t('Vous vivez des tensions avec votre adolescent ?', 'Are you experiencing tensions with your teenager?')}</h3>
              <p>{t('Ensemble, nous explorerons des approches bienveillantes pour recréer du lien et apaiser les tensions.', 'Together we will explore caring approaches to recreate connection and ease tensions.')}</p>
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

export default ServiceParentalite;
