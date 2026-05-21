import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import {
  Bell,
  Search,
  Command,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../contexts/AuthContext";

import NotificationCenter from "../components/ui/NotificationCenter";

import CommandPalette from "../components/ui/CommandPalette";

import NotificationDrawer from "../components/ui/NotificationDrawer";

import ThemeToggle from "../components/ui/ThemeToggle";

export default function AppShell({
  children,
  title,
}) {

  const { signOut } = useAuth();

  const navigate = useNavigate();

  const [
    openSearch,
    setOpenSearch,
  ] = useState(false);

  const [
    openNotifications,
    setOpenNotifications,
  ] = useState(false);

  async function handleLogout() {

    await signOut();

    navigate("/login");
  }

  return (

    <div
      className="
        min-h-screen

        bg-[#f8fafc]
        dark:bg-[#09090b]

        text-slate-900
        dark:text-white

        flex

        transition-colors
        duration-300
      "
    >

      {/* Main */}

      <main className="flex-1">

        {/* Topbar */}

        <header
          className="sticky top-0 z-40 flex items-center justify-between h-20 px-6 border-b  lg:px-8 xl:px-10 border-black/5 dark:border-white/10 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl"
        >

          {/* Left */}

          <div>

            <p
              className="
                uppercase
                tracking-[0.35em]

                text-[10px]

                mb-1

                font-semibold

                text-slate-500
              "
            >
              Operational Workspace
            </p>

            <h2
              className="text-2xl font-bold tracking-tight  text-slate-900 dark:text-white"
            >
              {title}
            </h2>

          </div>

          {/* Right */}

          <div
            className="flex items-center gap-3 "
          >

            {/* Search */}

            <div

              onClick={() =>
                setOpenSearch(true)
              }

              className="
                hidden
                lg:flex

                items-center
                gap-3

                px-5

                h-11

                min-w-[250px]

                rounded-2xl

                border

                border-black/5
                dark:border-white/10

                bg-black/[0.03]
                dark:bg-white/[0.03]

                text-slate-500

                cursor-pointer

                hover:bg-black/[0.05]
                dark:hover:bg-white/[0.05]

                transition-all
                duration-300
              "
            >

              <Search size={16} />

              <Command
                size={16}
                className=" opacity-60"
              />

              <span
                className="text-sm "
              >
                Search operations...
              </span>

            </div>

            {/* Systems Status */}

            <div
              className="
                hidden
                md:flex

                items-center
                gap-3

                px-4

                h-11

                rounded-2xl

                border

                border-black/5
                dark:border-white/10

                bg-black/[0.03]
                dark:bg-white/[0.03]
              "
            >

              <div
                className="relative flex items-center justify-center "
              >

                <div
                  className="absolute w-5 h-5 rounded-full  bg-green-400/20 blur-md"
                />

                <Sparkles
                  size={16}
                  className="relative text-green-500  dark:text-green-400"
                />

              </div>

              <span
                className="text-sm font-medium  text-slate-700 dark:text-slate-300"
              >
                Systems Online
              </span>

            </div>

            {/* Theme Toggle */}

            <ThemeToggle />

            {/* Notifications */}

            <button

              onClick={() =>
                setOpenNotifications(true)
              }

              className="
                relative

                w-11
                h-11

                rounded-2xl

                border

                border-black/5
                dark:border-white/10

                bg-black/[0.03]
                dark:bg-white/[0.03]

                flex
                items-center
                justify-center

                hover:bg-black/[0.05]
                dark:hover:bg-white/[0.05]

                transition-all
                duration-300
              "
            >

              <Bell size={18} />

              <div
                className="absolute w-2 h-2 bg-red-400 rounded-full  top-3 right-3"
              />

            </button>

            {/* User Capsule */}

            <div
              className="
                flex
                items-center
                gap-3

                px-4

                h-11

                rounded-2xl

                border

                border-black/5
                dark:border-white/10

                bg-black/[0.03]
                dark:bg-white/[0.03]
              "
            >

              <div
                className="w-8 h-8 rounded-full  bg-gradient-to-br from-slate-800 to-slate-600 dark:from-red-500 dark:to-purple-500"
              />

              <div className="hidden lg:block">

                <p
                  className="text-sm font-semibold  text-slate-900 dark:text-white"
                >
                  Operator
                </p>

                <p
                  className="
                    text-[11px]

                    text-slate-500
                  "
                >
                  System Access
                </p>

              </div>

            </div>

            {/* Logout */}

            <button

              onClick={handleLogout}

              className="px-5 text-sm font-medium text-red-500 transition-all duration-300 border  h-11 rounded-2xl border-red-500/20 bg-red-500/10 dark:text-red-300 hover:bg-red-500/20"
            >
              Logout
            </button>

          </div>

        </header>

        {/* Content */}

        <motion.section

          initial={{
            opacity: 0,
            y: 10,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.4,
            ease: "easeOut",
          }}

          className="px-6 py-6 overflow-x-hidden  lg:px-8 lg:py-6 xl:px-10"
        >

          <NotificationCenter />

          {children}

        </motion.section>

        {/* Search */}

        <CommandPalette
          open={openSearch}
          setOpen={setOpenSearch}
        />

        {/* Notifications */}

        <NotificationDrawer
          open={openNotifications}
          setOpen={setOpenNotifications}
        />

      </main>

    </div>
  );
}