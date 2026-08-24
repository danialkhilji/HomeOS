interface MemberDotProps {
  avatarUrl: string | null;
  colour: string;
  name: string;
  size?: number;
}

export default function MemberDot({ avatarUrl, colour, name, size = 12 }: MemberDotProps) {
  const px = `${size / 4}rem`;

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="rounded-full shrink-0 object-cover"
        style={{ width: px, height: px }}
      />
    );
  }

  return (
    <div
      className="rounded-full shrink-0"
      style={{ backgroundColor: colour, width: px, height: px }}
    />
  );
}