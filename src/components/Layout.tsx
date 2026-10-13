import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { MessageSquarePlus } from 'lucide-react';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { FeedbackModal } from './FeedbackModal';
import { useRoutineReminders } from '../hooks/useRoutineReminders';

export function Layout() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  // Keep routine reminders active continuously across the whole application
  useRoutineReminders();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer onOpenFeedback={() => setFeedbackOpen(true)} />

      {/* Floating Quick Feedback / Bug Report Launcher */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setFeedbackOpen(true)}
          className="group flex items-center gap-2 rounded-full border border-primary/30 bg-card/95 hover:bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer backdrop-blur-md ring-1 ring-black/5 dark:ring-white/10"
          title="Report a bug or suggest a feature"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <MessageSquarePlus className="h-3 w-3" />
          </span>
          <span className="hidden sm:inline">Feedback</span>
        </button>
      </div>

      {/* Feedback & Bug Reporting Modal */}
      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </div>
  );
}
