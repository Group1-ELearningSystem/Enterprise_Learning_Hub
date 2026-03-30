import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import LoadingState from '../components/LoadingState';
import { learnerApi } from '../api/learnerApi';
import { useAsync } from '../hooks/useAsync';

export default function ProfilePage() {
  const profile = useAsync(learnerApi.getProfile);
  const [fullName, setFullName] = useState('');
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    profile.run();
  }, []);

  useEffect(() => {
    if (profile.data?.fullName) setFullName(profile.data.fullName);
  }, [profile.data]);

  const saveProfile = async (e) => {
    e.preventDefault();
    const res = await learnerApi.updateProfile({ fullName });
    setMessage(res.message);
    profile.run();
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const res = await learnerApi.changePassword(passwordForm);
    setMessage(res.message);
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  if (profile.loading && !profile.data) return <LoadingState label="Loading profile..." />;

  return (
    <div className="page-stack">
      <PageHeader title="Profile" subtitle="View and update learner information." />
      {message ? <div className="alert success">{message}</div> : null}
      {profile.error ? <div className="alert error">{profile.error}</div> : null}

      <div className="two-col">
        <section className="card">
          <h3>Account information</h3>
          <div className="info-grid">
            <span><strong>Learner ID:</strong> {profile.data?.learnerId}</span>
            <span><strong>Email:</strong> {profile.data?.email}</span>
            <span><strong>Username:</strong> {profile.data?.username}</span>
            <span><strong>Status:</strong> {profile.data?.status}</span>
            <span><strong>Role:</strong> {profile.data?.role}</span>
            <span><strong>Account Number:</strong> {profile.data?.accountNumber}</span>
          </div>
        </section>

        <form className="card form-card" onSubmit={saveProfile}>
          <h3>Edit profile</h3>
          <label>
            Full name
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </label>
          <button className="primary-btn" type="submit">Save profile</button>
        </form>
      </div>

      <form className="card form-card" onSubmit={changePassword}>
        <h3>Change password</h3>
        <div className="three-col">
          <label>Old password<input type="password" value={passwordForm.oldPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, oldPassword: e.target.value }))} /></label>
          <label>New password<input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))} /></label>
          <label>Confirm password<input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))} /></label>
        </div>
        <button className="primary-btn" type="submit">Update password</button>
      </form>
    </div>
  );
}
