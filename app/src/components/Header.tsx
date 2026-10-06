import { Link, useLocation } from "react-router";
import { useAuth } from "../context/index";
import { Activity, LogIn, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavLink {
  name: string;
  path: string;
}

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { authState, signOut } = useAuth();
  const { pathname } = useLocation();   // ← useLocation
  const isAuthenticated: boolean = !!authState.user;

  const navLink: NavLink[] = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Transações", path: "/transacoes" },
  ];

  const handleSignOut = (): void => {
    setIsOpen(false);
    signOut();
  };

  const changeMenu = (): void => {
    setIsOpen(!isOpen);
  };

  const renderAvatar = () => {
    if (!authState.user) return null;

    if (authState.user.photoURL) {
      return (
        <img
          src={authState.user.photoURL}
          alt={`Foto de perfil de(a) ${authState.user.displayName}`}
          className="w-8 h-8 rounded-full border border-gray-700"
          referrerPolicy="no-referrer"
        />
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
        {authState.user.displayName?.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container-app">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary-500 font-bold text-xl">
            <Activity className="h-6 w-6" /> DevBills
          </Link>

          {/* Menu Desktop */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-6">
              {navLink.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary-500 ${
                    pathname === link.path ? "text-primary-500" : "text-gray-300"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {renderAvatar()}
                  <span className="text-sm font-medium">{authState.user?.displayName}</span>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="hover:text-red-400 hover:bg-red-600 p-2 rounded-full transition-colors cursor-pointer"
                >
                  <LogOut className="w-5 h-5 text-gray-300" />
                </button>
              </div>
            ) : (
              <Link to="/login">
                <LogIn className="bg-primary-500 text-gray-900 font-semibold px-5 py-2.5 rounded-xl flex items-center justify-center hover:bg-primary-700 transition-all" />
              </Link>
            )}
          </div>

          {/* Botão Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors"
              onClick={changeMenu}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile — DENTRO do container-app */}
        {isOpen && (
          <div className="md:hidden pb-4">
            {isAuthenticated ? (
              <>
                <nav className="space-y-1.5">
                  {navLink.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`block p-5 rounded-lg ${
                        pathname === link.path
                          ? "bg-gray-800 text-primary-500 font-medium"
                          : "text-gray-400 hover:bg-gray-800 hover:text-primary-500"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
                <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                  <div className="flex items-center space-x-2">
                    {renderAvatar()}
                    <span className="text-sm font-medium">{authState.user?.displayName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-600 rounded-full transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <Link 
              to="/login" 
              className="bg-primary-500 text-gray-900 font-semibold px-5 py-2.5 rounded-xl flex items-center justify-center hover:bg-primary-700 transition-all"
              onClick={() => setIsOpen(false)}
              >
                Entrar
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;