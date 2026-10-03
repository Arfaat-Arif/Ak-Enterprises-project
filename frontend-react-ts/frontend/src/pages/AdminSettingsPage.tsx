import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { getAdminSiteSettings, updateAdminSiteSettings, type SiteSettingsForm } from '../services/siteSettingsService';
import { getAdminAccount, updateAdminAccount } from '../services/adminAccountService';
import type { SiteSettings } from '../types/siteSettings.types';
import { getApiErrorMessage } from '../utils/apiError';

function toForm(settings: SiteSettings): SiteSettingsForm {
  return {
    siteName: settings.siteName,
    tagline: settings.tagline ?? '',
    subTagline: settings.subTagline ?? '',
    contactEmail: settings.contactEmail ?? '',
    contactPhone: settings.contactPhone ?? '',
    address: settings.address ?? '',
    businessHours: settings.businessHours ?? '',
  };
}

function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  required,
  visible,
  onToggleVisible,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  required?: boolean;
  visible: boolean;
  onToggleVisible: () => void;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <span className="relative mt-2 block">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          required={required}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-11 font-normal"
        />
        <button
          type="button"
          onClick={onToggleVisible}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-ak-navy-900"
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </span>
    </label>
  );
}

export function AdminSettingsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, clearSession } = useAuth();
  const { refresh } = useSiteSettings();
  const [form, setForm] = useState<SiteSettingsForm | null>(null);
  const [logo, setLogo] = useState<File | undefined>();
  const [favicon, setFavicon] = useState<File | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [accountEmail, setAccountEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [accountMessage, setAccountMessage] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    void Promise.all([getAdminSiteSettings(), getAdminAccount()])
      .then(([settings, account]) => {
        setForm(toForm(settings));
        setAccountEmail(account.email);
      })
      .catch((requestError) => setError(getApiErrorMessage(requestError, 'Unable to load settings.')))
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  function updateField(field: keyof SiteSettingsForm, value: string) {
    setForm((current) => (current ? { ...current, [field]: value } : current));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    setIsSaving(true);
    setMessage(null);
    setError(null);
    try {
      await updateAdminSiteSettings({ ...form, logo, favicon });
      await refresh();
      setLogo(undefined);
      setFavicon(undefined);
      setMessage('Settings saved.');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to save settings.'));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAccountSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingAccount(true);
    setAccountMessage(null);
    setAccountError(null);

    if (!currentPassword.trim()) {
      setAccountError('Current password is required.');
      setIsSavingAccount(false);
      return;
    }

    if (newPassword && newPassword !== confirmNewPassword) {
      setAccountError('New password confirmation does not match.');
      setIsSavingAccount(false);
      return;
    }

    try {
      const payload = {
        currentPassword,
        email: accountEmail.trim() || undefined,
        password: newPassword || undefined,
        passwordConfirmation: confirmNewPassword || undefined,
      };

      const result = await updateAdminAccount(payload);

      if (result.requiresReauth) {
        clearSession();
        navigate('/admin/login', {
          replace: true,
          state: {
            message: result.message || 'Account updated. Please sign in again with your new credentials.',
          },
        });
        return;
      }

      setAccountMessage(result.message || 'Account updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (requestError) {
      setAccountError(getApiErrorMessage(requestError, 'Unable to update account.'));
    } finally {
      setIsSavingAccount(false);
    }
  }

  if (isLoading || !form) return <div className="p-8 text-slate-600">Loading settings...</div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-ak-navy-900">Site Settings</h1>
        <p className="text-slate-500">Manage site configuration</p>
      </div>

      <div className="max-w-3xl space-y-8">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-6 shadow-lg sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ['siteName', 'Site name'],
              ['tagline', 'Tagline'],
              ['subTagline', 'Sub-tagline'],
              ['contactEmail', 'Contact email'],
              ['contactPhone', 'Contact phone'],
              ['businessHours', 'Business hours'],
            ].map(([field, label]) => (
              <label key={field} className="block text-sm font-semibold text-slate-700">
                {label}
                <input
                  value={form[field as keyof SiteSettingsForm] as string}
                  onChange={(event) => updateField(field as keyof SiteSettingsForm, event.target.value)}
                  type={field === 'contactEmail' ? 'email' : 'text'}
                  required={field === 'siteName'}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 font-normal"
                />
              </label>
            ))}
          </div>
          <label className="block text-sm font-semibold text-slate-700">
            Address
            <textarea
              value={form.address}
              onChange={(event) => updateField('address', event.target.value)}
              rows={3}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 font-normal"
            />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700">
              Logo
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setLogo(event.target.files?.[0])}
                className="mt-2 block w-full text-sm font-normal"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Favicon
              <input
                type="file"
                accept=".ico,.png,.jpg,.jpeg,.webp,.svg"
                onChange={(event) => setFavicon(event.target.files?.[0])}
                className="mt-2 block w-full text-sm font-normal"
              />
            </label>
          </div>
          {message && <p className="text-sm text-emerald-700">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-ak-blue px-5 py-3 font-bold text-white disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Save settings'}
          </button>
        </form>

        <form onSubmit={handleAccountSubmit} className="space-y-6 rounded-xl bg-white p-6 shadow-lg sm:p-8" noValidate>
          <div>
            <h2 className="font-display text-xl font-bold text-ak-navy-900">Admin Account</h2>
            <p className="mt-1 text-sm text-slate-500">
              Update your login email and/or password. Current password is required. You will be asked to sign in again after a successful change.
            </p>
          </div>

          <PasswordField
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
            autoComplete="current-password"
            required
            visible={showCurrentPassword}
            onToggleVisible={() => setShowCurrentPassword((value) => !value)}
          />

          <label className="block text-sm font-semibold text-slate-700">
            New email
            <input
              value={accountEmail}
              onChange={(event) => setAccountEmail(event.target.value)}
              type="email"
              autoComplete="username"
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 font-normal"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <PasswordField
              label="New password"
              value={newPassword}
              onChange={setNewPassword}
              autoComplete="new-password"
              visible={showNewPassword}
              onToggleVisible={() => setShowNewPassword((value) => !value)}
            />
            <PasswordField
              label="Confirm new password"
              value={confirmNewPassword}
              onChange={setConfirmNewPassword}
              autoComplete="new-password"
              visible={showConfirmPassword}
              onToggleVisible={() => setShowConfirmPassword((value) => !value)}
            />
          </div>

          {accountMessage && <p className="text-sm text-emerald-700">{accountMessage}</p>}
          {accountError && (
            <p className="text-sm text-red-600" role="alert">
              {accountError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSavingAccount}
            className="rounded-lg bg-ak-blue px-5 py-3 font-bold text-white disabled:opacity-60"
          >
            {isSavingAccount ? 'Updating account...' : 'Update account'}
          </button>
        </form>
      </div>
    </div>
  );
}
