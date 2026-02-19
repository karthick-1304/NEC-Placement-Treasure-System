export default function Spinner({ size = 'md', color = 'primary' }) {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  const colorMap = {
    primary: 'border-primary-600 border-t-primary-300',
    white:   'border-white/20 border-t-white',
    accent:  'border-accent-600 border-t-accent-300',
  };
  return (
    <div className={`${sizeMap[size]} border-2 ${colorMap[color]} rounded-full animate-spin`} />
  );
}