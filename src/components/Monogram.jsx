// Monograma: una «l» minúscula con una luz a su lado. Jade en internet, ámbar en Cerca.
export default function Monogram({ size = 64, world = 'internet', lightId, title, className, plate = true }) {
  const amber = world === 'cerca';
  const bg = amber ? '#211810' : '#141a21';
  const stem = amber ? '#f3e6d3' : '#e9edf2';
  const light = amber ? '#ffb547' : '#38d6c0';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {plate && <rect width="64" height="64" rx="16" fill={bg} />}
      <rect x="22" y="12" width="10" height="40" rx="5" fill={stem} />
      <circle id={lightId} cx="42" cy="44" r="6" fill={light} />
    </svg>
  );
}
