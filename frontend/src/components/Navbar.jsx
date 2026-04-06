

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import { isTokenValid } from '../services/authentication.js'



function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate();

  const token = localStorage.getItem("token");



  const handleLogout = () => {

    localStorage.removeItem("token");



    navigate("/login")


  }

  return (
    <header className="bg-white dark:bg-gray-100 scheme-light dark:scheme-dark">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              alt=""
              src="/homeicon.svg?color=indigo&shade=600"
              className="h-8 w-auto"
            />
          </a>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">


          <Link to="/" className="text-sm/6 font-semibold text-gray-900">
            Home
          </Link>
          <Link to="/listings" className="text-sm/6 font-semibold text-gray-900">
            All Listings
          </Link>
          <Link to={(token) ? "/new" : "/login"} onClick={() => {
            localStorage.setItem("req_URL", (!token) && "/new");
          }} className="text-sm/6 font-semibold text-gray-900">
            Add New Listings
          </Link>
        </PopoverGroup>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {(token) ? <button onClick={handleLogout} className="text-sm/6 font-semibold text-gray-900">
            Logout <span aria-hidden="true">&rarr;</span>
          </button> : <a href="/login" className="text-sm/6 font-semibold text-gray-900">
            Log in <span aria-hidden="true">&rarr;</span>
          </a>}

        </div>
      </nav>

      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="homeicon.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">

                <Link
                  to="/"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Home
                </Link>
                <Link
                  to="/listings"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  All Listings
                </Link>
                <Link
                  to={(token && isTokenValid(token)) ? "/new" : "/login"}
                  onClick={() => {
                    localStorage.setItem("req_URL", (!token) && "/new");
                  }}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Add New Listing
                </Link>
              </div>
              <div className="py-6">
                {(token) ? <button
                  onClick={handleLogout}
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  LogOut
                </button> : <a
                  href="/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </a>}

              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}


export default Navbar;
