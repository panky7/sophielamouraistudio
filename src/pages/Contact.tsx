import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, MessageCircle, Send } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const serviceOptions = [
  { id: 'personnel', label_fr: 'Accompagnement personnel', label_en: 'Personal Coaching' },
  { id: 'professionnel', label_fr: 'Accompagnement professionnel', label_en: 'Professional Coaching' },
  { id: 'parentalite', label_fr: 'Accompagnement parentalité', label_en: 'Parenting Support' },
  { id: 'home-organising', label_fr: 'Home Organising', label_en: 'Home Organising' },
  { id: 'autre', label_fr: 'Autre / Je ne sais pas encore', label_en: 'Other / Not sure yet' }
];

const Contact = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interestedServices: [] as string[],
    message: '',
    consent: false
  });
  const [status, setStatus] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      interestedServices: prev.interestedServices.includes(serviceId)
        ? prev.interestedServices.filter(s => s !== serviceId)
        : [...prev.interestedServices, serviceId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) return;
    setLoading(true);
    setStatus('');

    try {
      const path = 'contact_messages';
      await addDoc(collection(db, path), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        interestedServices: [],
        message: '',
        consent: false
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'contact_messages');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("Contact – Sophie Lamour", "Contact – Sophie Lamour")}</title>
        <meta name="description" content={t(
          "Contactez Sophie Lamour pour un accompagnement personnalisé en coaching de vie, développement personnel et professionnel.",
          "Contact Sophie Lamour for personalized life coaching, personal and professional development support."
        )} />
      </Helmet>

      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight font-serif text-[#03045E] mb-6">
              {t("Prenons contact", "Get in Touch")}
            </h1>
            <p className="text-base lg:text-lg leading-relaxed text-[#023E8A] max-w-2xl mx-auto">
              {t(
                "Une question ? Un projet ? Remplissez le formulaire ci-dessous et je vous répondrai dans les plus brefs délais.",
                "A question? A project? Fill out the form below and I will respond as soon as possible."
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info — left column */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-serif text-[#03045E] mb-6">{t("Coordonnées", "Contact Details")}</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#48CAE4]/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#48CAE4]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#03045E] mb-1">Email</p>
                    <a href="mailto:contact@sophielamour.com" className="text-[#023E8A] hover:text-[#0077B6] transition-colors">
                      contact@sophielamour.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#48CAE4]/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#48CAE4]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#03045E] mb-1">{t("Téléphone", "Phone")}</p>
                    <a href="tel:+33689844778" className="text-[#023E8A] hover:text-[#0077B6] transition-colors">
                      +33 6 89 84 47 78
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#03045E] mb-1">WhatsApp</p>
                    <a
                      href="https://wa.me/33689844778"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#023E8A] hover:text-[#25D366] transition-colors"
                    >
                      {t("Discuter sur WhatsApp", "Chat on WhatsApp")}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#48CAE4]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#48CAE4]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#03045E] mb-1">{t("Localisation", "Location")}</p>
                    <a
                      href="https://www.google.com/maps/place/Château-Landon,+77570+France/@48.1522,2.7006,13z"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#023E8A] hover:text-[#0077B6] transition-colors"
                    >
                      {"Château-Landon 77570"}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form — right column */}
            <div className="lg:col-span-3 bg-white rounded-3xl p-8 shadow-[0_8px_32px_rgba(44,44,42,0.04)] border border-[#ADE8F4]/50">
              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  {/* Name row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-[#03045E] mb-2">
                        {t("Prénom", "First Name")} *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6]/20 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-[#03045E] mb-2">
                        {t("Nom", "Last Name")} *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6]/20 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#03045E] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6]/20 transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[#03045E] mb-2">
                      {t("Téléphone", "Phone")}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6]/20 transition-colors"
                    />
                  </div>

                  {/* Service Checkboxes */}
                  <div>
                    <p className="block text-sm font-medium text-[#03045E] mb-3">
                      {t("Quel accompagnement vous intéresse ?", "Which service interests you?")}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {serviceOptions.map((svc) => (
                        <label
                          key={svc.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                            formData.interestedServices.includes(svc.id)
                              ? 'border-[#0077B6] bg-[#CAF0F8]/30'
                              : 'border-[#ADE8F4] hover:bg-[#CAF0F8]/10'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.interestedServices.includes(svc.id)}
                            onChange={() => handleServiceToggle(svc.id)}
                            className="w-4 h-4 rounded border-[#ADE8F4] text-[#0077B6] focus:ring-[#0077B6]"
                          />
                          <span className="text-sm text-[#023E8A]">
                            {language === 'fr' ? svc.label_fr : svc.label_en}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[#03045E] mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6]/20 transition-colors resize-none"
                      placeholder={t("Décrivez votre situation ou vos attentes…", "Describe your situation or expectations…")}
                    />
                  </div>

                  {/* RGPD Consent */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                      required
                      className="w-4 h-4 mt-1 rounded border-[#ADE8F4] text-[#0077B6] focus:ring-[#0077B6]"
                    />
                    <span className="text-xs text-[#023E8A] leading-relaxed">
                      {t(
                        "J’accepte que mes données personnelles soient collectées et traitées dans le cadre de ma demande de contact, conformément au RGPD. Elles ne seront ni cédées ni vendues à des tiers.",
                        "I consent to the collection and processing of my personal data for this contact request, in accordance with GDPR. My data will not be shared or sold to third parties."
                      )}
                    </span>
                  </label>

                  {status === 'success' && (
                    <div className="p-4 bg-green-50 text-green-700 rounded-xl">
                      {t(
                        "Merci pour votre message ! Je vous répondrai dans les plus brefs délais.",
                        "Thank you for your message! I will respond as soon as possible."
                      )}
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl">
                      {t("Une erreur est survenue. Veuillez réessayer.", "An error occurred. Please try again.")}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !formData.consent}
                    className="w-full flex items-center justify-center gap-2 bg-[#0077B6] text-white hover:bg-[#023E8A] rounded-full px-8 py-4 transition-all duration-300 font-medium tracking-wide shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                    {loading ? t("Envoi en cours…", "Sending…") : t("Envoyer ma demande", "Send My Request")}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Google Maps Section */}
          <div className="mt-16">
            <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-[#03045E] mb-6 text-center">
              {t("Où me trouver", "Where to Find Me")}
            </h3>
            <div className="rounded-3xl overflow-hidden shadow-lg border-2 border-[#ADE8F4]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d42358.66284573647!2d2.6806!3d48.1522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e5d8b0e5c5e5e5%3A0x5e5e5e5e5e5e5e5e!2zQ2jDonRlYXUtTGFuZG9uLCA3NzU3MCBGcmFuY2U!5e0!3m2!1sfr!2sus!4v1234567890123"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sophie Lamour – Château-Landon"
              />
            </div>
            <div className="text-center mt-4">
              <a
                href="https://www.google.com/maps/place/Château-Landon,+77570+France/@48.1522,2.7006,13z"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#0077B6] hover:text-[#0096C7] font-medium transition-colors"
              >
                <MapPin size={18} />
                {t("Ouvrir dans Google Maps", "Open in Google Maps")}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
