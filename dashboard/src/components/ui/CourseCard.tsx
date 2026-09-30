import { Course } from '../../types/course';
import { useTranslation } from '../../i18n/I18nContext';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { Clock, ShieldAlert, BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface CourseCardProps {
  course: Course;
  onStart?: () => void;
  className?: string;
}

export function CourseCard({ course, onStart, className = '' }: CourseCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  return (
    <Card variant="interactive" className={`flex flex-col justify-between h-full text-left ${className}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Badge variant={categoryBadgeVariant[course.category]}>
            {course.category}
          </Badge>
          <Badge variant={difficultyVariant[course.difficulty]} size="sm">
            {course.difficulty}
          </Badge>
        </div>

        <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
          {course.title}
        </h3>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        <div className="pt-2 border-t border-slate-800 flex items-center gap-4 text-xs text-slate-300">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{course.durationMinutes} {t.minutesLabel}</span>
          </span>
          <span className="flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>{course.topics.length} {t.topicsLabel}</span>
          </span>
        </div>

        <div className="space-y-1 pt-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t.coreTopics}:</p>
          <ul className="text-xs text-slate-300 space-y-0.5">
            {course.topics.slice(0, 3).map((topic, i) => (
              <li key={i} className="flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 shrink-0"></span>
                <span className="truncate">{topic}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-5 mt-4 border-t border-slate-800 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          leftIcon={<BookOpen className="w-4 h-4" />}
          onClick={() => navigate(`/courses/${course.id}`)}
        >
          {t.viewDetails}
        </Button>
        <Button
          variant="primary"
          size="sm"
          fullWidth
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={() => onStart ? onStart() : navigate(`/courses/${course.id}`)}
        >
          {t.startDrill}
        </Button>
      </div>
    </Card>
  );
}
