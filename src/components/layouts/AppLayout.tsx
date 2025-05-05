import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  FileText, 
  LayoutDashboard, 
  Settings, 
  FilePlus, 
  LogOut,
  FileSpreadsheet,
  Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';
import useResumeStore from '../../store/resumeStore';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const { resumes, currentResumeId } = useResumeStore();
  const isActive = (path: string) => location.pathname.startsWith(path);

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: 'Resumes',
      path: '/resumes',
      icon: <FileText size={18} />,
    },
    {
      name: 'ATS Optimization',
      path: '/ats',
      icon: <FileSpreadsheet size={18} />,
    },
    {
      name: 'AI Assistant',
      path: '/assistant',
      icon: <Sparkles size={18} />,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <Settings size={18} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/dashboard" className="flex items-center">
                  <FileText className="h-8 w-8 text-primary-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">ResumeAI</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <span className="sr-only">Account</span>
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-semibold">
                  U
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200">
          <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex-1 px-4 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md',
                    isActive(item.path)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  )}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  <span
                    className={cn(
                      'mr-3',
                      isActive(item.path) ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-600'
                    )}
                  >
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Recent Documents */}
            <div className="mt-6 px-4">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Recent Resumes
              </h3>
              <div className="mt-2 space-y-1">
                {resumes.slice(0, 3).map((resume) => (
                  <Link
                    key={resume.id}
                    to={`/resume/${resume.id}`}
                    className={cn(
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-md truncate',
                      currentResumeId === resume.id
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    )}
                  >
                    <FileText
                      size={16}
                      className={cn(
                        'mr-3 flex-shrink-0',
                        currentResumeId === resume.id
                          ? 'text-primary-600'
                          : 'text-gray-500 group-hover:text-gray-600'
                      )}
                    />
                    {resume.personalInfo.firstName
                      ? `${resume.personalInfo.firstName} ${resume.personalInfo.lastName}'s Resume`
                      : 'Untitled Resume'}
                  </Link>
                ))}
              </div>
            </div>

            {/* New Resume Button */}
            <div className="px-4 mt-3">
              <Link
                to="/resume/new"
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FilePlus size={16} className="mr-2" />
                New Resume
              </Link>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <button className="text-gray-700 group-hover:text-gray-900 flex items-center text-sm font-medium">
                  <LogOut size={16} className="mr-3 text-gray-500 group-hover:text-gray-600" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;