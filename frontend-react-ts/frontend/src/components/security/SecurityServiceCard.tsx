import styles from './SecurityServiceCard.module.css';

interface SecurityServiceCardProps {
  title: string;
  description: string;
  points: string[];
}

export function SecurityServiceCard({ title, description, points }: SecurityServiceCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{description}</p>
      <ul className={styles.points}>
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </div>
  );
}
