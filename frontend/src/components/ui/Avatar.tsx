import { avatarColor, getInitials } from '../../utils/format';

type Props = {
  name: string;
  size?: 'sm' | 'md';
};

export function Avatar({ name, size = 'sm' }: Props) {
  const sizeClass = size === 'sm' ? 'h-7 w-7 text-xs' : 'h-9 w-9 text-sm';
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-medium text-white ${sizeClass} ${avatarColor(name)}`}
      aria-hidden
    >
      {getInitials(name)}
    </span>
  );
}
