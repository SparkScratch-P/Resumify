import React from 'react';
import { Card } from '../components/ui/Card';
import { Settings } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>
          <p className="text-gray-600">
            Manage your account preferences and settings here.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Notification Preferences</h2>
          <p className="text-gray-600">
            Configure how and when you receive notifications.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Privacy & Security</h2>
          <p className="text-gray-600">
            Review and update your privacy and security settings.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;