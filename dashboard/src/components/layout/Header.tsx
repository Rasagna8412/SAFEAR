import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth/AuthContext';
import { useTranslation } from '../../i18n/I18nContext';
import { useTheme } from '../../theme/ThemeContext';
import { SupportedLanguage } from '../../types/i18n';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import {
  ShieldAlert,
  Home,
  BookOpen,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  Languages,
  Sun,
  Moon
} from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  const { language, setLanguage, languages, t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsLogoutModalOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { to: '/home', label: t.navHome, icon: <Home className="w-4 h-4" /> },
    { to: '/courses', label: t.navCourses, icon: <BookOpen className="w-4 h-4" /> },
    { to: '/profile', label: t.navProfile, icon: <UserIcon className="w-4 h-4" /> },
    { to: '/settings', label: t.navSettings, icon: <SettingsIcon className="w-4 h-4" /> }
  ];

  const roleVariant = {
    Worker: 'mining',
    Trainer: 'info',
    Admin: 'warning'
  } as const;

  return (
    <>
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <NavLink to="/home" className="flex items-center gap-2.5 group focus:outline-none">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-md shadow-amber-500/20 group-hover:bg-amber-400 transition-colors">
              <ShieldAlert className="w-5 h-5 text-slate-950" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-black text-lg tracking-tight text-white group-hover:text-amber-400 transition-colors leading-none">
                SafeAR
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase leading-tight">
                Safety Simulator
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-800 text-amber-400 border border-slate-700 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Profile & Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark / Light Theme Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-all"
              aria-label="Toggle Dark / Light Theme"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden lg:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden lg:inline">Dark</span>
                </>
              )}
            </button>

            {/* Quick Language Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-all"
                aria-label="Select Language"
              >
                <Languages className="w-3.5 h-3.5 text-amber-400" />
                <span className="uppercase">{language}</span>
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 animate-in zoom-in-95 duration-100">
                  {languages.map((langOpt) => (
                    <button
                      key={langOpt.code}
                      type="button"
                      onClick={() => {
                        setLanguage(langOpt.code as SupportedLanguage);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                        language === langOpt.code
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{langOpt.nativeLabel}</span>
                      <span className="text-[10px] text-slate-500 font-mono uppercase">{langOpt.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user && (
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xs font-bold text-amber-400">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-200 truncate max-w-[120px]">
                    {user.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <Badge variant={roleVariant[user.role]} size="sm">
                      {user.role}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLogoutModalOpen(true)}
              leftIcon={<LogOut className="w-4 h-4 text-slate-400" />}
              aria-label="Log out"
            >
              {t.navLogout}
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Mobile Lang Button */}
            <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code as SupportedLanguage)}
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    language === l.code ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  {l.code.toUpperCase()}
                </button>
              ))}
            </div>

            {user && (
              <Badge variant={roleVariant[user.role]} size="sm">
                {user.role}
              </Badge>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150 text-left">
            {user && (
              <div className="p-3 mb-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-sm font-bold text-amber-400">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-100">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </div>
            )}
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-amber-400 border border-slate-700'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
            <div className="pt-2 border-t border-slate-800">
              <Button
                variant="danger"
                size="md"
                fullWidth
                leftIcon={<LogOut className="w-4 h-4" />}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsLogoutModalOpen(true);
                }}
              >
                {t.navLogout}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirm Logout"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsLogoutModalOpen(false)}>
              {t.cancel}
            </Button>
            <Button variant="danger" size="sm" onClick={handleLogout}>
              {t.confirm}
            </Button>
          </>
        }
      >
        <p className="text-slate-300">
          Are you sure you want to sign out of SafeAR? You can easily sign back in at any time with demo or registered credentials.
        </p>
      </Modal>
    </>
  );
}
