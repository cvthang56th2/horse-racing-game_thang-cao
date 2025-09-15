// UI Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'ghost' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  tag?: 'button' | 'a' | 'router-link'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  rounded?: boolean
  fullWidth?: boolean
}
