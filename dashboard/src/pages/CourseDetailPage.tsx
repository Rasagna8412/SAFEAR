import { useParams, useNavigate } from 'react-router-dom';
import { INITIAL_COURSES } from '../data/coursesData';
import { useTranslation } from '../i18n/I18nContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import {
  ArrowLeft,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  Share2,
  Box
} from 'lucide-react';

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { language, t } = useTranslation();

  const course = INITIAL_COURSES.find((c) => c.id === courseId);

  if (!course) {
    return (
      <EmptyState
        icon={<AlertTriangle className="w-8 h-8 text-amber-500" />}
        title="Course Not Found"
        description={`No training course was found with ID: ${courseId}`}
        actionLabel={t.back}
        onAction={() => navigate('/courses')}
      />
    );
  }

  const categoryBadgeVariant = {
    Mining: 'mining',
    Manufacturing: 'mfg',
    Emergency: 'danger'
  } as const;

  const difficultyVariant = {
    Beginner: 'success',
    Intermediate: 'warning',
    Advanced: 'danger'
  } as const;

  const handleLaunchTraining = () => {
    navigate(`/training/${course.scenarioId}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-left">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        onClick={() => navigate('/courses')}
        className="text-slate-400 hover:text-white"
      >
        {language === 'hi' ? 'सभी पाठ्यक्रमों पर वापस जाएं' : language === 'sat' ? 'ᱡᱚᱛᱚ ᱠᱳᱨᱥ ᱛᱮ ᱨᱩᱣᱟᱹᱲ' : 'Back to All Courses'}
      </Button>

      {/* Main Course Header Hero */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Badge variant={categoryBadgeVariant[course.category]} size="md">
                {course.category}
              </Badge>
              <Badge variant={difficultyVariant[course.difficulty]} size="md">
                {course.difficulty}
              </Badge>
              <span className="text-xs font-bold text-slate-400 font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                ID: {course.scenarioId}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {course.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{course.durationMinutes} {t.minutesLabel}</span>
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t.passThreshold}</span>
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                <Box className="w-4 h-4 text-cyan-400" />
                <span>3D WebGL / Camera AR</span>
              </span>
            </div>
          </div>

          {/* Action Callout Box */}
          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 lg:w-72 shrink-0 space-y-3">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {language === 'hi' ? 'प्रशिक्षण स्थिति' : language === 'sat' ? 'ᱴᱨᱮᱱᱤᱝ ᱴᱷᱟᱶ' : 'Course Status'}
              </span>
              <p className="text-lg font-bold text-amber-400">
                {language === 'hi' ? 'शुरू करने के लिए तैयार' : language === 'sat' ? 'ᱮᱦᱚᱵ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱯᱲᱟᱣ' : 'Ready for Training'}
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<Play className="w-5 h-5 fill-current" />}
              onClick={handleLaunchTraining}
            >
              {t.startDrill}
            </Button>

            <Button
              variant="outline"
              size="sm"
              fullWidth
              leftIcon={<Share2 className="w-3.5 h-3.5" />}
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert(t.saved);
              }}
            >
              {language === 'hi' ? 'पाठ्यक्रम साझा करें' : language === 'sat' ? 'ᱠᱳᱨᱥ ᱥᱮᱭᱟᱨ' : 'Share Curriculum'}
            </Button>
          </div>
        </div>
      </div>

      {/* Curriculum Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Topics & Learning Outcomes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Topics Covered */}
          <Card className="space-y-4">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>{t.coreTopics}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.topics.map((topic, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">{topic}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Learning Outcomes */}
          <Card className="space-y-4">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{language === 'hi' ? 'दक्षता परिणाम' : language === 'sat' ? 'ᱥᱮᱪᱮᱫ ᱚᱨᱡᱚ' : 'Demonstrated Competency Outcomes'}</span>
            </h2>
            <div className="space-y-2.5">
              {course.learningOutcomes.map((outcome, i) => (
                <div key={i} className="flex items-start gap-3 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{outcome}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Prerequisites & Certification Details */}
        <div className="space-y-6">
          <Card className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              {language === 'hi' ? 'आवश्यकताएं' : language === 'sat' ? 'ᱞᱟᱹᱠᱛᱤᱭᱟᱱ ᱠᱟᱛᱷᱟ' : 'Prerequisites'}
            </h3>
            {course.prerequisites && course.prerequisites.length > 0 ? (
              <ul className="text-xs text-slate-400 space-y-1.5">
                {course.prerequisites.map((req, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">{language === 'hi' ? 'कोई पूर्व आवश्यकता नहीं' : 'None required.'}</p>
            )}
          </Card>

          <Card className="space-y-3 border-amber-500/30 bg-gradient-to-br from-slate-900 to-amber-950/20">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.activeOnChainCredential}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.noCertificatesSub}
            </p>
            <div className="p-3 rounded-lg bg-slate-950 border border-amber-500/40 text-center">
              <p className="text-xs font-bold text-amber-400">{course.badgeName || 'Safety Certified'}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailPage;
