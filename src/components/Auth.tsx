"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { ModalView } from "./Modal";
import Link from "next/link";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import Image from "next/image";


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
  const names=user?.displayName?.split(" ")

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={() => setClicked((prev) => !prev)}
        className="relative rounded-xl font-medium text-gray-700 hover:text-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
      >
        {user ? (
          <span>
            <Image
              src={user.profilePic || "/logo.jpg"}
              alt="Profile"
              width={32}
              height={32}
              className="object-cover w-8 h-8 rounded-full"
            />
          </span>
        ) : (
          "Sign Up"
        )}
      </button>

      {/* Dropdown */}
      {clicked && (
        <div className="absolute right-0 top-full">
          {!user ? (
            <>
              <ModalView setClicked={setClicked} clicked={clicked}>
                <div className="flex flex-col items-center gap-4 p-6">
                  {/* Header Logo */}
                  <div>
                    <Link
                      href="/"
                      className="font-bold text-2xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent hover:from-orange-600 hover:to-pink-600 transition-all duration-200"
                    >
                      Logo
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
            </>
          ) : (
            <div className="flex  bg-white  text-black shadow-lg z-40 flex-col  gap-3 rounded-b-sm pl-6 pr-10 p-4">
             
              <div className="font-semibold">{names && names[0] }</div>
              <Link href="/about-you">Profile</Link>
              <button
                onClick={signOut}
                className="bg-red-100 hover:bg-red-200 px-5 py-2.5 rounded-xl font-medium text-red-700 hover:text-red-800 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Auth;
