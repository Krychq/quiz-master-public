"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
// Usunięto importy Supabase, useEffect i useRouter!
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { PlusCircle, Trophy, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AuthModal = dynamic(() =>
  import("@/components/auth/auth-modal").then((mod) => mod.AuthModal),
);

export function UserAuthSection({ initialUser }: { initialUser: any }) {
  // Jeśli użytkownik nie jest zalogowany, dynamicznie pobieramy i pokazujemy modal
  if (!initialUser) {
    return <AuthModal />;
  }

  // Jeśli jest zalogowany, pokazujemy tylko Dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full"
        >
          <UserAvatar
            src={initialUser?.user_metadata?.avatar_url}
            alt="User avatar"
            className="h-9 w-9"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link
            href="/create"
            className="w-full flex items-center cursor-pointer sm:hidden"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Quiz
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="w-full flex items-center cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/my-results"
            className="w-full flex items-center cursor-pointer"
          >
            <Trophy className="mr-2 h-4 w-4" />
            My Results
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            // Zakładamy, że funkcja logout() (Server Action) zajmuje się wyczyszczeniem
            // ciasteczek Supabase i robi redirect() z next/navigation.
            await logout();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
