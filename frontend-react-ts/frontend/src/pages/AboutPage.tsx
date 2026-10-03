import { PageHero } from '../components/common/PageHero';
import { useSiteSettings } from '../context/SiteSettingsContext';
import styles from './StaticPage.module.css';

export function AboutPage() {
  const { settings } = useSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={`Who is ${settings?.siteName ?? ''}`}
        subtitle="Government contractor and general order supplier for telecom and security equipment."
      />
      <div className={`container-ak ${styles.page}`}>
        <div className={styles.content}>
          <p>
            {settings?.siteName} supplies telecom equipment, CCTV security systems, and general order items to
            government departments and enterprise clients. As a registered government contractor and general order
            supplier, we source directly from leading manufacturers — Motorola, Hytera, ICOM, and Baofeng — and
            support every deployment from procurement through after-sales service.
          </p>
          <h3>What we do</h3>
          <ul>
            <li>Two-way radio supply: handheld, base/vehicle-mounted, and repeater systems</li>
            <li>CCTV and access-control security system design and supply</li>
            <li>Government tender and procurement fulfilment</li>
            <li>Warranty support and spare-parts sourcing</li>
          </ul>
          <h3>Why clients work with us</h3>
          <p>
            Every product we list is verified against manufacturer spec sheets before it reaches this catalog, and
            our quote process is built for procurement teams that need documentation, not just a price.
          </p>
        </div>
      </div>
    </>
  );
}
