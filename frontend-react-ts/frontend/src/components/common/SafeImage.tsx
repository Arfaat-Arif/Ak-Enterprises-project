import { useState, type ImgHTMLAttributes } from 'react';

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackClassName?: string;
}

/** Renders an image with optional fallback src or styled placeholder on load failure. */
export function SafeImage({
  src,
  alt,
  className,
  fallbackSrc,
  fallbackClassName,
  ...rest
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);

  const activeSrc = failed && fallbackSrc && !fallbackFailed ? fallbackSrc : src;

  if (!activeSrc || (failed && (!fallbackSrc || fallbackFailed))) {
    return <div className={fallbackClassName} role={alt ? 'img' : undefined} aria-label={alt || undefined} />;
  }

  return (
    <img
      src={activeSrc}
      alt={alt ?? ''}
      className={className}
      onError={() => {
        if (!failed && fallbackSrc) setFailed(true);
        else setFallbackFailed(true);
      }}
      loading="lazy"
      {...rest}
    />
  );
}
