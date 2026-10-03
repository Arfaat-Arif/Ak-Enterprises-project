import { useState, type FormEvent } from 'react';
import { submitInquiry } from '../../services/contactService';
import { isValidEmail, isRequired } from '../../utils/validators';
import { Button } from '../common/Button';
import styles from './QuoteRequestForm.module.css';

interface QuoteRequestFormProps {
  productId: number;
  productName: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function QuoteRequestForm({ productId, productName }: QuoteRequestFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(`I'd like a quote for the ${productName}.`);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isRequired(name) || !isValidEmail(email) || !isRequired(message)) {
      setError('Please fill in your name, a valid email, and a message.');
      return;
    }
    setError('');
    setStatus('submitting');
    try {
      await submitInquiry({ productId, name, email, message });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return <p className={styles.success}>Quote request sent — we'll follow up by email shortly.</p>;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h3 className={styles.heading}>Request a Quote</h3>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={styles.input}
      />
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
      />
      <textarea
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className={styles.textarea}
      />
      {error && <p className={styles.error}>{error}</p>}
      {status === 'error' && <p className={styles.error}>Couldn't send request. Please try again.</p>}
      <Button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Request Quote'}
      </Button>
    </form>
  );
}
