import { PageHero } from '../components/common/PageHero';
import { ContactForm } from '../components/forms/ContactForm';
import { useSiteSettings } from '../context/SiteSettingsContext';
import styles from './StaticPage.module.css';

export function ContactPage() {
  const { settings } = useSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Contact Us"
        subtitle="Request a quote, ask about government procurement, or reach our sales team directly."
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
            <h3>For government procurement</h3>
            <p>
              Include your tender/RFQ reference number in the message field and our government-sales team will
              respond with formal documentation.
            </p>
            <h3>Business hours</h3>
            <p>{settings?.businessHours}</p>
          </aside>
        </div>
      </div>
    </>
  );
}
