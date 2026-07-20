'use client';

import { FormEvent, useEffect, useState } from 'react';

interface VideoItem { url: string; type?: string; title?: string; duration?: number; }
interface DownloadItem { label: string; url: string; fileType?: string; }
interface QuizRef { quizId?: string; }
interface AssignmentItem { title: string; description?: string; dueInDays?: number; points?: number; }
interface QuestionItem { question: string; options: string[]; correctAnswer: number; explanation?: string; }

interface Lesson {
  _id?: string;
  title: string;
  description?: string;
  notes?: string;
  videos: VideoItem[];
  duration?: number;
  downloads: DownloadItem[];
  quiz?: QuizRef;
  assignment?: AssignmentItem;
  discussionEnabled?: boolean;
  subtitles?: { lang?: string; label?: string; url?: string }[];
  playground?: { enabled?: boolean; kind?: string };
  aiTutor?: { enabled?: boolean };
  order?: number;
}
interface Module {
  _id?: string;
  title: string;
  description?: string;
  notes?: string;
  order?: number;
  lessons: Lesson[];
  quiz?: QuizRef;
  assignment?: AssignmentItem;
  unlockRule?: string;
}
interface Course {
  _id?: string;
  title: string;
  category: string;
  level: string;
  price: number;
  duration: string;
  description?: string;
  published?: boolean;
  featured?: boolean;
  notes?: { explanation?: string; practical?: string; summary?: string };
  modules: Module[];
  certificate?: { enabled: boolean; requireQuizAvg: number; requireFinalProject: boolean };
  instructor?: { name: string; bio?: string; avatar?: string };
}
interface Quiz {
  _id?: string;
  title: string;
  description?: string;
  scope?: string;
  questions: QuestionItem[];
  passingScore?: number;
}

