import React, { useState } from 'react'
import SectionCard from '../components/SectionCard'
import ToggleSwitch from '../components/ToggleSwitch'

import '../styles/account-settings.css'
import '../styles/toggle-switch.css'

function AccountSettings() {
  const [fullName, setFullName] = useState('Sarah Chen')
  const [email, setEmail] = useState('sarah.chen@example.com')
  const [phone, setPhone] = useState('+1 (987) 654-3210')
  const [plan, setPlan] = useState('Premium Plan')

  const [shareFeedback, setShareFeedback] = useState(true)
  const [profileVisibility, setProfileVisibility] = useState('Network')
  const [retention, setRetention] = useState('6 Months')

  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)
  const [inAppAlerts, setInAppAlerts] = useState(true)

  const [twoFactor, setTwoFactor] = useState(true)
  const [securityQuestions, setSecurityQuestions] = useState(false)

  return (
    <div className="settings-wrapper">
      <header className="page-header">
        <div>
          <h1 className="page-title">Account Settings</h1>
          <p className="page-subtitle">Manage your profile, preferences, and security settings.</p>
        </div>
      </header>

      <SectionCard title="Profile Information">
        <div className="grid-2">
          <div className="form-field">
            <label>Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Membership Plan</label>
            <input type="text" value={plan} onChange={(e) => setPlan(e.target.value)} />
          </div>
        </div>
        <div className="actions-right">
          <button className="btn btn-primary">Save Profile Changes</button>
        </div>
      </SectionCard>

      <SectionCard title="Privacy Controls" subtitle="Manage your data and how others see your information.">
        <div className="stack">
          <ToggleSwitch
            id="share-feedback"
            label="Share Feedback with Landmark"
            helperText="Share anonymous product insights with product@landmark."
            checked={shareFeedback}
            onChange={setShareFeedback}
          />

          <div className="control-row">
            <div className="control-meta">
              <div className="control-label">Profile Visibility</div>
              <div className="control-helper">Control if your profile is publicly visible to others.</div>
            </div>
            <select className="select" value={profileVisibility} onChange={(e) => setProfileVisibility(e.target.value)}>
              <option>Private</option>
              <option>Network</option>
              <option>Public</option>
            </select>
          </div>

          <div className="control-row">
            <div className="control-meta">
              <div className="control-label">Data Retention Policy</div>
              <div className="control-helper">Choose how long we keep your data.</div>
            </div>
            <select className="select" value={retention} onChange={(e) => setRetention(e.target.value)}>
              <option>1 Month</option>
              <option>3 Months</option>
              <option>6 Months</option>
              <option>12 Months</option>
              <option>Forever</option>
            </select>
          </div>

          <div className="actions-between">
            <button className="btn btn-ghost">Reset Privacy Settings</button>
            <button className="btn btn-primary">Save Privacy Settings</button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Notification Preferences">
        <div className="stack">
          <ToggleSwitch id="email-alerts" label="Email Alerts" checked={emailAlerts} onChange={setEmailAlerts} />
          <ToggleSwitch id="sms-alerts" label="SMS Alerts" checked={smsAlerts} onChange={setSmsAlerts} />
          <ToggleSwitch id="inapp-alerts" label="In-App Notifications" checked={inAppAlerts} onChange={setInAppAlerts} />
          <div className="actions-right">
            <button className="btn btn-primary">Save Notification Settings</button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Linked Accounts">
        <div className="stack">
          <div className="control-row">
            <div className="control-meta">
              <div className="control-label">Social Media Accounts</div>
              <div className="control-helper">Connect your social accounts to share updates.</div>
            </div>
            <button className="btn">Connect</button>
          </div>
          <div className="control-row">
            <div className="control-meta">
              <div className="control-label">Third-Party Integrations</div>
              <div className="control-helper">Manage connected apps (e.g., storage, calendar).</div>
            </div>
            <button className="btn">Manage Integrations</button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Security Settings">
        <div className="stack">
          <div className="control-row">
            <div className="control-meta">
              <div className="control-label">Change Password</div>
              <div className="control-helper">Choose a strong, unique password.</div>
            </div>
            <button className="btn">Change Password</button>
          </div>
          <ToggleSwitch id="two-factor" label="Two-Factor Authentication (2FA)" checked={twoFactor} onChange={setTwoFactor} />
          <ToggleSwitch id="security-questions" label="Security Questions" checked={securityQuestions} onChange={setSecurityQuestions} />
        </div>
      </SectionCard>

      <SectionCard title="Danger Zone">
        <div className="stack">
          <div className="control-row">
            <div className="control-meta">
              <div className="control-label">Delete Account</div>
              <div className="control-helper">Permanently remove your account and all associated data.</div>
            </div>
            <button className="btn btn-danger">Delete Account</button>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

export default AccountSettings

