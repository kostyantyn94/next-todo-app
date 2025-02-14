import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function HeaderLogo() {
    return (
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground hover:text-green-500 transition-all">
            <ClipboardDocumentCheckIcon className="w-7 h-7 text-green-500 animate-pulse" />
            ToDo App
        </Link>
    );
}
