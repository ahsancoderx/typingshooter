export default function PageContainer({ children, className = '', as: Tag = 'div' }) {
  return <Tag className={`container ${className}`}>{children}</Tag>;
}
