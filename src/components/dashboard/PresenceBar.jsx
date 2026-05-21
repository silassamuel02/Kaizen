export default function PresenceBar() {

  const operators = [
    {
      id: 1,
      name: "Alex",
    },
    {
      id: 2,
      name: "Nova",
    },
    {
      id: 3,
      name: "Kai",
    },
  ];

  return (

    <div
      className="
        flex
        items-center
        gap-4
      "
    >

      <p
        className="
          text-gray-500
          text-sm
        "
      >
        Active Operators
      </p>

      <div className="flex items-center -space-x-3">

        {operators.map((operator) => (

          <div
            key={operator.id}

            title={operator.name}

            className="
              w-10
              h-10
              rounded-full
              border border-black
              bg-red-500/20
              flex
              items-center
              justify-center
              text-sm
              font-bold
              backdrop-blur-xl
            "
          >

            {operator.name[0]}

          </div>

        ))}

      </div>

    </div>
  );
}