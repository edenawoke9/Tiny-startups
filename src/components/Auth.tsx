"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { ModalView } from "./Modal";
import Link from "next/link";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import Image from "next/image";
import { X } from "lucide-react";

function Auth() {
  const [clicked, setClicked] = useState(false);
  const {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithGithub,
    signOut,
  } = useFirebaseAuth();
  const names = user?.name?.split(" ") || [];

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={() => setClicked((prev) => !prev)}
        className="relative rounded-xl font-medium text-gray-700 hover:text-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
      >
        {user ? (
          <span  >
            <Image
              src={user.profilePic || user.photoURL || "/logo.jpg"}
              alt="Profile"
              width={32}
              height={32}
              className="object-cover w-8 h-8 rounded-full"
            />
          </span>
        ) : (
          <h1 className="p-2 pr-4 pl-4 rounded-xl shadow-sm">Sign Up</h1>
        )}
      </button>

      {/* Dropdown */}
      {clicked && (
        <div className="absolute right-0 top-full md:right-0 md:top-full">
          {!user ? (
            <SignUp
              setClicked={setClicked}
              clicked={clicked}
              error={error}
              loading={loading}
              signInWithGoogle={signInWithGoogle}
              signInWithGithub={signInWithGithub}
            />
           
          ) : (
            <div className="flex bg-white flex-col min-w-[200px]">
               <div className="flex justify-end pr-2"><X onClick={() => setClicked((prev) => !prev)} /></div>
            <div className="flex  bg-white  text-black shadow-lg z-40 flex-col  gap-3 rounded-b-sm pl-6 pr-10 p-4">
             
             
              <div className="font-semibold">{names[0] || user.displayName || 'User'}</div>
              <Link href="/about-you" onClick={() => setClicked(false)}>Profile</Link>
              <button
                onClick={signOut}
                className="bg-red-100 hover:bg-red-200 px-5 py-2.5 rounded-xl font-medium text-red-700 hover:text-red-800 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Logout
              </button>
            </div></div>
          )}
        </div>
      )}
    </div>
  );
}

export default Auth;

type SignUpProps = {
  setClicked: React.Dispatch<React.SetStateAction<boolean>>;
  clicked: boolean;
  error: string | null;
  loading: boolean;
  signInWithGoogle: () => void;
  signInWithGithub: () => void;
};

export function SignUp({
  setClicked,
  clicked,
  error,
  loading,
  signInWithGoogle,
  signInWithGithub,
}: SignUpProps) {
  return (
    <ModalView setClicked={setClicked} clicked={clicked}>
      <div className="flex flex-col items-center gap-4 p-6">
        {/* Header Logo */}
        <div>
          <Link
            href="/"
            className="font-bold text-2xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent hover:from-orange-600 hover:to-pink-600 transition-all duration-200"
          >
            <Image src="/logo.jpg" alt="Logo" width={50} height={50} />
          </Link>
        </div>
        {/* Header Title */}
        <h1>Sign up on Tiny StartUps</h1>
        <p className="text-2xl text-gray-500">
          Join our community of friendly folks discovering and sharing
        </p>
        <p className="text-2xl text-gray-500">the latest products in tech.</p>
        <div className="flex gap-2">
          <button
            onClick={signInWithGoogle}
            className="bg-white hover:bg-gray-100 px-5 py-2.5 rounded-xl font-medium text-gray-700 hover:text-gray-800 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faGoogle} />
            Sign in with Google
          </button>
          <button
            onClick={signInWithGithub}
            className="bg-white hover:bg-gray-100 px-5 py-2.5 rounded-xl font-medium text-gray-700 hover:text-gray-800 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faGithub} />
            Sign in with GitHub
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {loading && <p className="text-gray-500 mt-2">Loading...</p>}
      </div>
    </ModalView>
  );
}
