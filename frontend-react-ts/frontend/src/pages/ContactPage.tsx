import { useEffect, useState } from 'react';
import { PageHero } from '../components/common/PageHero';
import { ContactForm } from '../components/forms/ContactForm';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { getPageContent } from '../services/pageContentService';
import { Loader } from '../components/common/Loader';
import { ErrorState } from '../components/common/ErrorState';
import styles from './StaticPage.module.css';

export function ContactPage() {
  const { settings } = useSiteSettings();
  const [content, setContent] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getPageContent('contact')
      .then((data) => {
        setContent(data);
        setError(null);
      })
      .catch(() => {
        setError('Unable to load page content.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <>
        <PageHero
          eyebrow="Get in touch"
          title="Contact Us"
          subtitle=""
        />
        <div className={`container-ak ${styles.page}`}>
          <Loader label="Loading page content..." />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHero
          eyebrow="Get in touch"
          title="Contact Us"
          subtitle=""
        />
        <div className={`container-ak ${styles.page}`}>
          <ErrorState message="Couldn't load page content." onRetry={() => window.location.reload()} />
        </div>
      </>
    );
  }

  const heroSubtitle = content['hero_subtitle'];
  const procurementInstructions = content['procurement_instructions'];

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Contact Us"
        subtitle={heroSubtitle || ''}
      />
      <div className={`container-ak ${styles.page}`}>
        <div className={styles.twoCol}>
          <ContactForm />
          <aside className={styles.infoCard}>
            <h3>Direct contact</h3>
            <p>
              {settings?.contactPhone && <a href={`tel:${settings.contactPhone.replace(/\s/g, '')}`}>{settings.contactPhone}</a>}
              <br />
              {settings?.contactEmail && <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>}
            </p>
            {settings?.address && <><h3>Address</h3><p>{settings.address}</p></>}
            {procurementInstructions && (
              <>
                <h3>For government procurement</h3>
                <p>{procurementInstructions}</p>
              </>
            )}
            <h3>Business hours</h3>
            <p>{settings?.businessHours}</p>
          </aside>
        </div>
      </div>
    </>
  );
}
