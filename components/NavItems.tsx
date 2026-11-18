'use client';

import { cn } from "cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Companions", href: "/companions" },
  { label: "My Journey", href: "/my-journey" },
];

const NavItems = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-3">
        {navItems.map(({ label, href }) => (
            <Link
                href={href}
                key={label}
                className={cn(
                    "nav-item transition-colors",
                    pathname === href && "font-bold text-[#fe5933]"
                )}
            >
                {label}
            </Link>
        ))}
    </nav>
  )
}

export default NavItems