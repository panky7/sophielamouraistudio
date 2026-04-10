import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection } from 'firebase/firestore';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const TestimonialEditor = () => {
  const navigate = useNavigate();
  const { testimonialId } = useParams();
  const isEditing = Boolean(testimonialId);

  const [formData, setFormData] = useState({
    name: '',
    text_fr: '',
    text_en: '',
    rating: 5
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (isEditing && testimonialId) {
      fetchTestimonial(testimonialId);
    }
  }, [testimonialId]);

  const fetchTestimonial = async (id: string) => {
    setFetching(true);
    try {
      const docRef = doc(db, 'testimonials', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          name: data.name || '',
          text_fr: data.text_fr || '',
          text_en: data.text_en || '',
          rating: data.rating || 5
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `testimonials/${id}`);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'rating' ? parseInt(value) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        ...formData,
        updatedAt: serverTimestamp(),
      };

      if (isEditing && testimonialId) {
        await updateDoc(doc(db, 'testimonials', testimonialId), dataToSave);
        toast.success('Témoignage mis à jour');
      } else {
        const newDocRef = doc(collection(db, 'testimonials'));
        await setDoc(newDocRef, {
          ...dataToSave,
          createdAt: serverTimestamp(),
        });
        toast.success('Témoignage créé');
      }
      navigate('/admin/dashboard');
    } catch (err) {
      handleFirestoreError(err, isEditing ? OperationType.UPDATE : OperationType.CREATE, 'testimonials');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#CAF0F8] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#0077B6]" size={48} />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEditing ? "Modifier le témoignage - Admin" : "Nouveau témoignage - Admin"}</title>
      </Helmet>

      <div className="min-h-screen bg-[#CAF0F8] py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-[#48CAE4] hover:text-[#0077B6] mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Retour au tableau de bord
          </button>

          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h1 className="text-3xl font-serif text-[#03045E] mb-8">
              {isEditing ? "Modifier le témoignage" : "Nouveau témoignage"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#03045E] mb-2">
                  Nom du client *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#03045E] mb-2">
                    Texte (Français) *
                  </label>
                  <textarea
                    name="text_fr"
                    value={formData.text_fr}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#03045E] mb-2">
                    Text (English) *
                  </label>
                  <textarea
                    name="text_en"
                    value={formData.text_en}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#03045E] mb-2">Note (1-5) *</label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors"
                >
                  <option value={5}>5 étoiles</option>
                  <option value={4}>4 étoiles</option>
                  <option value={3}>3 étoiles</option>
                  <option value={2}>2 étoiles</option>
                  <option value={1}>1 étoile</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#0077B6] text-white hover:bg-[#023E8A] rounded-full px-8 py-4 transition-all duration-300 font-medium shadow-sm hover:shadow-md disabled:opacity-50"
                >
                  {loading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer le témoignage')}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/dashboard')}
                  className="px-8 py-4 border border-[#ADE8F4] text-[#023E8A] hover:bg-[#CAF0F8] rounded-full transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestimonialEditor;
