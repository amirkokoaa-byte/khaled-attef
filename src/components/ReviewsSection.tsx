import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Star, Send } from 'lucide-react';
import { useAppContext } from '../context';

interface Review {
  id: string;
  name: string;
  comment: string;
  rating: number;
  createdAt: any;
}

export function ReviewsSection() {
  const { t } = useAppContext();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(data);
    }, (error) => {
      console.warn("Reviews offline:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || !db) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        name,
        comment,
        rating,
        createdAt: serverTimestamp()
      });
      setName('');
      setComment('');
      setRating(5);
    } catch (err) {
      console.error("Error adding review:", err);
      // Fallback local update if offline
      const newReview: Review = {
        id: Date.now().toString(),
        name,
        comment,
        rating,
        createdAt: new Date()
      };
      setReviews([newReview, ...reviews]);
      setName('');
      setComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-16">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">{t('التقييمات والآراء', 'Reviews & Comments')}</h2>
        
        <form onSubmit={handleSubmit} className="mb-12 bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
          <div className="mb-6 flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-slate-300">{t('ما هو تقييمك؟', 'What is your rating?')}</span>
            <div className="flex gap-2" dir="ltr">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-1 transition-all hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-slate-600'}`}
                >
                  <Star className="w-8 h-8" fill={star <= rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder={t('اسمك', 'Your Name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <textarea
                placeholder={t('اكتب تعليقك هنا...', 'Write your comment here...')}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {t('إرسال التقييم', 'Submit Review')}
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-center text-slate-400 py-8">{t('لا توجد تقييمات بعد. كن أول من يضيف تقييماً!', 'No reviews yet. Be the first to add one!')}</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-slate-800 p-4 md:p-6 rounded-2xl border border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg text-white">{review.name}</h4>
                  <div className="flex gap-1" dir="ltr">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-slate-600'}`} fill={i < review.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
