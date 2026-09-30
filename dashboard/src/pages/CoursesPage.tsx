import { useState, useMemo } from 'react';
import { INITIAL_COURSES } from '../data/coursesData';
import { CourseCategory } from '../types/course';
import { useTranslation } from '../i18n/I18nContext';
import { CourseCard } from '../components/ui/CourseCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Search, Filter, BookOpen } from 'lucide-react';

export function CoursesPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | 'All'>('All');

  const filteredCourses = useMemo(() => {
    return INITIAL_COURSES.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || course.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categories: { key: CourseCategory | 'All'; label: string }[] = [
    { key: 'All', label: t.allCategory },
    { key: 'Mining', label: t.miningCategory },
    { key: 'Manufacturing', label: t.mfgCategory },
    { key: 'Emergency', label: t.emergencyCategory }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-left">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {t.coursesTitle}
        </h1>
        <p className="text-sm text-slate-400">
          {t.coursesSubtitle}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        {/* Search Input */}
        <div className="w-full md:w-80">
          <Input
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="min-h-[40px] text-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 hidden sm:flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>{t.categoryLabel}:</span>
          </span>
          {categories.map((cat) => (
            <Button
              key={cat.key}
              variant={selectedCategory === cat.key ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.key)}
              className="text-xs shrink-0"
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<BookOpen className="w-8 h-8" />}
          title={t.noCoursesFound}
          description={`No training courses match "${searchQuery}". Try searching for another topic or resetting filters.`}
          actionLabel={t.resetFilters}
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
          }}
        />
      )}
    </div>
  );
}

export default CoursesPage;
