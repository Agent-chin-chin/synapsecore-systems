"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useToast } from "@/components/toast-provider";
import LessonPlayer from "@/components/learner/lesson-player";
import ProgressBar from "@/components/learner/progress-bar";

interface VideoItem { url?: string; type?: string; title?: string; duration?: number; }
interface DownloadItem { label?: string; url?: string; fileType?: string; }
interface QuizRef { quizId?: string; }
interface AssignmentItem { title?: string; description?: string; dueInDays?: number; points?: number; }
interface Module {
  _id?: string;
  title: string;
  description?: string;
  notes?: string;
  order?: number;
  unlockRule?: string;
  quiz?: QuizRef;
  assignment?: AssignmentItem;
  lessons?: Lesson[];
}
interface Lesson {
  _id?: string;
  title: string;
  description?: string;
  notes?: string;
  videos?: VideoItem[];
  duration?: number;
  downloads?: DownloadItem[];
  quiz?: QuizRef;
  assignment?: AssignmentItem;
  discussionEnabled?: boolean;
  completed?: boolean;
}
interface Course {
  _id: string;
  title: string;
  description: string;
  notes?: { explanation?: string; practical?: string; summary?: string };
  price?: number;
  duration?: string;
  level?: string;
  rating?: number;
  enrollmentCount?: number;
  category?: string;
  modules?: Module[];
  instructor?: { name?: string; bio?: string; avatar?: string };
  certificate?: { enabled?: boolean; requireQuizAvg?: number; requireFinalProject?: boolean };
}

