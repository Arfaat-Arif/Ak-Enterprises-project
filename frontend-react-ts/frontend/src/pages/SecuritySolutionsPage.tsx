import { useEffect, useState } from 'react';
import { PageHero } from '../components/common/PageHero';
import { SecurityServiceCard } from '../components/security/SecurityServiceCard';
import { getServices } from '../services/serviceService';
import type { Service } from '../types/service.types';
import styles from './StaticPage.module.css';

export function SecuritySolutionsPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getServices()
      .then((data) => {
        setServices(data);
        setError(null);
      })
      .catch(() => {
        setError('Unable to load security solutions right now.');
        setServices([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Security Solutions"
        title="CCTV & Security Systems"
        subtitle="Complete security systems for government and commercial sites — specified to match your facility and communication setup."
      />
      <div className={`container-ak ${styles.page}`}>
        {loading && <p className="text-sm text-slate-500">Loading security solutions...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && services.length === 0 && (
          <p className="text-sm text-slate-500">No security solutions available.</p>
        )}
        {!loading && !error && services.length > 0 && (
          <div className={styles.serviceGrid}>
            {services.map((service) => {
              const points = service.description
                ? service.description.split('\n').map((point) => point.trim()).filter(Boolean)
                : [];

              return (
                <SecurityServiceCard
                  key={service.id}
                  title={service.name}
                  description={service.shortDescription ?? ''}
                  points={points}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
