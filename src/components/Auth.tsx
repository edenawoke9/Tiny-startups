"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { useSession, signIn, signOut } from "next-auth/react";
import { ModalView } from "./Modal";
import Link from "next/link";

function Auth() {
  const [clicked, setClicked] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={() => setClicked((prev) => !prev)}
        className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 px-5 py-2.5 rounded-xl font-medium text-gray-700 hover:text-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
      >
        {session ? session.user?.name : "Sign Up"}
      </button>

      {/* Dropdown */}
      {clicked && (
        <div>
          {!session ? (
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
                      onClick={() => signIn("google")}
                      className="bg-white hover:bg-gray-100 px-5 py-2.5 rounded-xl font-medium text-gray-700 hover:text-gray-800 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faGoogle} />
                      Sign in with Google
                    </button>
                    <button
                      onClick={() => signIn("github")}
                      className="bg-white hover:bg-gray-100 px-5 py-2.5 rounded-xl font-medium text-gray-700 hover:text-gray-800 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faGithub} />
                      Sign in with GitHub
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    We&apos;ll never post to any of your accounts without your
                    permission
                  </p>
                </div>
              </ModalView>
            </>
          ) : (
            <button
              onClick={() => {
                signOut();
                setClicked(false);
              }}
              className="bg-red-100 absolute left-10 hover:bg-red-200 px-5 py-2.5 rounded-xl font-medium text-red-700 hover:text-red-800 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Auth;
