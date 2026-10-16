'use client';
import Link from 'next/link';
import Button from '@mui/material/Button';
export default function LinkButton({ href, ...props }) {
  return <Button component={Link} href={href} {...props} />;
}
