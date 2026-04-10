import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

interface TestimonialData {
  name: string;
  text_fr: string;
  text_en: string;
  rating: number;
}

const Testimonials = () => {
  const { t, language } = useLanguage();
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = 'testimonials';
    const unsubscribe = onSnapshot(
      query(collection(db, path), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const data = snapshot.docs.map(doc => doc.data() as TestimonialData);
        setTestimonials(data);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Helmet>
        <title>{t("Témoignages – Sophie Lamour", "Testimonials – Sophie Lamour")}</title>
      </Helmet>

      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-tight font-serif text-[#03045E] mb-6">
            {t('Témoignages', 'Testimonials')}
          </h1>
          <p className="text-base lg:text-lg leading-relaxed text-[#023E8A] max-w-3xl mx-auto">
            {t(
              'Découvrez les expériences de ceux qui ont fait confiance à mon accompagnement.',
              'Discover the experiences of those who trusted my support.'
            )}
          </p>
        </div>

        {loading ? (
          <div className="text-center text-[#023E8A]">{t('Chargement...', 'Loading...')}</div>
        ) : testimonials.length === 0 ? (
          <div className="text-center text-[#023E8A]">{t('Aucun témoignage pour le moment.', 'No testimonials yet.')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-[0_8px_32px_rgba(44,44,42,0.04)]">
                <div className="text-6xl font-serif text-[#0077B6] mb-4">“</div>
                <p className="text-base leading-relaxed text-[#023E8A] mb-6">
                  {language === 'fr' ? testimonial.text_fr : testimonial.text_en}
                </p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-[#0077B6] text-xl">★</span>
                  ))}
                </div>
                <p className="font-semibold text-[#03045E]">{testimonial.name}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Testimonials;
