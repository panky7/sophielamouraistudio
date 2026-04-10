import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, ImageIcon, Loader2 } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { toast } from 'sonner';

const BlogEditor = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const isEditing = Boolean(postId);

  const [formData, setFormData] = useState({
    title_fr: '',
    title_en: '',
    content_fr: '',
    content_en: '',
    excerpt_fr: '',
    excerpt_en: '',
    featured_image: '',
    category: 'Développement personnel',
    status: 'draft',
    slug: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (isEditing && postId) {
      fetchPost(postId);
    }
  }, [postId]);

  const fetchPost = async (id: string) => {
    setFetching(true);
    try {
      const docRef = doc(db, 'blog_posts', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          title_fr: data.title_fr || '',
          title_en: data.title_en || '',
          content_fr: data.content_fr || '',
          content_en: data.content_en || '',
          excerpt_fr: data.excerpt_fr || '',
          excerpt_en: data.excerpt_en || '',
          featured_image: data.featured_image || '',
          category: data.category || 'Développement personnel',
          status: data.status || 'draft',
          slug: data.slug || ''
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `blog_posts/${id}`);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from French title if not editing
    if (name === 'title_fr' && !isEditing) {
      const generatedSlug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        ...formData,
        updatedAt: serverTimestamp(),
      };

      if (isEditing && postId) {
        await updateDoc(doc(db, 'blog_posts', postId), dataToSave);
        toast.success('Article mis à jour');
      } else {
        const newDocRef = doc(collection(db, 'blog_posts'));
        await setDoc(newDocRef, {
          ...dataToSave,
          createdAt: serverTimestamp(),
        });
        toast.success('Article créé');
      }
      navigate('/admin/dashboard');
    } catch (err) {
      handleFirestoreError(err, isEditing ? OperationType.UPDATE : OperationType.CREATE, 'blog_posts');
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
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
        <title>{isEditing ? "Modifier l'article - Admin" : "Nouvel article - Admin"}</title>
      </Helmet>

      <div className="min-h-screen bg-[#CAF0F8] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-[#48CAE4] hover:text-[#0077B6] mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Retour au tableau de bord
          </button>

          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h1 className="text-3xl font-serif text-[#03045E] mb-4">
              {isEditing ? "Modifier l'article" : "Nouvel article de blog"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#03045E] mb-2">
                    Titre (Français) *
                  </label>
                  <input
                    type="text"
                    name="title_fr"
                    value={formData.title_fr}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#03045E] mb-2">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    name="title_en"
                    value={formData.title_en}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#03045E] mb-2">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#03045E] mb-2">
                    Extrait (Français) *
                  </label>
                  <textarea
                    name="excerpt_fr"
                    value={formData.excerpt_fr}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#03045E] mb-2">
                    Excerpt (English) *
                  </label>
                  <textarea
                    name="excerpt_en"
                    value={formData.excerpt_en}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#03045E] mb-2">
                  Contenu (Français) *
                </label>
                <div className="bg-white rounded-xl border border-[#ADE8F4]">
                  <ReactQuill
                    theme="snow"
                    value={formData.content_fr}
                    onChange={(val) => setFormData(prev => ({ ...prev, content_fr: val }))}
                    modules={modules}
                    className="h-64 mb-12"
                  />
                </div>
              </div>

              <div className="pt-8">
                <label className="block text-sm font-medium text-[#03045E] mb-2">
                  Content (English) *
                </label>
                <div className="bg-white rounded-xl border border-[#ADE8F4]">
                  <ReactQuill
                    theme="snow"
                    value={formData.content_en}
                    onChange={(val) => setFormData(prev => ({ ...prev, content_en: val }))}
                    modules={modules}
                    className="h-64 mb-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                <div>
                  <label className="block text-sm font-medium text-[#03045E] mb-2">
                    URL de l'image à la une
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-grow relative">
                      <input
                        type="text"
                        name="featured_image"
                        value={formData.featured_image}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors"
                      />
                    </div>
                  </div>
                  {formData.featured_image && (
                    <img 
                      src={formData.featured_image} 
                      alt="Preview" 
                      className="mt-2 w-full h-32 object-cover rounded-xl border border-[#ADE8F4]" 
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#03045E] mb-2">
                    Catégorie *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors"
                  >
                    <option value="Développement personnel">Épanouissement personnel</option>
                    <option value="Coaching">Coaching</option>
                    <option value="Parentalité">Parentalité</option>
                    <option value="Bien-être">Bien-être</option>
                    <option value="Organisation">Organisation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#03045E] mb-2">Statut *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors"
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#0077B6] text-white hover:bg-[#023E8A] rounded-full px-8 py-4 transition-all duration-300 font-medium shadow-sm hover:shadow-md disabled:opacity-50"
                >
                  {loading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer l\'article')}
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

export default BlogEditor;
