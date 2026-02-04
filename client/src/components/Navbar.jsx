import React , {useState} from 'react'
import { BookOpen, Clock, Star, Users } from "lucide-react"
import { NavLink } from 'react-router-dom'
import { useAppContext } from '../context/AppContext.jsx'
import { 
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu, } from './ui/resizable-navbar.jsx'
import { Button } from './ui/button.jsx'
export default function Header() {
    const { userRole , navigate} = useAppContext();
    const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "learning paths",
      link: "/join",
    },
    {
      name: "Contact",
      link: "/contact",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    
    return(

      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div style={{ position: "relative", zIndex: 9999 }} className="flex items-center gap-4">
                {
                    userRole ? (
                        <>
                            <NavLink  to={userRole === "learner" ? "/learner" : "/teacher"} className="  text-gray-500 hover:text-black cursor-pointer">
                                <Users className="h-6 w-6" />
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <button variant="ghost"  className='cursor-pointer bg-black rounded py-1 px-4 text-white'>
                                <NavLink to="login">Login</NavLink>
                            </button>
                            <button variant="ghost"  className='cursor-pointer bg-black rounded py-1 px-4 text-white'>
                                <NavLink to="register">Register</NavLink>
                            </button>
                        </>
                    )
                }
          </div>
        </NavBody>
 
        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>
 
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
             {
                    userRole ? (
                        <NavLink to={userRole === "learner" ? "/learner" : "/teacher"} className="  text-gray-500 hover:text-black cursor-pointer">
                            <Users className="h-6 w-6" />
                        </NavLink>
                    ) : (
                        <>
                            <button variant="ghost"  className='cursor-pointer bg-black rounded py-1 px-4 text-white'>
                                <NavLink to="login">Login</NavLink>
                            </button>
                            <button variant="ghost"  className='cursor-pointer bg-black rounded py-1 px-4 text-white'>
                                <NavLink to="register">Register</NavLink>
                            </button>
                        </>
                    )
                }

            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
 
        
    )
}
