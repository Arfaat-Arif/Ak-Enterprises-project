import { useState, type FormEvent } from 'react';
import { subscribeToNewsletter } from '../../services/newsletterService';
import { isValidEmail } from '../../utils/validators';
import styles from './NewsletterForm.module.css';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus('error');
      setErrorMessage('Enter a valid email address.');
      return;
    }
    setStatus('submitting');
    try {
      await subscribeToNewsletter({ email });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setErrorMessage('Could not subscribe right now. Please try again.');
    }
  }

  if (status === 'success') {
    return <p className={styles.success}>You're subscribed. Thanks for joining.</p>;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <label htmlFor="newsletter-email" className={styles.visuallyHidden}>
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
        required
      />
      <button type="submit" className={styles.button} disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
      </button>
      {status === 'error' && <p className={styles.error}>{errorMessage}</p>}
    </form>
  );
}
