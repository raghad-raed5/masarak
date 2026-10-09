import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Sparkles,
  Calendar,
  Send,
  Star,
  Award,
  Clock,
  CheckCircle2,
  Filter,
  Plus,
} from 'lucide-react';
import { ForumPost, Mentor } from '../types';

interface IndustryForumTabProps {
  posts: ForumPost[];
  mentors: Mentor[];
  onAddPost: (newPost: Omit<ForumPost, 'id' | 'timestamp' | 'upvotes' | 'commentsCount' | 'comments'>) => void;
  onUpvotePost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onBookMentorSession: (mentor: Mentor, date: string, time: string, topic: string) => void;
}

export const IndustryForumTab: React.FC<IndustryForumTabProps> = ({
  posts,
  mentors,
  onAddPost,
  onUpvotePost,
  onAddComment,
  onBookMentorSession,
}) => {
  const [subTab, setSubTab] = useState<'forum' | 'mentors'>('forum');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New post form state
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<ForumPost['category']>('Internship Tips');

  // Comment input per post
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  // Mentor booking modal state
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [bookingDate, setBookingDate] = useState('Oct 15, 2026');
  const [bookingTime, setBookingTime] = useState('5:00 PM');
  const [bookingTopic, setBookingTopic] = useState('CV Review & Technical Internship Preparation');
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');

  const filteredPosts = posts.filter((p) => {
    if (activeCategory === 'All') return true;
    return p.category === activeCategory;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    onAddPost({
      authorName: 'Amira Tariq',
      authorRole: '3rd Year CS Student (AI Focus)',
      authorAvatar: '👩‍💻',
      title: postTitle,
      content: postContent,
      category: postCategory,
    });

    setPostTitle('');
    setPostContent('');
    setShowCreateModal(false);
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    onAddComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleConfirmBooking = () => {
    if (!selectedMentor) return;
    onBookMentorSession(selectedMentor, bookingDate, bookingTime, bookingTopic);
    setBookingSuccessMsg(`Mentorship session scheduled with ${selectedMentor.name}!`);
    setTimeout(() => {
      setSelectedMentor(null);
      setBookingSuccessMsg('');
    }, 1800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/40 p-6 sm:p-8 border border-slate-800">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Feature 4: Industry Networking Forum & Mentorship Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Peer Networking & 1-on-1 Industry Mentorship
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Connect with alumni, fellow CS/IT undergraduates, and verified tech leads from local startups and
            multinationals. Ask questions, share project breakthroughs, and book 1-on-1 guidance sessions.
          </p>
        </div>
      </div>

      {/* Sub-tab navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('forum')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'forum'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Community Forum ({posts.length})</span>
          </button>
          <button
            onClick={() => setSubTab('mentors')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'mentors'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Industry Mentors ({mentors.length})</span>
          </button>
        </div>

        {subTab === 'forum' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Discussion</span>
          </button>
        )}
      </div>

      {/* VIEW A: FORUM */}
      {subTab === 'forum' && (
        <div className="space-y-6">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['All', 'Internship Tips', 'AI & Tech', 'Career Advice', 'Junior Projects'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts Feed */}
          <div className="space-y-5">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all"
              >
                {/* Author row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg">
                      {post.authorAvatar}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">{post.authorName}</div>
                      <div className="text-[11px] text-slate-400">
                        {post.authorRole} • {post.timestamp}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {post.category}
                  </span>
                </div>

                {/* Title & Content */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white leading-snug">{post.title}</h3>
                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">{post.content}</p>
                </div>

                {/* Actions: Upvote & Comments */}
                <div className="flex items-center gap-4 pt-2 border-t border-slate-800 text-xs">
                  <button
                    onClick={() => onUpvotePost(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                      post.hasUpvoted
                        ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${post.hasUpvoted ? 'text-indigo-400 fill-indigo-400' : ''}`} />
                    <span>{post.upvotes} Upvotes</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.comments.length} Comments</span>
                  </div>
                </div>

                {/* Comments List */}
                {post.comments.length > 0 && (
                  <div className="space-y-2.5 pt-2 pl-3 border-l-2 border-slate-800">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="bg-slate-850 bg-slate-950/40 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                            <span>{comment.authorAvatar || comment.avatar || '💬'}</span>
                            <span>{comment.authorName}</span>
                          </span>
                          <span className="text-[10px] text-slate-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                    }
                    onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                    placeholder="Write a supportive reply or answer..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => handleCommentSubmit(post.id)}
                    className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW B: MENTORS HUB */}
      {subTab === 'mentors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-2xl shadow-inner">
                      {mentor.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">{mentor.name}</h3>
                      <p className="text-xs text-indigo-300 font-medium">{mentor.role}</p>
                      <p className="text-[11px] text-slate-400">{mentor.company}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{mentor.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                  {mentor.bio}
                </p>

                {/* Specialties */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400">Mentorship Specialties:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="text-xs text-slate-400 space-y-1">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> Available Slots:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.availableDays.map((slot, i) => (
                      <span key={i} className="text-[11px] text-emerald-400 font-medium">
                        • {slot}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booking CTA */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">{mentor.sessionsCompleted} sessions delivered</span>
                <button
                  onClick={() => setSelectedMentor(mentor)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book 1-on-1 Session</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE POST MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <span>Share Discussion or Question</span>
            </h3>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Internship Tips">Internship Tips</option>
                  <option value="AI & Tech">AI & Tech</option>
                  <option value="Career Advice">Career Advice</option>
                  <option value="CV Review">CV Review</option>
                  <option value="Junior Projects">Junior Projects</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Topic Title</label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g. How to prepare for live coding challenges in local startups?"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Content</label>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={4}
                  placeholder="Share details, university context, or specific tools you are learning..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MENTOR BOOKING MODAL */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-2xl">
                {selectedMentor.avatar}
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Book 1-on-1 Mentorship</h3>
                <p className="text-xs text-indigo-300">{selectedMentor.name}</p>
                <p className="text-[11px] text-slate-400">{selectedMentor.role}</p>
              </div>
            </div>

            {bookingSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{bookingSuccessMsg}</span>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Select Date</label>
                  <select
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Oct 15, 2026">Thursday, Oct 15, 2026</option>
                    <option value="Oct 17, 2026">Saturday, Oct 17, 2026</option>
                    <option value="Oct 20, 2026">Tuesday, Oct 20, 2026</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Select Time Slot</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="5:00 PM">5:00 PM (GMT+3)</option>
                    <option value="6:30 PM">6:30 PM (GMT+3)</option>
                    <option value="11:00 AM">11:00 AM (Weekend slot)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Discussion Agenda / Goal</label>
                  <input
                    type="text"
                    value={bookingTopic}
                    onChange={(e) => setBookingTopic(e.target.value)}
                    placeholder="e.g. CV Review & Technical Internship Preparation"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setSelectedMentor(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/20"
                  >
                    Confirm Session
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
