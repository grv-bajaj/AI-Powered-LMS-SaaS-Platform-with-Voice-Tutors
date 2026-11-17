import Image from "next/image";
import Link from "next/link";
import NavItems from "./NavItems";
import SubscriptionBadge from "./SubscriptionBadge";
import { SignInButton, Show, UserButton } from "@clerk/nextjs";
import { Suspense } from "react";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link href="/">
        <div className="flex items-center gap-2.5 cursor-pointer">
          <Image src="/images/icon.png" alt="logo" width={136} height={44} />
        </div>
      </Link>
      <div className="flex items-center gap-8">
        <Suspense fallback={null}>
          <NavItems />
          <Show when="signed-out">
            <SignInButton>
              <button className="btn-signin">Sign In</button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <div className="flex items-center gap-3">
              <SubscriptionBadge />
              <UserButton />
            </div>
          </Show>
        </Suspense>
      </div>
    </nav>
  );
};

export default Navbar;
