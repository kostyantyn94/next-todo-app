import { CheckCircleIcon } from "@heroicons/react/24/solid"; // Иконка для ToDo
import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";

export default function Header() {
    return (
        <div className="flex flex-col gap-12 items-center">
            {/* Логотипы Supabase & Next.js */}
            <div className="flex gap-6 justify-center items-center">
                <a
                    href="https://supabase.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:scale-105 transition-transform"
                >
                    <SupabaseLogo />
                </a>
                <span className="border-l rotate-45 h-6" />
                <a
                    href="https://nextjs.org/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:scale-105 transition-transform"
                >
                    <NextLogo />
                </a>
            </div>

            {/* Заголовок с иконкой ToDo */}
            <h1 className="text-4xl lg:text-5xl font-bold flex items-center gap-3">
                <CheckCircleIcon className="w-10 h-10 text-green-500" />
                Your Ultimate <span className="text-green-500">ToDo</span> App
            </h1>

            {/* Описание */}
            <p className="text-lg lg:text-xl text-center max-w-2xl text-muted-foreground">
                Manage your tasks efficiently with{" "}
                <a
                    href="https://supabase.com/"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                >
                    Supabase
                </a>{" "}
                and{" "}
                <a
                    href="https://nextjs.org/"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                >
                    Next.js
                </a>
                . Keep your productivity at 💯!
            </p>

            {/* Анимированная линия */}
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse my-6" />
        </div>
    );
}
