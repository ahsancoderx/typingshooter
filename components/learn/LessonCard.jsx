import Link from 'next/link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
export default function LessonCard({ lesson, number, done }) {
  return (
    <Link href={`/learn/${lesson.slug}`} className="lesson-row">
      <span className={done ? 'badge-done' : 'muted'} aria-label={done ? 'Completed' : 'Not completed'}>
        {done ? <CheckCircleIcon fontSize="small" /> : <RadioButtonUncheckedIcon fontSize="small" />}
      </span>
      <span className="lesson-row-text">
        <strong>
          {number}. {lesson.title}
        </strong>
        <span className="muted">{lesson.summary}</span>
      </span>
    </Link>
  );
}
