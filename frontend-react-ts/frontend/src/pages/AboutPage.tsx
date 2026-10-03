import { useEffect, useState } from 'react';
import { PageHero } from '../components/common/PageHero';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { getPageContent } from '../services/pageContentService';
import { Loader } from '../components/common/Loader';
import { ErrorState } from '../components/common/ErrorState';
import styles from './StaticPage.module.css';

export function AboutPage() {
  const { settings } = useSiteSettings();
  const [content, setContent] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getPageContent('about')
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
          eyebrow="About Us"
          title={`Who is ${settings?.siteName ?? ''}`}
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
          eyebrow="About Us"
          title={`Who is ${settings?.siteName ?? ''}`}
          subtitle=""
        />
        <div className={`container-ak ${styles.page}`}>
          <ErrorState message="Couldn't load page content." onRetry={() => window.location.reload()} />
        </div>
      </>
    );
  }

  const heroSubtitle = content['hero_subtitle'];
  const mainDescription = content['main_description'];
  const whatWeDoList = content['what_we_do']
    ? content['what_we_do']
        .split(/\r?\n|\\n/)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
  const whyClientsWorkWithUs = content['why_clients_work_with_us'];

  // Show empty state if no content
  if (!heroSubtitle && !mainDescription && whatWeDoList.length === 0 && !whyClientsWorkWithUs) {
    return (
      <>
        <PageHero
          eyebrow="About Us"
          title={`Who is ${settings?.siteName ?? ''}`}
          subtitle=""
        />
        <div className={`container-ak ${styles.page}`}>
          <p className="text-slate-500">Page content not available.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={`Who is ${settings?.siteName ?? ''}`}
        subtitle={heroSubtitle || ''}
      />
      <div className={`container-ak ${styles.page}`}>
        <div className={styles.content}>
          {mainDescription && <p>{settings?.siteName} {mainDescription}</p>}
          {whatWeDoList.length > 0 && (
            <>
              <h3>What we do</h3>
              <ul>
                {whatWeDoList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}
          {whyClientsWorkWithUs && (
            <>
              <h3>Why clients work with us</h3>
              <p>{whyClientsWorkWithUs}</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
