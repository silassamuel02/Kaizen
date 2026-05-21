export default function SystemStatus() {

  const systems = [
    {
      label: "Realtime Sync",
      status: "Active",
      color: "bg-green-400",
    },
    {
      label: "AI Environment",
      status: "Operational",
      color: "bg-green-400",
    },
    {
      label: "Neural Layer",
      status: "Preparing",
      color: "bg-yellow-400",
    },
    {
      label: "Workspace Stability",
      status: "Stable",
      color: "bg-green-400",
    },
  ];

  return (

    <div
      className="
        p-8
        rounded-3xl
        border border-white/5
        bg-white/[0.02]
        space-y-8
        relative
        overflow-hidden
      "
    >

      <div
        className="
          absolute
          top-0
          right-0
          w-40
          h-40
          bg-red-500/[0.04]
          blur-3xl
        "
      ></div>

      <div className="relative z-10">

        <div className="mb-10">

          <p
            className="
              uppercase
              tracking-[0.35em]
              text-red-300/60
              text-[10px]
              mb-4
            "
          >
            Environment Status
          </p>

          <h2
            className="
              text-4xl
              font-black
              tracking-[-0.05em]
            "
          >
            Operational Stability
          </h2>

        </div>

        <div className="space-y-6">

          {systems.map((system) => (

            <div
              key={system.label}

              className="
                flex
                items-center
                justify-between
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >

                <div
                  className={`
                    w-3
                    h-3
                    rounded-full
                    ${system.color}
                  `}
                ></div>

                <p className="text-gray-300">
                  {system.label}
                </p>

              </div>

              <p className="text-gray-500">
                {system.status}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}