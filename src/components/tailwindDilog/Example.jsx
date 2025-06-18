'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import {
  XMarkIcon,
  HomeIcon,
  UserIcon,
  CogIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CalendarIcon,
  EnvelopeIcon,
  BellIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

export default function Example() {
  const [open, setOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', icon: <HomeIcon className="h-5 w-5" />, current: true },
    { name: 'Profile', icon: <UserIcon className="h-5 w-5" />, current: false },
    { name: 'Documents', icon: <DocumentTextIcon className="h-5 w-5" />, current: false },
    { name: 'Reports', icon: <ChartBarIcon className="h-5 w-5" />, current: false },
    { name: 'Calendar', icon: <CalendarIcon className="h-5 w-5" />, current: false },
    { name: 'Messages', icon: <EnvelopeIcon className="h-5 w-5" />, current: false },
    { name: 'Notifications', icon: <BellIcon className="h-5 w-5" />, current: false },
    { name: 'Settings', icon: <CogIcon className="h-5 w-5" />, current: false },
    { name: 'Sign out', icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />, current: false },
  ]

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-10 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Open Sidebar
      </button>

      <Dialog open={open} onClose={setOpen} className="relative z-[9999999]">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/50 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
              <DialogPanel
                transition
                className="pointer-events-auto relative w-screen max-w-xs transform transition duration-500 ease-in-out data-closed:-translate-x-full"
              >
                <TransitionChild>
                  <div className="absolute right-0 top-0 -mr-8 flex pt-4 pl-2 sm:-mr-10 sm:pl-4">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="relative rounded-md text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <XMarkIcon className="h-6 w-6 border-white hover:border-gray-300 border-1" aria-hidden="true" />
                    </button>
                  </div>
                </TransitionChild>

                <div className="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                      Navigation
                    </DialogTitle>
                  </div>

                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    <nav className="flex-1 space-y-1">
                      {navigation.map((item) => (
                        <a  onClick={() => setOpen(false)}
                          key={item.name}
                          href="#"
                          className={`${item.current
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            } group flex items-center rounded-md px-3 py-2 text-sm font-medium`}
                        >
                          <span className={`${item.current
                              ? 'text-indigo-500'
                              : 'text-gray-400 group-hover:text-gray-500'
                            } mr-3 flex-shrink-0`}
                          >
                            {item.icon}
                          </span>
                          {item.name}
                        </a>
                      ))}
                    </nav>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">John Doe</p>
                        <p className="text-xs font-medium text-gray-500">john@example.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}