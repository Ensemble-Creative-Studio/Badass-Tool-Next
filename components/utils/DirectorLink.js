// DirectorLink.js
import Link from "next/link";
import { useRef } from "react";

export default function DirectorLink({ directorRef, directorName }) {
    return (
      <Link href="/" ref={directorRef} className="text-red flex items-center sm:pr-0 pr-24">
        <span>Director</span>
        <span className="pl-8 founder-semiBold">
          {directorName ? directorName : "Choose a director"}
        </span>
      </Link>
    );
  }
  