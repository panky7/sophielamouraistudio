import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Edit2, Trash2, LogOut, FileText, MessageSquare, Mail } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [contactRequests, setContactRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('blog');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const blogPostsPath = 'blog_posts';
    const unsubscribeBlog = onSnapshot(
      query(collection(db, blogPostsPath), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setBlogPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (error) => handleFirestoreError(error, OperationType.LIST, blogPostsPath)
    );

    const testimonialsPath = 'testimonials';
    const unsubscribeTestimonials = onSnapshot(
      query(collection(db, testimonialsPath), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setTestimonials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (error) => handleFirestoreError(error, OperationType.LIST, testimonialsPath)
    );

    const contactPath = 'contact_messages';
    const unsubscribeContact = onSnapshot(
      query(collection(db, contactPath), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setContactRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, contactPath);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeBlog();
      unsubscribeTestimonials();
      unsubscribeContact();
    };
  }, []);

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article?')) return;
    try {
      await deleteDoc(doc(db, 'blog_posts', postId));
      toast.success('Article supprimé avec succès');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `blog_posts/${postId}`);
    }
  };

  const handleDeleteTestimonial = async (testimonialId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce témoignage?')) return;
    try {
      await deleteDoc(doc(db, 'testimonials', testimonialId));
      toast.success('Témoignage supprimé avec succès');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `testimonials/${testimonialId}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#CAF0F8]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0077B6]"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Sophie Lamour</title>
      </Helmet>

      <div className="min-h-screen bg-[#CAF0F8]">
        <header className="bg-white border-b border-[#ADE8F4] sticky top-0 z-50">
          <div className="px-6 md:px-12 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-serif text-[#03045E]">Panneau d'administration</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#023E8A]">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-[#0077B6] hover:text-[#0096C7] transition-colors"
              >
                <LogOut size={18} />
                Déconnexion
              </button>
            </div>
          </div>
        </header>

        <div className="px-6 md:px-12 py-8">
          <div className="flex gap-4 mb-8 border-b border-[#ADE8F4] overflow-x-auto">
            <button
              onClick={() => setActiveTab('blog')}
              className={`pb-4 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'blog' ? 'border-[#0077B6] text-[#0077B6]' : 'border-transparent text-[#023E8A]'
              }`}
            >
              <FileText size={18} />
              Articles de blog
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`pb-4 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'testimonials' ? 'border-[#0077B6] text-[#0077B6]' : 'border-transparent text-[#023E8A]'
              }`}
            >
              <MessageSquare size={18} />
              Témoignages
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`pb-4 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'contact' ? 'border-[#0077B6] text-[#0077B6]' : 'border-transparent text-[#023E8A]'
              }`}
            >
              <Mail size={18} />
              Messages ({contactRequests.length})
            </button>
          </div>

          {activeTab === 'blog' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-[#03045E]">Articles de blog</h2>
                <Link
                  to="/admin/blog/new"
                  className="flex items-center gap-2 bg-[#0077B6] text-white hover:bg-[#0096C7] rounded-full px-6 py-3 transition-all duration-300"
                >
                  <Plus size={18} />
                  Nouvel article
                </Link>
              </div>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-[#CAF0F8]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#03045E]">Titre</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#03045E]">Statut</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#03045E]">Date</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-[#03045E]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogPosts.map((post, idx) => (
                      <tr key={idx} className="border-t border-[#ADE8F4]">
                        <td className="px-6 py-4 text-[#03045E]">{post.title_fr}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {post.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#023E8A] text-sm">
                          {post.createdAt?.toDate?.()?.toLocaleDateString('fr') || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/admin/blog/edit/${post.id}`}
                              className="p-2 text-[#48CAE4] hover:text-[#0077B6] transition-colors"
                            >
                              <Edit2 size={16} />
                            </Link>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="p-2 text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-[#03045E]">Témoignages</h2>
                <Link
                  to="/admin/testimonials/new"
                  className="flex items-center gap-2 bg-[#0077B6] text-white hover:bg-[#0096C7] rounded-full px-6 py-3 transition-all duration-300"
                >
                  <Plus size={18} />
                  Nouveau témoignage
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm">
                    <p className="text-[#023E8A] mb-4 line-clamp-3">{testimonial.text_fr}</p>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-[#0077B6]">★</span>
                      ))}
                    </div>
                    <p className="font-semibold text-[#03045E] mb-4">{testimonial.name}</p>
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/testimonials/edit/${testimonial.id}`}
                        className="flex-1 text-center px-4 py-2 bg-[#48CAE4]/10 text-[#48CAE4] rounded-lg hover:bg-[#48CAE4]/20 transition-colors"
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleDeleteTestimonial(testimonial.id)}
                        className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div>
              <h2 className="text-2xl font-serif text-[#03045E] mb-6">Messages reçus</h2>
              {contactRequests.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 shadow-sm text-center text-[#023E8A]">
                  Aucun message pour le moment.
                </div>
              ) : (
                <div className="space-y-4">
                  {contactRequests.map((request, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-[#03045E] text-lg">
                            {request.firstName} {request.lastName}
                          </h3>
                          <p className="text-sm text-[#023E8A]">
                            {request.email}{request.phone ? ` • ${request.phone}` : ''}
                          </p>
                        </div>
                        <span className="text-xs text-[#48CAE4]">
                          {request.createdAt?.toDate?.()?.toLocaleString('fr') || 'N/A'}
                        </span>
                      </div>
                      {request.interestedServices && request.interestedServices.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {request.interestedServices.map((svc: string, i: number) => (
                            <span key={i} className="text-xs bg-[#CAF0F8] text-[#0077B6] px-3 py-1 rounded-full">
                              {svc}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-[#023E8A] whitespace-pre-wrap">{request.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