export default function LearnerCourseDetail() {
  const params = useParams();
  const { addToast } = useToast();
  const courseId = params?.id;
  const [course, setCourse] = useState<Course | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number | null>(null);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const [quizTitles, setQuizTitles] = useState<Record<string, string>>({});

  const moduleCount = course?.modules?.length ?? 0;
  const totalLessons = course?.modules?.reduce((s, m) => s + (m.lessons?.length ?? 0), 0) ?? 0;

  useEffect(() => {
    if (!courseId) return;
    const loadCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        const [courseRes, meRes] = await Promise.all([
          fetch(`/api/learner/courses/${courseId}`, { credentials: "include" }),
          fetch("/api/auth/me", { credentials: "include" }),
        ]);
        if (!courseRes.ok) throw new Error("Course not found");
        const courseData = (await courseRes.json()) as Course;
        setCourse(courseData);

        // collect quiz ids to resolve titles
        const quizIds: string[] = [];
        courseData.modules?.forEach((m) => {
          if (m.quiz?.quizId) quizIds.push(m.quiz.quizId);
          m.lessons?.forEach((l) => { if (l.quiz?.quizId) quizIds.push(l.quiz.quizId); });
        });
        if (quizIds.length) {
          try {
            const qRes = await fetch(`/api/instructor/quizzes?ids=${quizIds.join(",")}`, { credentials: "include" });
            if (qRes.ok) {
              const quizzes = await qRes.json();
              const map: Record<string, string> = {};
              quizzes.forEach((q: any) => { map[String(q._id)] = q.title; });
              setQuizTitles(map);
            }
          } catch { /* ignore */ }
        }

        // progress
        try {
          const progRes = await fetch(`/api/learner/course-progress?courseId=${encodeURIComponent(String(courseId))}`, { credentials: "include" });
          if (progRes.ok) {
            const progData = await progRes.json();
            const map: Record<string, boolean> = {};
            (progData.completedLessons ?? []).forEach((entry: any) => {
              map[`${entry.moduleIndex}:${entry.lessonIndex}`] = true;
            });
            setCompletedLessons(map);
          }
        } catch { /* ignore */ }

        // Authoritative enrollment state from the course API (server-enforced).
        if (typeof (courseData as any).enrolled === 'boolean') {
          setEnrolled((courseData as any).enrolled);
        }

        if (meRes.ok) {
          const meData = await meRes.json();
          const enrolledCourses = meData.data?.learnerProfile?.enrolledCourses || [];
          if (enrolledCourses.some((e: any) => String(e.courseId) === String(courseId))) {
            setEnrolled(true);
          }
        }
      } catch {
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [courseId]);

  const handlePay = async () => {
    if (!course || !courseId) return;
    setPaying(true);
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, amount: course.price || 0 }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast("error", data.error || "Could not start payment");
        return;
      }
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        addToast("error", "No payment URL returned");
      }
    } catch {
      addToast("error", "Payment initiation failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  const handleContinueLearning = () => {
    if (!course || !course.modules || course.modules.length === 0) {
      addToast("info", "No lessons available yet.");
      return;
    }
    for (let m = 0; m < course.modules.length; m++) {
      const lessons = course.modules[m].lessons || [];
      for (let l = 0; l < lessons.length; l++) {
        if (!completedLessons[`${m}:${l}`]) {
          setSelectedModuleIndex(m);
          setSelectedLessonIndex(l);
          addToast("info", `Starting: ${lessons[l].title}`);
          return;
        }
      }
    }
    setSelectedModuleIndex(0);
    setSelectedLessonIndex(0);
  };

  const markComplete = async (m: number, l: number) => {
    const key = `${m}:${l}`;
    setCompletedLessons((s) => ({ ...s, [key]: true }));
    try {
      await fetch("/api/learner/course-progress", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, moduleIndex: m, lessonIndex: l, completed: true }),
      });
      addToast("success", "Lesson completed!");
    } catch {
      setCompletedLessons((s) => { const c = { ...s }; delete c[key]; return c; });
      addToast("error", "Failed to save progress");
    }
  };

  // unlock logic: a lesson is locked if its module's unlockRule requires prior completion
  const isLessonLocked = (m: number, l: number): boolean => {
    const module = course?.modules?.[m];
    if (!module) return false;
    const rule = module.unlockRule || "videoComplete";
    if (rule === "immediate") return false;
    // prior lesson in same module must be completed
    if (l > 0) {
      if (!completedLessons[`${m}:${l - 1}`]) return true;
    } else if (m > 0) {
      const prev = course!.modules![m - 1];
      const lastIdx = (prev.lessons?.length ?? 1) - 1;
      if (!completedLessons[`${m - 1}:${lastIdx}`]) return true;
    }
    return false;
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white p-8">Loading course details...</div>;
  if (error || !course) return <div className="min-h-screen bg-gray-900 text-white p-8">{error || "Course not found"}</div>;

  const selectedLesson =
    selectedModuleIndex !== null && selectedLessonIndex !== null
      ? course.modules?.[selectedModuleIndex]?.lessons?.[selectedLessonIndex] || null
      : null;
  const selectedKey = selectedModuleIndex !== null && selectedLessonIndex !== null ? `${selectedModuleIndex}:${selectedLessonIndex}` : null;
  const selectedQuizId = selectedLesson?.quiz?.quizId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-900 text-white py-12 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gray-800 border border-green-400/20 rounded-lg p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-4">
            <div>
              <h1 className="text-4xl font-bold text-green-400 mb-2">{course.title}</h1>
              <p className="text-gray-400 mb-4">{course.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-400">{course.price ? `₦${course.price.toLocaleString()}` : "Free"}</div>
              <div className="text-gray-400 text-sm">One-time payment</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-gray-300">
            <div>⏱️ Duration: {course.duration || "Self-paced"}</div>
            <div>📊 Level: {course.level || "Intermediate"}</div>
            <div>⭐ Rating: {course.rating ?? "N/A"}</div>
            <div>👥 Enrolled: {course.enrollmentCount ?? 0}</div>
          </div>

          <div className="bg-slate-950 border border-green-400/10 rounded-3xl p-6 mb-6">
            <h2 className="text-xl font-bold text-green-400 mb-4">Course Notes</h2>
            <div className="space-y-4 text-gray-300">
              <div><h3 className="font-semibold text-white">Summary</h3><p>{course.notes?.summary || "A concise summary of the course is coming soon."}</p></div>
              <div><h3 className="font-semibold text-white">Explanation</h3><p>{course.notes?.explanation || "A clear explanation of the course goals and learning path."}</p></div>
              <div><h3 className="font-semibold text-white">Practical</h3><p>{course.notes?.practical || "Hands-on tasks and practical applications will help you learn by doing."}</p></div>
            </div>
          </div>

          {!enrolled ? (
            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded transition-colors disabled:opacity-50"
            >
              {paying ? "Redirecting to Paystack..." : `Pay ₦${course.price?.toLocaleString() || 0} & Enroll`}
            </button>
          ) : (
            <button
              onClick={handleContinueLearning}
              className="w-full sm:w-auto bg-green-700 text-white font-bold py-3 px-6 rounded"
            >
              ✓ Enrolled - Continue Learning
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-gray-800 border border-green-400/20 rounded-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-green-400">Course Modules</h2>
            <div className="w-48"><ProgressBar completed={Object.values(completedLessons).filter(Boolean).length} total={totalLessons} /></div>
          </div>

          <div className="space-y-3">
            {(course.modules || []).map((module, mIdx) => (
              <motion.div key={module._id || mIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 + mIdx * 0.1 }} className="bg-gray-700 rounded p-4">
                <h3 className="font-bold mb-2">{module.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{module.description || `${module.lessons?.length ?? 0} lessons`}</p>
                <div className="space-y-2">
                  {(module.lessons || []).map((lesson, lIdx) => {
                    const key = `${mIdx}:${lIdx}`;
                    const isCompleted = Boolean(completedLessons[key] || lesson.completed);
                    const isSelected = selectedModuleIndex === mIdx && selectedLessonIndex === lIdx;
                    const locked = !enrolled ? false : isLessonLocked(mIdx, lIdx);
                    return (
                      <motion.div key={lesson._id || lIdx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`flex items-center justify-between p-2 rounded ${isSelected ? "bg-green-900/30" : "hover:bg-gray-800"}`}>
                        <button
                          disabled={locked}
                          onClick={() => { setSelectedModuleIndex(mIdx); setSelectedLessonIndex(lIdx); }}
                          className={`text-left ${locked ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <div className="font-medium">{lesson.title}</div>
                          <div className="text-xs text-gray-400">{lesson.duration ? `${lesson.duration} mins` : ""}</div>
                        </button>
                        <div className="flex items-center gap-2">
                          {locked ? <span className="text-xs text-amber-300">🔒 Locked</span> :
                            isCompleted ? <span className="text-sm text-green-300">Completed</span> :
                              <button onClick={() => markComplete(mIdx, lIdx)} className="text-sm text-blue-300 underline hover:text-blue-200">Mark complete</button>}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                {module.assignment && (
                  <div className="mt-2 rounded-xl bg-slate-800 p-2 text-xs text-slate-300">📝 Module assignment: {module.assignment.title}</div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2">
            <div className="bg-gray-800 border border-green-400/20 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-green-400 mb-4">Lesson Player</h3>
              {enrolled ? (
                <LessonPlayer
                  lesson={selectedLesson || null}
                  isCompleted={selectedKey ? Boolean(completedLessons[selectedKey]) : false}
                  locked={selectedModuleIndex !== null && selectedLessonIndex !== null ? isLessonLocked(selectedModuleIndex, selectedLessonIndex) : false}
                  quizTitle={selectedQuizId ? quizTitles[String(selectedQuizId)] || "Quiz" : null}
                  onEnded={() => { if (selectedKey) markComplete(selectedModuleIndex!, selectedLessonIndex!); }}
                  onMarkComplete={() => { if (selectedKey) markComplete(selectedModuleIndex!, selectedLessonIndex!); }}
                />
              ) : (
                <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-6 text-center text-amber-200">
                  🔒 Enroll in this course to access lesson videos and downloadable resources.
                </div>
              )}
            </div>

            <div className="bg-gray-800 border border-green-400/20 rounded-lg p-6">
              <h3 className="text-lg font-bold text-green-400 mb-4">Instructor</h3>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center text-2xl">{course.instructor?.avatar || "👨‍🏫"}</div>
                <div>
                  <h4 className="font-bold">{course.instructor?.name || "Instructor"}</h4>
                  <p className="text-gray-400">{course.instructor?.bio || "Experienced security trainer helping learners build practical skills."}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-green-400/20 rounded-lg p-4">
              <h4 className="font-bold text-green-400 mb-3">Certificate</h4>
              <p className="text-sm text-slate-300">
                {course.certificate?.enabled
                  ? `Earn a certificate by completing all lessons${course.certificate.requireQuizAvg ? ` with ${course.certificate.requireQuizAvg}% avg quiz score` : ""}${course.certificate.requireFinalProject ? " and the final project" : ""}.`
                  : "No certificate for this course."}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
