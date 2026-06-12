import { useState } from "react";
import { Search, Menu } from "lucide-react";
import logoImg from "@/assets/logo.png";

type HomeProps = {
  onLogout: () => void;
};

export default function Home({ onLogout }: HomeProps) {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #EFF6FF 0%, #F9FAFB 50%, #ECFDF5 100%)",
      }}
    >
      {/* Fondo decorativo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-10"
          style={{ background: "#1E3A8A" }}
        />

        <div
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full opacity-10"
          style={{ background: "#10B981" }}
        />
      </div>

      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="Ojo al Negocio logo"
              className="w-14 h-14 object-contain"
            />

            <h1 className="font-bold text-2xl text-blue-900">
              Ojo al Negocio
            </h1>
          </div>

          {/* Menú escritorio */}
          <nav className="hidden md:flex items-center gap-6">
            <button
            onClick={onLogout}
            className="hover:text-blue-900 transition"
            > Cerrar sesión
            </button>

            <button className="hover:text-blue-900 transition">
              Favoritos
            </button>

            <button className="hover:text-blue-900 transition">
              Perfil
            </button>
          </nav>

          {/* Menú desplegable */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <Menu />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border overflow-hidden">
                <button className="block w-full text-left px-4 py-3 hover:bg-gray-100">
                  Reseñas
                </button>

                <button className="block w-full text-left px-4 py-3 hover:bg-gray-100">
                  Reportes
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-36">
        <h2 className="text-center text-4xl font-bold text-slate-800">
          Elige mejor con cada opción
        </h2>

        <p className="text-center text-gray-600 mt-4">
          Encuentra los mejores negocios y comparte tu experiencia.
        </p>

        {/* Buscador */}
        <div className="mt-8 flex justify-center">
          <div className="bg-white rounded-full shadow-lg flex items-center px-5 py-3 w-full max-w-2xl">
            <Search className="text-gray-500" />

            <input
              type="text"
              placeholder="Buscar negocio..."
              className="flex-1 px-4 outline-none bg-transparent"
            />

            <button className="bg-blue-900 text-white px-5 py-2 rounded-full hover:bg-blue-800 transition">
              Buscar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
