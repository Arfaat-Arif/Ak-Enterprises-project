import { useState, type FormEvent } from 'react';
import { submitInquiry } from '../../services/contactService';
import { validateContactForm, type ContactFormValues, type ContactFormErrors } from '../../utils/validators';
import { Button } from '../common/Button';
import styles from './ContactForm.module.css';

const INITIAL_VALUES: ContactFormValues = { name: '', email: '', phone: '', company: '', message: '' };

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<Status>('idle');

  function handleChange(field: keyof ContactFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validateContactForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus('submitting');
    try {
      await submitInquiry({
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        company: values.company || undefined,
        message: values.message,
      });
      setStatus('success');
      setValues(INITIAL_VALUES);
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.success} role="status">
        <h3>Message sent.</h3>
        <p>Thanks for reaching out — our team will get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="name">Name *</label>
          <input id="name" value={values.name} onChange={(e) => handleChange('name', e.target.value)} />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>
        <div className={styles.field}>
          <label htmlFor="email">Email *</label>
          <input id="email" type="email" value={values.email} onChange={(e) => handleChange('email', e.target.value)} />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="phone">Phone</label>
          <input id="phone" value={values.phone} onChange={(e) => handleChange('phone', e.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="company">Company / Department</label>
          <input id="company" value={values.company} onChange={(e) => handleChange('company', e.target.value)} />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="message">Message *</label>
        <textarea
          id="message"
          rows={5}
          value={values.message}
          onChange={(e) => handleChange('message', e.target.value)}
        />
        {errors.message && <span className={styles.error}>{errors.message}</span>}
      </div>

      {status === 'error' && (
        <p className={styles.error}>Couldn't send your message. Please try again.</p>
      )}

      <Button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send Message'}
      </Button>
    </form>
  );
}
