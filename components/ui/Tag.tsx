type TagVariant = 'default' | 'accent' | 'free' | 'paid' | 'blue' | 'sage'

interface TagProps {
  variant?: TagVariant
  children: React.ReactNode
}

export function Tag({ variant = 'default', children }: TagProps) {
  return <span className={`tag tag-${variant}`}>{children}</span>
}
