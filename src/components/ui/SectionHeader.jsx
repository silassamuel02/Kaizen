export default function SectionHeader({
  eyebrow,
  title,
  description,
}) {

  return (

    <div className="space-y-6">

      {eyebrow && (

        <p
          className="
            uppercase
            tracking-[0.35em]
            text-red-300/70
            text-[10px]
            font-semibold
          "
        >
          {eyebrow}
        </p>

      )}

      <h1
        className="
          text-5xl
          lg:text-6xl
          font-black
          tracking-[-0.05em]
          leading-tight
          max-w-4xl
          text-white
        "
      >
        {title}
      </h1>

      {description && (

        <p
          className="
            text-slate-300
            text-lg
            leading-relaxed
            max-w-3xl
          "
        >
          {description}
        </p>

      )}

    </div>
  );
}