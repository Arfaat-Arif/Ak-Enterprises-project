import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import { ROUTES } from '../../config/routes.config';
import { useSiteSettings } from '../../context/SiteSettingsContext';

const COLUMNS = [
  {
    heading: 'Products',
    links: [
      { label: 'Handheld Radios', to: `${ROUTES.products}?category=hand-held-radios` },
      { label: 'Base Stations', to: `${ROUTES.products}?category=base-vehicle-stations` },
      { label: 'CCTV Systems', to: ROUTES.securitySolutions },
      { label: 'Repeaters', to: ROUTES.products },
      { label: 'Accessories', to: ROUTES.products },
    ],
  },
  {
    heading: 'Industries',
    links: [
      { label: 'Public Safety', to: ROUTES.securitySolutions },
      { label: 'Energy & Utilities', to: ROUTES.securitySolutions },
      { label: 'Manufacturing', to: ROUTES.securitySolutions },
      { label: 'Transport & Logistics', to: ROUTES.securitySolutions },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', to: ROUTES.about },
      { label: 'Request a Quote', to: ROUTES.contact },
      { label: 'Government Tenders', to: ROUTES.contact },
      { label: 'Warranty & Support', to: ROUTES.contact },
      { label: 'Resources & Insights', to: ROUTES.about },
    ],
  },
];

const BRANDS = ['Motorola', 'Hytera', 'ICOM', 'Baofeng', 'Hikvision', 'Dahua'];

export function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="relative bg-ak-navy-950 border-t border-white/5 overflow-hidden">
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />

      {/* Glow accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-ak-blue/40 to-transparent" />

      {/* Main grid */}
      <div className="container-ak relative z-10 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to={ROUTES.home} className="inline-flex items-center gap-3 mb-5 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-ak-blue shadow-glow-blue-sm">
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.siteName} className="h-full w-full rounded-lg object-contain" />
                ) : (
                  <span className="font-display font-bold text-white text-base">{settings?.siteName?.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <span className="font-display font-bold text-white text-xl">{settings?.siteName}</span>
            </Link>
            {settings?.tagline && <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-6">{settings.tagline}</p>}

            {/* Contact info */}
            <div className="flex flex-col gap-3 text-sm">
              {settings?.contactPhone && <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-2.5 text-slate-400 hover:text-ak-blue transition-colors">
                <Phone size={14} className="text-ak-blue flex-shrink-0" />
                {settings.contactPhone}
              </a>}
              {settings?.contactEmail && <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-2.5 text-slate-400 hover:text-ak-blue transition-colors">
                <Mail size={14} className="text-ak-blue flex-shrink-0" />
                {settings.contactEmail}
              </a>}
              {settings?.address && <div className="flex items-start gap-2.5 text-slate-400">
                <MapPin size={14} className="text-ak-blue flex-shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>}
              {settings?.businessHours && <div className="text-slate-400">{settings.businessHours}</div>}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="font-display font-bold text-white text-sm uppercase tracking-widest mb-4">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="group flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors duration-150"
                    >
                      <ChevronRight
                        size={12}
                        className="text-ak-blue opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150"
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Brands row */}
        <div className="border-t border-white/5 pt-8 mb-8">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-4">Authorized Brands</p>
          <div className="flex flex-wrap gap-2">
            {BRANDS.map((brand) => (
              <span key={brand} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs font-display font-bold uppercase tracking-wider text-slate-300">
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} {settings?.siteName}. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Govt. Contractor · General Order Supplier
          </span>
        </div>
      </div>
    </footer>
  );
}
