"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Download, FileText, Trophy } from "lucide-react";

interface VideoItem {
  url?: string;
  type?: string;
  title?: string;
  duration?: number;
}
interface DownloadItem {
  label?: string;
  url?: string;
  fileType?: string;
}
interface QuizRef {
  quizId?: string;
}
interface AssignmentItem {
  title?: string;
  description?: string;
  dueInDays?: number;
  points?: number;
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

interface Props {
  lesson: Lesson | null;
  isCompleted?: boolean;
  locked?: boolean;
  onEnded?: () => void;
  onMarkComplete?: () => void;
  quizTitle?: string | null;
}

function renderMarkdownSimple(text?: string) {
  if (!text) return null;
  // Minimal markdown: paragraphs + headings + code fences.
  const blocks = text.split(/\n{2,}/);
  return blocks.map((block, i) => {
    if (block.startsWith("### ")) {
      return <h4 key={i} className="font-semibold text-white mt-3">{block.replace("### ", "")}</h4>;
    }
    if (block.startsWith("## ")) {
      return <h3 key={i} className="font-bold text-white mt-3">{block.replace("## ", "")}</h3>;
    }
    if (block.startsWith("```")) {
      return (
        <pre key={i} className="bg-slate-950 rounded-xl p-3 text-xs text-emerald-300 overflow-auto my-2">
          {block.replace(/```/g, "")}
        </pre>
      );
    }
    return <p key={i} className="text-slate-300 leading-relaxed">{block}</p>;
  });
}

function LessonPlayerContent({
  lesson,
  isCompleted,
  locked,
  onEnded,
  onMarkComplete,
  quizTitle,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [activeVideo, setActiveVideo] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [lesson?._id]);

  const video = lesson?.videos?.[activeVideo] || lesson?.videos?.[0];
  const hasVideo = Boolean(video?.url);

  if (locked) {
    return (
      <div className="w-full rounded-lg border border-amber-400/30 bg-amber-400/10 p-8 text-center text-amber-200">
        🔒 This lesson is locked. Complete the previous requirements to unlock it.
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="w-full rounded-lg border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
        Select a lesson to begin.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg overflow-hidden border border-slate-800 bg-black">
        {hasVideo ? (
          <video
            ref={videoRef}
            key={video?.url}
            src={video?.url}
            controls
            className="w-full h-[360px] bg-black"
            onEnded={onEnded}
          />
        ) : (
          <div className="p-10 text-center text-slate-400">No video for this lesson. Read the notes below.</div>
        )}
      </div>

      {lesson.videos && lesson.videos.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {lesson.videos.map((v, idx) => (
            <button
              key={idx}
              onClick={() => setActiveVideo(idx)}
              className={`rounded-full px-3 py-1 text-xs ${activeVideo === idx ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}
            >
              {v.title || `Video ${idx + 1}`}
            </button>
          ))}
        </div>
      )}

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-emerald-400">{lesson.title}</h3>
          {isCompleted ? (
            <span className="flex items-center gap-1 text-sm text-emerald-300"><CheckCircle2 size={16} /> Completed</span>
          ) : (
            <button
              onClick={onMarkComplete}
              className="rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Mark Complete
            </button>
          )}
        </div>
        {lesson.description && <p className="text-sm text-slate-400 mb-3">{lesson.description}</p>}
        <div className="space-y-2">{renderMarkdownSimple(lesson.notes)}</div>
      </div>

      {lesson.downloads && lesson.downloads.length > 0 && (
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <h4 className="flex items-center gap-2 font-semibold text-white mb-3"><Download size={16} className="text-emerald-400" /> Downloads</h4>
          <div className="space-y-2">
            {lesson.downloads.map((download, index) => (
              <a
                key={index}
                href={download.url}
                className="block rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 hover:bg-slate-800"
              >
                {download.label || download.fileType || 'Download'}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LessonPlayer(props: Props) {
  const lessonKey = props.lesson?._id ?? 'lesson-player-default';
  return <LessonPlayerContent key={lessonKey} {...props} />;
}
