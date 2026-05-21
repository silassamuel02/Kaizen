export default function WorkspaceMembers({
  members = [],
}) {
  return (
    <div className="flex items-center -space-x-2">
      {members.map((member, index) => (
        <div
          key={index}
          className="
            w-9
            h-9
            rounded-full
            border border-border
            bg-accent-soft
            text-accent
            flex
            items-center
            justify-center
            text-xs
            font-bold
          "
        >
          {member.name[0]?.toUpperCase()}
        </div>
      ))}
    </div>
  );
}