import React from 'react'
import { NavLink } from 'react-router-dom'
import { FiHome, FiList, FiTarget, FiFlag } from 'react-icons/fi'

const tabs = [
  { to: '/',             label: 'Home',         Icon: FiHome   },
  { to: '/transactions', label: 'Transactions',  Icon: FiList   },
  { to: '/budgets',      label: 'Budgets',       Icon: FiTarget },
  { to: '/goal',         label: 'Goal',          Icon: FiFlag   },
]

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#FFFFFF] border-t-2 border-[#E2DDD5]">
      <ul className="flex justify-around items-center h-16">
        {tabs.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}   
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 py-2 w-full transition-colors duration-200 ${
                  isActive
                    ? 'text-[#2A5C45]'
                    : 'text-[#B0A99F] hover:text-[#2A5C45]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`p-1.5 rounded-xl transition-colors duration-200 ${
                      isActive ? 'bg-[#EAF2EC]' : ''
                    }`}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  </span>
                  <span className="text-[10px] font-medium">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default BottomNav