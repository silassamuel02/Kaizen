import {

  Dialog,
  DialogContent,

} from "@/components/ui/dialog";

import {
  Search,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

const pages = [

  {
    name: "Dashboard",
    path: "/",
  },

  {
    name: "Workspace",
    path: "/workspace",
  },

  {
    name: "Notes",
    path: "/notes",
  },

  {
    name: "AI Insights",
    path: "/ai",
  },

  {
    name: "Activity",
    path: "/activity",
  },

  {
    name: "Settings",
    path: "/settings",
  },

];

export default function CommandPalette({

  open,
  setOpen,

}) {

  const navigate =
    useNavigate();

  return (

    <Dialog
      open={open}
      onOpenChange={setOpen}
    >

      <DialogContent
        className="
          border-white/10
          bg-[#09090f]
          text-white
          max-w-2xl
          rounded-3xl
          p-0
          overflow-hidden
        "
      >

        <div
          className="flex items-center gap-3 px-6 py-5 border-b  border-white/10"
        >

          <Search
            size={18}
            className=" text-slate-500"
          />

          <input
            autoFocus

            placeholder="
              Search operations...
            "

            className="w-full text-white bg-transparent outline-none  placeholder:text-slate-500"
          />

        </div>

        <div className="p-3">

          {pages.map((page) => (

            <button
              key={page.path}

              onClick={() => {

                navigate(page.path);

                setOpen(false);

              }}

              className="
                w-full
                flex
                items-center
                justify-between
                px-4
                py-4
                rounded-2xl
                hover:bg-white/[0.05]
                transition-all
                duration-300
                text-left
              "
            >

              <span
                className="font-medium "
              >
                {page.name}
              </span>

              <span
                className="text-xs  text-slate-500"
              >
                Open
              </span>

            </button>

          ))}

        </div>

      </DialogContent>

    </Dialog>
  );
}