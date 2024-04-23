function Avatar({
  name,
  size = 20,
  avatarURL,
}: {
  name: string;
  size?: number;
  avatarURL?: string;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
      }}
      className="relative rounded-full bg-green-700 dark:bg-slate-400"
    >
      {avatarURL && (
        <img
          alt={name}
          width={size}
          height={size}
          src={avatarURL}
          className="rounded-ful absolute z-10"
          onError={(event) =>
            ((event.target as HTMLImageElement).style.display = 'none')
          }
        />
      )}
      <p
        className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 transform select-none font-semibold text-gray-300 dark:text-white"
        style={{ fontSize: size / 2 }}
      >
        {name[0].toUpperCase()}
      </p>
    </div>
  );
}

export default Avatar;
