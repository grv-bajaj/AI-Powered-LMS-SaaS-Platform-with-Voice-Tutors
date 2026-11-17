import Image from "next/image";
import Link from "next/link";
import NavItems from "./NavItems";
import SubscriptionBadge from "./SubscriptionBadge";
import ThemeToggle from "./ThemeToggle";
import { SignInButton, Show, UserButton } from "@clerk/nextjs";
import { Suspense } from "react";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link href="/">
        <div className="flex items-center gap-2.5 cursor-pointer">
          <Image
            src="/images/icon.png"
            alt="Vocalize"
            width={136}
            height={44}
            className="dark:hidden"
          />
          <Image
            src="/images/icon_dark.png"
            alt="Vocalize"
            width={136}
            height={44}
            className="hidden dark:block"
          />
        </div>
      </Link>
      <div className="flex items-center gap-4">
        <Suspense fallback={null}>
          <NavItems />
          <ThemeToggle />
          <Show when="signed-out">
            <SignInButton>
              <button className="btn-signin">Sign In</button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <div className="flex items-center gap-4">
              <SubscriptionBadge />
              <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#fe5933] p-0.5">
                <UserButton />
              </div>
            </div>
          </Show>
        </Suspense>
      </div>
    </nav>
  );
};

export default Navbar;