const CATEGORIES = ['Security', 'Hacking', 'Networks', 'Compliance', 'Forensics', 'Administration', 'AI Automation', 'Web Development', 'Cloud Security'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const UNLOCK_RULES = ['immediate', 'videoComplete', 'quizPass', 'assignmentSubmit'];

const blankCourse = (): Course => ({
  title: '', category: 'Security', level: 'Beginner', price: 4700, duration: '4 weeks',
  description: '', published: false, featured: false,
  notes: { explanation: '', practical: '', summary: '' },
  modules: [], certificate: { enabled: true, requireQuizAvg: 70, requireFinalProject: false },
  instructor: { name: '' },
});

export default function CourseEditorClient() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [editing, setEditing] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<number>(-1);
  const [selectedLesson, setSelectedLesson] = useState<number>(-1);
  const [activeTab, setActiveTab] = useState<'details' | 'modules' | 'certificate'>('details');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const api = async (url: string, method = 'GET', body?: any) => {
    const res = await fetch(url, {
      method, credentials: 'include',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  };

  const load = async () => {
    try {
      const [c, q] = await Promise.all([
        api('/api/instructor/courses'),
        api('/api/instructor/quizzes'),
      ]);
      setCourses(c);
      setQuizzes(q);
    } catch (e: any) { setMsg(e.message); }
  };

  useEffect(() => { load(); }, []);

  const newCourse = () => {
    setEditing(blankCourse());
    setSelectedModule(-1); setSelectedLesson(-1); setActiveTab('details'); setMsg(null);
  };

  const editCourse = (c: Course) => {
    setEditing(JSON.parse(JSON.stringify(c)));
    setSelectedModule(-1); setSelectedLesson(-1); setActiveTab('details'); setMsg(null);
  };

  const saveCourse = async () => {
    if (!editing) return;
    setBusy(true); setMsg(null);
    try {
      if (editing._id) {
        await api(`/api/instructor/courses/${editing._id}`, 'PUT', editing);
        setMsg('Course updated.');
      } else {
        const created = await api('/api/instructor/courses', 'POST', editing);
        setEditing(created); setMsg('Course created.');
      }
      await load();
    } catch (e: any) { setMsg(e.message); }
    finally { setBusy(false); }
  };

  const deleteCourse = async (id: string) => {
    if (!confirm('Delete this course permanently?')) return;
    setBusy(true);
    try { await api(`/api/instructor/courses/${id}`, 'DELETE'); setMsg('Course deleted.'); await load(); if (editing?._id === id) setEditing(null); }
    catch (e: any) { setMsg(e.message); }
    finally { setBusy(false); }
  };

  // ----- Module helpers -----
  const addModule = async () => {
    if (!editing?._id) { setMsg('Save the course first, then add modules.'); return; }
    setBusy(true);
    try {
      const mod = await api(`/api/instructor/courses/${editing._id}/modules`, 'POST', { title: 'New Module' });
      const fresh = await api(`/api/instructor/courses/${editing._id}`);
      setEditing(fresh); setMsg('Module added.');
    } catch (e: any) { setMsg(e.message); }
    finally { setBusy(false); }
  };

  const updateModule = async (moduleId: string, patch: any) => {
    if (!editing?._id) return;
    setBusy(true);
    try {
      await api(`/api/instructor/courses/${editing._id}/modules`, 'PUT', { moduleId, ...patch });
      const fresh = await api(`/api/instructor/courses/${editing._id}`);
      setEditing(fresh);
    } catch (e: any) { setMsg(e.message); }
    finally { setBusy(false); }
  };

  const deleteModule = async (moduleId: string) => {
    if (!confirm('Delete this module and its lessons?')) return;
    if (!editing?._id) return;
    setBusy(true);
    try {
      await api(`/api/instructor/courses/${editing._id}/modules`, 'DELETE', { moduleId });
      const fresh = await api(`/api/instructor/courses/${editing._id}`);
      setEditing(fresh); setSelectedModule(-1); setSelectedLesson(-1);
    } catch (e: any) { setMsg(e.message); }
    finally { setBusy(false); }
  };

  // ----- Lesson helpers -----
  const addLesson = async (moduleId: string) => {
    if (!editing?._id) return;
    setBusy(true);
    try {
      await api(`/api/instructor/courses/${editing._id}/modules/${moduleId}/lessons`, 'POST', { title: 'New Lesson' });
      const fresh = await api(`/api/instructor/courses/${editing._id}`);
      setEditing(fresh);
    } catch (e: any) { setMsg(e.message); }
    finally { setBusy(false); }
  };

  const updateLesson = async (moduleId: string, lessonId: string, patch: any) => {
    if (!editing?._id) return;
    setBusy(true);
    try {
      await api(`/api/instructor/courses/${editing._id}/modules/${moduleId}/lessons`, 'PUT', { lessonId, ...patch });
      const fresh = await api(`/api/instructor/courses/${editing._id}`);
      setEditing(fresh);
    } catch (e: any) { setMsg(e.message); }
    finally { setBusy(false); }
  };

  const deleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm('Delete this lesson?')) return;
    if (!editing?._id) return;
    setBusy(true);
    try {
      await api(`/api/instructor/courses/${editing._id}/modules/${moduleId}/lessons`, 'DELETE', { lessonId });
      const fresh = await api(`/api/instructor/courses/${editing._id}`);
      setEditing(fresh); setSelectedLesson(-1);
    } catch (e: any) { setMsg(e.message); }
    finally { setBusy(false); }
  };

  // ----- Quiz CRUD -----
  const saveQuiz = async (quiz: Quiz) => {
    setBusy(true);
    try {
      if (quiz._id) await api(`/api/instructor/quizzes/${quiz._id}`, 'PUT', quiz);
      else await api('/api/instructor/quizzes', 'POST', quiz);
      setQuizzes(await api('/api/instructor/quizzes'));
      setMsg('Quiz saved.');
    } catch (e: any) { setMsg(e.message); }
    finally { setBusy(false); }
  };

  const inputCls = 'mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500';
  const labelCls = 'text-sm text-slate-400';
  const cardCls = 'rounded-2xl border border-slate-800 bg-slate-950 p-4';

  return (
    <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
      {/* Sidebar: course list */}
      <aside className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Courses</h2>
          <button onClick={newCourse} className="rounded-full bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400">+ New</button>
        </div>
        <div className="max-h-[70vh] space-y-2 overflow-auto">
          {courses.map((c) => (
            <div key={c._id} className={`${cardCls} flex items-center justify-between ${editing?._id === c._id ? 'border-cyan-500' : ''}`}>
              <button onClick={() => editCourse(c)} className="text-left">
                <div className="text-sm text-white">{c.title}</div>
                <div className="text-xs text-slate-500">{c.category} · {c.modules?.length || 0} modules</div>
              </button>
              <button onClick={() => deleteCourse(c._id!)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
            </div>
          ))}
        </div>
      </aside>

      {/* Editor */}
      <section className="space-y-4">
        {msg ? <div className="rounded-xl border border-cyan-500/30 bg-slate-900 px-4 py-2 text-sm text-slate-200">{msg}</div> : null}

        {!editing ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-500">
            Select a course or create a new one to start editing.
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
              {(['details', 'modules', 'certificate'] as const).map((t) => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold ${activeTab === t ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-300'}`}>
                  {t === 'details' ? 'Course Details' : t === 'modules' ? 'Modules & Lessons' : 'Certificate'}
                </button>
              ))}
            </div>

            {activeTab === 'details' && (
              <div className={`${cardCls} space-y-4`}>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block"><span className={labelCls}>Title</span>
                    <input className={inputCls} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></label>
                  <label className="block"><span className={labelCls}>Category</span>
                    <select className={inputCls} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="block"><span className={labelCls}>Level</span>
                    <select className={inputCls} value={editing.level} onChange={(e) => setEditing({ ...editing, level: e.target.value })}>
                      {LEVELS.map((l) => <option key={l}>{l}</option>)}</select></label>
                  <label className="block"><span className={labelCls}>Price (₦)</span>
                    <input type="number" className={inputCls} value={editing.price}
                      onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} /></label>
                  <label className="block"><span className={labelCls}>Duration</span>
                    <input className={inputCls} value={editing.duration} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} /></label>
                </div>
                <label className="block"><span className={labelCls}>Description</span>
                  <textarea rows={3} className={inputCls} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></label>
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="block"><span className={labelCls}>Notes · Explanation (markdown)</span>
                    <textarea rows={3} className={inputCls} value={editing.notes?.explanation || ''} onChange={(e) => setEditing({ ...editing, notes: { ...editing.notes!, explanation: e.target.value } })} /></label>
                  <label className="block"><span className={labelCls}>Notes · Practical (markdown)</span>
                    <textarea rows={3} className={inputCls} value={editing.notes?.practical || ''} onChange={(e) => setEditing({ ...editing, notes: { ...editing.notes!, practical: e.target.value } })} /></label>
                  <label className="block"><span className={labelCls}>Notes · Summary (markdown)</span>
                    <textarea rows={3} className={inputCls} value={editing.notes?.summary || ''} onChange={(e) => setEditing({ ...editing, notes: { ...editing.notes!, summary: e.target.value } })} /></label>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="block"><span className={labelCls}>Instructor Name</span>
                    <input className={inputCls} value={editing.instructor?.name || ''} onChange={(e) => setEditing({ ...editing, instructor: { ...editing.instructor!, name: e.target.value } })} /></label>
                  <label className="block"><span className={labelCls}>Instructor Bio</span>
                    <input className={inputCls} value={editing.instructor?.bio || ''} onChange={(e) => setEditing({ ...editing, instructor: { ...editing.instructor!, bio: e.target.value } })} /></label>
                  <label className="block"><span className={labelCls}>Instructor Avatar URL</span>
                    <input className={inputCls} value={editing.instructor?.avatar || ''} onChange={(e) => setEditing({ ...editing, instructor: { ...editing.instructor!, avatar: e.target.value } })} /></label>
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input type="checkbox" checked={!!editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} /> Published</label>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Featured</label>
                </div>
                <button onClick={saveCourse} disabled={busy}
                  className="rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50">
                  {editing._id ? 'Save Changes' : 'Create Course'}</button>
              </div>
            )}

            {activeTab === 'modules' && (
              <div className="space-y-4">
                <button onClick={addModule} disabled={busy || !editing._id}
                  className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50">+ Add Module</button>

                {editing.modules.map((mod, mi) => (
                  <div key={mod._id || mi} className={cardCls}>
                    <div className="flex items-center justify-between">
                      <input className={`${inputCls} max-w-md`} value={mod.title}
                        onChange={(e) => { const m = [...editing.modules]; m[mi] = { ...m[mi], title: e.target.value }; setEditing({ ...editing, modules: m }); }}
                        onBlur={() => mod._id && updateModule(mod._id, { title: mod.title })} />
                      <button onClick={() => mod._id && deleteModule(mod._id)} className="text-xs text-red-400">Delete Module</button>
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <label className="block"><span className={labelCls}>Description</span>
                        <textarea rows={2} className={inputCls} value={mod.description || ''}
                          onChange={(e) => { const m = [...editing.modules]; m[mi] = { ...m[mi], description: e.target.value }; setEditing({ ...editing, modules: m }); }}
                          onBlur={() => mod._id && updateModule(mod._id, { description: mod.description })} /></label>
                      <label className="block"><span className={labelCls}>Unlock Rule</span>
                        <select className={inputCls} value={mod.unlockRule || 'videoComplete'}
                          onChange={(e) => { const m = [...editing.modules]; m[mi] = { ...m[mi], unlockRule: e.target.value }; setEditing({ ...editing, modules: m }); }}
                          onBlur={() => mod._id && updateModule(mod._id, { unlockRule: mod.unlockRule })}>
                          {UNLOCK_RULES.map((r) => <option key={r} value={r}>{r}</option>)}</select></label>
                    </div>

                    {/* Module-level assignment */}
                    <div className="mt-3 rounded-xl border border-slate-800 p-3">
                      <div className="mb-2 text-xs font-semibold text-cyan-300">Module Assignment (optional)</div>
                      <div className="grid gap-2 md:grid-cols-3">
                        <input className={inputCls} placeholder="Title" value={mod.assignment?.title || ''}
                          onChange={(e) => { const m = [...editing.modules]; m[mi] = { ...m[mi], assignment: { ...m[mi].assignment!, title: e.target.value } }; setEditing({ ...editing, modules: m }); }}
                          onBlur={() => mod._id && updateModule(mod._id, { assignment: mod.assignment })} />
                        <input className={inputCls} placeholder="Due in days" type="number" value={mod.assignment?.dueInDays || ''}
                          onChange={(e) => { const m = [...editing.modules]; m[mi] = { ...m[mi], assignment: { ...m[mi].assignment!, dueInDays: Number(e.target.value) } }; setEditing({ ...editing, modules: m }); }}
                          onBlur={() => mod._id && updateModule(mod._id, { assignment: mod.assignment })} />
                        <input className={inputCls} placeholder="Points" type="number" value={mod.assignment?.points || ''}
                          onChange={(e) => { const m = [...editing.modules]; m[mi] = { ...m[mi], assignment: { ...m[mi].assignment!, points: Number(e.target.value) } }; setEditing({ ...editing, modules: m }); }}
                          onBlur={() => mod._id && updateModule(mod._id, { assignment: mod.assignment })} />
                      </div>
                    </div>

                    {/* Module-level quiz reference */}
                    <div className="mt-3">
                      <label className="block"><span className={labelCls}>Module Quiz (reference reusable quiz)</span>
                        <select className={inputCls} value={mod.quiz?.quizId || ''}
                          onChange={(e) => { const m = [...editing.modules]; m[mi] = { ...m[mi], quiz: { quizId: e.target.value } }; setEditing({ ...editing, modules: m }); }}
                          onBlur={() => mod._id && updateModule(mod._id, { quiz: mod.quiz })}>
                          <option value="">— None —</option>
                          {quizzes.map((q) => <option key={q._id} value={q._id}>{q.title}</option>)}
                        </select></label>
                    </div>

                    {/* Lessons */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white">Lessons ({mod.lessons.length})</span>
                        <button onClick={() => mod._id && addLesson(mod._id)} disabled={!mod._id}
                          className="rounded-full bg-slate-800 px-3 py-1 text-xs text-cyan-300 hover:bg-slate-700 disabled:opacity-50">+ Add Lesson</button>
                      </div>
                      {mod.lessons.map((les, li) => (
                        <div key={les._id || li} className="rounded-xl border border-slate-800 p-3">
                          <div className="flex items-center justify-between">
                            <input className={`${inputCls} max-w-md`} value={les.title}
                              onChange={(e) => { const m = [...editing.modules]; m[mi].lessons[li] = { ...m[mi].lessons[li], title: e.target.value }; setEditing({ ...editing, modules: m }); }}
                              onBlur={() => mod._id && les._id && updateLesson(mod._id, les._id, { title: les.title })} />
                            <button onClick={() => mod._id && les._id && deleteLesson(mod._id, les._id)} className="text-xs text-red-400">Delete</button>
                          </div>

                          <div className="mt-2 grid gap-2 md:grid-cols-2">
                            <label className="block"><span className={labelCls}>Lesson Notes (markdown)</span>
                              <textarea rows={2} className={inputCls} value={les.notes || ''}
                                onChange={(e) => { const m = [...editing.modules]; m[mi].lessons[li] = { ...m[mi].lessons[li], notes: e.target.value }; setEditing({ ...editing, modules: m }); }}
                                onBlur={() => mod._id && les._id && updateLesson(mod._id, les._id, { notes: les.notes })} /></label>
                            <label className="block"><span className={labelCls}>Video URL(s)</span>
                              <input className={inputCls} placeholder="https://..." value={(les.videos?.[0]?.url) || ''}
                                onChange={(e) => { const m = [...editing.modules]; m[mi].lessons[li] = { ...m[mi].lessons[li], videos: [{ url: e.target.value, type: 'recorded', title: les.title }] }; setEditing({ ...editing, modules: m }); }}
                                onBlur={() => mod._id && les._id && updateLesson(mod._id, les._id, { videos: les.videos })} /></label>
                          </div>

                          <div className="mt-2 grid gap-2 md:grid-cols-3">
                            <label className="flex items-center gap-2 text-xs text-slate-300">
                              <input type="checkbox" checked={!!les.discussionEnabled}
                                onChange={(e) => { const m = [...editing.modules]; m[mi].lessons[li] = { ...m[mi].lessons[li], discussionEnabled: e.target.checked }; setEditing({ ...editing, modules: m }); }}
                                onBlur={() => mod._id && les._id && updateLesson(mod._id, les._id, { discussionEnabled: les.discussionEnabled })} /> Discussion</label>
                            <label className="flex items-center gap-2 text-xs text-slate-300">
                              <input type="checkbox" checked={!!les.aiTutor?.enabled}
                                onChange={(e) => { const m = [...editing.modules]; m[mi].lessons[li] = { ...m[mi].lessons[li], aiTutor: { enabled: e.target.checked } }; setEditing({ ...editing, modules: m }); }}
                                onBlur={() => mod._id && les._id && updateLesson(mod._id, les._id, { aiTutor: les.aiTutor })} /> AI Tutor</label>
                            <label className="block"><span className={labelCls}>Duration (min)</span>
                              <input type="number" className={inputCls} value={les.duration || ''}
                                onChange={(e) => { const m = [...editing.modules]; m[mi].lessons[li] = { ...m[mi].lessons[li], duration: Number(e.target.value) }; setEditing({ ...editing, modules: m }); }}
                                onBlur={() => mod._id && les._id && updateLesson(mod._id, les._id, { duration: les.duration })} /></label>
                          </div>

                          {/* Downloads */}
                          <div className="mt-2">
                            <span className={labelCls}>Downloads</span>
                            {(les.downloads || []).map((d, di) => (
                              <div key={di} className="mt-1 grid grid-cols-[1fr,1fr,auto] gap-2">
                                <input className={inputCls} placeholder="Label" value={d.label}
                                  onChange={(e) => { const m = [...editing.modules]; m[mi].lessons[li].downloads[di] = { ...d, label: e.target.value }; setEditing({ ...editing, modules: m }); }}
                                  onBlur={() => mod._id && les._id && updateLesson(mod._id, les._id, { downloads: les.downloads })} />
                                <input className={inputCls} placeholder="URL" value={d.url}
                                  onChange={(e) => { const m = [...editing.modules]; m[mi].lessons[li].downloads[di] = { ...d, url: e.target.value }; setEditing({ ...editing, modules: m }); }}
                                  onBlur={() => mod._id && les._id && updateLesson(mod._id, les._id, { downloads: les.downloads })} />
                                <button onClick={() => { const m = [...editing.modules]; m[mi].lessons[li].downloads.splice(di, 1); setEditing({ ...editing, modules: m }); mod._id && les._id && updateLesson(mod._id, les._id, { downloads: m[mi].lessons[li].downloads }); }} className="text-xs text-red-400">x</button>
                              </div>
                            ))}
                            <button onClick={() => { const m = [...editing.modules]; const cur = m[mi].lessons[li].downloads || []; m[mi].lessons[li].downloads = [...cur, { label: '', url: '', fileType: 'pdf' }]; setEditing({ ...editing, modules: m }); }}
                              className="mt-1 text-xs text-cyan-300">+ Add Download</button>
                          </div>

                          {/* Lesson quiz + assignment */}
                          <div className="mt-2 grid gap-2 md:grid-cols-2">
                            <label className="block"><span className={labelCls}>Lesson Quiz</span>
                              <select className={inputCls} value={les.quiz?.quizId || ''}
                                onChange={(e) => { const m = [...editing.modules]; m[mi].lessons[li] = { ...m[mi].lessons[li], quiz: { quizId: e.target.value } }; setEditing({ ...editing, modules: m }); }}
                                onBlur={() => mod._id && les._id && updateLesson(mod._id, les._id, { quiz: les.quiz })}>
                                <option value="">— None —</option>
                                {quizzes.map((q) => <option key={q._id} value={q._id}>{q.title}</option>)}
                              </select></label>
                            <label className="block"><span className={labelCls}>Assignment Title</span>
                              <input className={inputCls} value={les.assignment?.title || ''}
                                onChange={(e) => { const m = [...editing.modules]; m[mi].lessons[li] = { ...m[mi].lessons[li], assignment: { ...m[mi].lessons[li].assignment!, title: e.target.value } }; setEditing({ ...editing, modules: m }); }}
                                onBlur={() => mod._id && les._id && updateLesson(mod._id, les._id, { assignment: les.assignment })} /></label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'certificate' && (
              <div className={`${cardCls} space-y-4`}>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input type="checkbox" checked={!!editing.certificate?.enabled}
                    onChange={(e) => setEditing({ ...editing, certificate: { ...editing.certificate!, enabled: e.target.checked } })} /> Certificate enabled</label>
                <label className="block max-w-xs"><span className={labelCls}>Required avg quiz score (%)</span>
                  <input type="number" className={inputCls} value={editing.certificate?.requireQuizAvg ?? 70}
                    onChange={(e) => setEditing({ ...editing, certificate: { ...editing.certificate!, requireQuizAvg: Number(e.target.value) } })} /></label>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input type="checkbox" checked={!!editing.certificate?.requireFinalProject}
                    onChange={(e) => setEditing({ ...editing, certificate: { ...editing.certificate!, requireFinalProject: e.target.checked } })} /> Require final project</label>
                <button onClick={saveCourse} disabled={busy} className="rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50">Save Certificate Settings</button>
              </div>
            )}

            {/* Quiz builder (always available on the side) */}
            <QuizBuilder quizzes={quizzes} onSave={saveQuiz} inputCls={inputCls} labelCls={labelCls} cardCls={cardCls} />
          </>
        )}
      </section>
    </div>
  );
}

function QuizBuilder({ quizzes, onSave, inputCls, labelCls, cardCls }: {
  quizzes: Quiz[]; onSave: (q: Quiz) => void; inputCls: string; labelCls: string; cardCls: string;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Quiz>({ title: '', questions: [{ question: '', options: [''], correctAnswer: 0 }] });

  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Quiz Bank ({quizzes.length})</h3>
        <button onClick={() => { setDraft({ title: '', questions: [{ question: '', options: [''], correctAnswer: 0 }] }); setOpen(!open); }}
          className="rounded-full bg-slate-800 px-3 py-1 text-xs text-cyan-300 hover:bg-slate-700">{open ? 'Close' : '+ New Quiz'}</button>
      </div>
      {open && (
        <div className="mt-3 space-y-2">
          <label className="block"><span className={labelCls}>Title</span>
            <input className={inputCls} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
          <label className="block"><span className={labelCls}>Scope</span>
            <select className={inputCls} value={draft.scope || 'module'} onChange={(e) => setDraft({ ...draft, scope: e.target.value })}>
              <option value="lesson">lesson</option><option value="module">module</option><option value="course">course</option></select></label>
          {draft.questions.map((q, qi) => (
            <div key={qi} className="rounded-xl border border-slate-800 p-2">
              <input className={inputCls} placeholder="Question" value={q.question} onChange={(e) => { const n = [...draft.questions]; n[qi] = { ...n[qi], question: e.target.value }; setDraft({ ...draft, questions: n }); }} />
              {q.options.map((o, oi) => (
                <div key={oi} className="mt-1 flex items-center gap-2">
                  <input className={inputCls} placeholder={`Option ${oi + 1}`} value={o} onChange={(e) => { const n = [...draft.questions]; n[qi].options[oi] = e.target.value; setDraft({ ...draft, questions: n }); }} />
                  <label className="flex items-center gap-1 text-xs text-slate-400">
                    <input type="radio" name={`correct-${qi}`} checked={q.correctAnswer === oi}
                      onChange={() => { const n = [...draft.questions]; n[qi].correctAnswer = oi; setDraft({ ...draft, questions: n }); }} /> correct</label>
                </div>
              ))}
              <button onClick={() => { const n = [...draft.questions]; n[qi].options.push(''); setDraft({ ...draft, questions: n }); }} className="mt-1 text-xs text-cyan-300">+ Option</button>
            </div>
          ))}
          <button onClick={() => setDraft({ ...draft, questions: [...draft.questions, { question: '', options: [''], correctAnswer: 0 }] })} className="text-xs text-cyan-300">+ Question</button>
          <button onClick={() => onSave(draft)} className="block rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400">Save Quiz</button>
        </div>
      )}
      <div className="mt-2 space-y-1">
        {quizzes.map((q) => (
          <div key={q._id} className="flex items-center justify-between text-xs text-slate-400">
            <span>{q.title} · {q.questions.length} Q</span>
            <button onClick={() => setDraft(q)} className="text-cyan-300">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}
