import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../config/routes.config';
import styles from './Navbar.module.css';

const LINKS = [
  { label: 'Home', to: ROUTES.home },
  { label: 'About Us', to: ROUTES.about },
  { label: 'Products', to: ROUTES.products },
  { label: 'Security Solutions', to: ROUTES.securitySolutions },
  { label: 'Contact Us', to: ROUTES.contact },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <nav className={styles.nav} aria-label="Primary">
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="primary-nav"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={styles.toggleBar} />
        <span className={styles.toggleBar} />
        <span className={styles.toggleBar} />
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
      </button>

      <ul id="primary-nav" className={open ? `${styles.list} ${styles.listOpen}` : styles.list}>
        {LINKS.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.to === ROUTES.home}
              className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
              onClick={closeMenu}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
