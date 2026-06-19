import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Building2,
  Eye,
  EyeOff,
  Star,
  CheckCircle2,
  ChevronRight,
  MapPin,
} from "lucide-react";
import logoImg from "../imports/Captura_de_pantalla_2026-06-08_211927.png";

// ============ TIPOS ============
type Screen = "login" | "register";
type AccountType = "usuario" | "negocio";

interface UserData {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  accountType: AccountType;
  createdAt: string;
}

interface BusinessData {
  id: string;
  userId: string;
  nombre: string;
  rfc: string;
  giro: string;
  direccion: string;
  telefono: string;
  categoria: string;
  verificado: boolean;
  createdAt: string;
}

const BUSINESS_CATEGORIES = [
  "Restaurante / Comida",
  "Hotel / Hospedaje",
  "Tours y actividades",
  "Tienda / Retail",
  "Spa / Belleza",
  "Transporte",
  "Otro",
];

// ============ COMPONENTES ============
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function InputField({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  rightElement,
  error,
}: {
  icon: React.ElementType;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  rightElement?: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="w-full">
      <div className="relative flex items-center">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Icon size={18} />
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-11 pr-10 py-3 rounded-xl border ${
            error ? "border-red-500" : "border-border"
          } bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all`}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ============ PANTALLA DE LOGIN ============
function LoginScreen({ onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Mostrar mensaje de registro exitoso
  useEffect(() => {
    const justRegistered = localStorage.getItem("justRegistered");
    if (justRegistered) {
      setSuccessMessage("✅ ¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.");
      localStorage.removeItem("justRegistered");
      setTimeout(() => setSuccessMessage(""), 5000);
    }
  }, []);

  const handleLogin = () => {
    setError("");
    setSuccessMessage("");
    
    const users: UserData[] = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      if (remember) {
        localStorage.setItem("rememberedUser", JSON.stringify({ email, password }));
      } else {
        localStorage.removeItem("rememberedUser");
      }
      alert(`✅ ¡Bienvenido ${user.nombre}! Has iniciado sesión correctamente.`);
      // Limpiar formulario
      setEmail("");
      setPassword("");
      setRemember(false);
    } else {
      setError("❌ Correo o contraseña incorrectos");
    }
  };

  useEffect(() => {
    const remembered = localStorage.getItem("rememberedUser");
    if (remembered) {
      const { email: rememberedEmail, password: rememberedPass } = JSON.parse(remembered);
      setEmail(rememberedEmail);
      setPassword(rememberedPass);
      setRemember(true);
    }
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-3xl shadow-xl shadow-black/8 p-8 md:p-10">
        <div className="flex flex-col items-center mb-8">
          <img src={logoImg} alt="Ojo al Negocio logo" className="w-24 h-24 object-contain" />
          <h1 className="mt-3 text-primary tracking-tight" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            Ojo al Negocio
          </h1>
          <div className="flex gap-0.5 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill="#10B981" color="#10B981" />
            ))}
          </div>
        </div>

        <div className="text-center mb-7">
          <h2 className="text-foreground" style={{ fontSize: "1.375rem", fontWeight: 700 }}>
            Iniciar sesión
          </h2>
          <p className="text-muted-foreground mt-1" style={{ fontSize: "0.9rem" }}>
            Bienvenido de vuelta
          </p>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-xl text-center text-sm">
            {successMessage}
          </div>
        )}

        <div className="space-y-4">
          <InputField
            icon={Mail}
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={setEmail}
            error={error}
          />
          <InputField
            icon={Lock}
            type={showPass ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={setPassword}
            rightElement={
              <button type="button" onClick={() => setShowPass(!showPass)} className="text-muted-foreground hover:text-foreground transition-colors">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <label className="flex items-center gap-2 cursor-pointer select-none" style={{ fontSize: "0.875rem" }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded accent-primary"
            />
            <span className="text-muted-foreground">Recordarme</span>
          </label>
          <button type="button" className="hover:underline transition-colors" style={{ fontSize: "0.875rem", color: "#10B981", fontWeight: 500 }}>
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          className="w-full mt-6 py-3.5 rounded-xl text-primary-foreground flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] shadow-md"
          style={{ background: "#1E3A8A", fontWeight: 600 }}
        >
          Ingresar
          <ChevronRight size={18} />
        </button>

        <div className="relative my-6 flex items-center gap-3">
          <div className="flex-1 border-t border-border" />
          <span className="text-muted-foreground" style={{ fontSize: "0.8rem" }}>o continúa con</span>
          <div className="flex-1 border-t border-border" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-white hover:bg-muted transition-colors" style={{ fontSize: "0.9rem", fontWeight: 500 }}>
            <GoogleIcon />
            Google
          </button>
          <button type="button" className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-white hover:bg-muted transition-colors" style={{ fontSize: "0.9rem", fontWeight: 500 }}>
            <FacebookIcon />
            Facebook
          </button>
        </div>

        <p className="text-center mt-7 text-muted-foreground" style={{ fontSize: "0.875rem" }}>
          ¿No tienes cuenta?{" "}
          <button type="button" onClick={onSwitch} className="hover:underline font-semibold" style={{ color: "#1E3A8A" }}>
            Regístrate
          </button>
        </p>
      </div>

      <div className="flex justify-center gap-5 mt-5">
        {["Términos de uso", "Aviso de privacidad"].map((t) => (
          <button key={t} type="button" className="text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: "0.78rem" }}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ PANTALLA DE REGISTRO ============
function RegisterScreen({ onSwitch }: { onSwitch: () => void }) {
  const [accountType, setAccountType] = useState<AccountType>("usuario");
  const [showPass, setShowPass] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  // User fields
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");

  // Business fields
  const [bizNombre, setBizNombre] = useState("");
  const [bizRfc, setBizRfc] = useState("");
  const [bizGiro, setBizGiro] = useState("");
  const [bizDir, setBizDir] = useState("");
  const [bizTel, setBizTel] = useState("");

  const isNegocio = accountType === "negocio";

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!email.trim()) newErrors.email = "El correo es requerido";
    if (!email.includes("@")) newErrors.email = "Correo inválido";
    if (!tel.trim()) newErrors.tel = "El teléfono es requerido";
    if (password.length < 6) newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    
    const users: UserData[] = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some(u => u.email === email)) {
      newErrors.email = "Este correo ya está registrado";
    }
    
    if (isNegocio) {
      if (!bizNombre.trim()) newErrors.bizNombre = "El nombre del negocio es requerido";
      if (!bizRfc.trim()) newErrors.bizRfc = "El RFC es requerido";
      if (bizRfc.length < 12) newErrors.bizRfc = "RFC inválido (mínimo 12 caracteres)";
      if (!bizDir.trim()) newErrors.bizDir = "La dirección es requerida";
      if (!selectedCategory) newErrors.categoria = "Selecciona una categoría";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (!validateForm()) return;
    
    const users: UserData[] = JSON.parse(localStorage.getItem("users") || "[]");
    const businesses: BusinessData[] = JSON.parse(localStorage.getItem("businesses") || "[]");
    
    const newUser: UserData = {
      id: crypto.randomUUID(),
      nombre,
      email,
      telefono: tel,
      password,
      accountType,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
    if (isNegocio) {
      const newBusiness: BusinessData = {
        id: crypto.randomUUID(),
        userId: newUser.id,
        nombre: bizNombre,
        rfc: bizRfc,
        giro: bizGiro,
        direccion: bizDir,
        telefono: bizTel,
        categoria: selectedCategory,
        verificado: false,
        createdAt: new Date().toISOString(),
      };
      businesses.push(newBusiness);
      localStorage.setItem("businesses", JSON.stringify(businesses));
    }
    
    // Limpiar formulario
    setNombre("");
    setEmail("");
    setTel("");
    setPassword("");
    setBizNombre("");
    setBizRfc("");
    setBizGiro("");
    setBizDir("");
    setBizTel("");
    setSelectedCategory("");
    setAccountType("usuario");
    
    setSuccessMessage(`✅ ¡Cuenta creada exitosamente${isNegocio ? " y negocio registrado" : ""}!`);
    localStorage.setItem("justRegistered", "true");
    
    setTimeout(() => {
      setSuccessMessage("");
      onSwitch();
    }, 2000);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-card rounded-3xl shadow-xl shadow-black/8 p-8 md:p-10">
        <div className="flex flex-col items-center mb-6">
          <img src={logoImg} alt="Ojo al Negocio logo" className="w-20 h-20 object-contain" />
          <h1 className="mt-2 text-primary tracking-tight" style={{ fontSize: "1.375rem", fontWeight: 700 }}>
            Ojo al Negocio
          </h1>
          <div className="flex gap-0.5 mt-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} fill="#10B981" color="#10B981" />
            ))}
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-foreground" style={{ fontSize: "1.375rem", fontWeight: 700 }}>
            Crear cuenta
          </h2>
          <p className="text-muted-foreground mt-1" style={{ fontSize: "0.875rem" }}>
            Únete a la comunidad de reseñas verificadas
          </p>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-xl text-center text-sm">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-6">
          {(["usuario", "negocio"] as const).map((type) => {
            const active = accountType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setAccountType(type)}
                className={`rounded-2xl p-4 border-2 text-left transition-all ${
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-md"
                    : "border-border bg-muted/50 text-foreground hover:border-primary/40"
                }`}
              >
                <div className="flex justify-center mb-2">
                  {type === "usuario" ? (
                    <User size={28} className={active ? "opacity-100" : "text-muted-foreground"} />
                  ) : (
                    <Building2 size={28} className={active ? "opacity-100" : "text-muted-foreground"} />
                  )}
                </div>
                <p className="text-center font-semibold capitalize" style={{ fontSize: "0.925rem" }}>
                  {type === "usuario" ? "Usuario" : "Negocio"}
                </p>
                <p className={`text-center mt-1 leading-snug ${active ? "opacity-80" : "text-muted-foreground"}`} style={{ fontSize: "0.75rem" }}>
                  {type === "usuario"
                    ? "Turista o residente que consulta y publica reseñas."
                    : "Dueño o representante de un establecimiento local."}
                </p>
              </button>
            );
          })}
        </div>

        <div className="space-y-3.5">
          <InputField icon={User} placeholder="Nombre completo" value={nombre} onChange={setNombre} error={errors.nombre} />
          <InputField icon={Mail} type="email" placeholder="Correo electrónico" value={email} onChange={setEmail} error={errors.email} />
          <InputField icon={Phone} type="tel" placeholder="Número de celular" value={tel} onChange={setTel} error={errors.tel} />
          <InputField
            icon={Lock}
            type={showPass ? "text" : "password"}
            placeholder="Contraseña (mínimo 6 caracteres)"
            value={password}
            onChange={setPassword}
            error={errors.password}
            rightElement={
              <button type="button" onClick={() => setShowPass(!showPass)} className="text-muted-foreground hover:text-foreground transition-colors">
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            }
          />
        </div>

        {isNegocio && (
          <div className="mt-6 rounded-2xl p-5 border" style={{ background: "#ECFDF5", borderColor: "#6EE7B7" }}>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={18} color="#10B981" />
              <h3 className="font-semibold" style={{ fontSize: "0.95rem", color: "#065F46" }}>
                Datos del negocio
              </h3>
            </div>

            <div className="space-y-3">
              <InputField icon={Building2} placeholder="Nombre del negocio" value={bizNombre} onChange={setBizNombre} error={errors.bizNombre} />
              <InputField icon={CheckCircle2} placeholder="RFC del negocio" value={bizRfc} onChange={setBizRfc} error={errors.bizRfc} />
              <InputField icon={Star} placeholder="Giro del negocio" value={bizGiro} onChange={setBizGiro} />
              <InputField icon={MapPin} placeholder="Dirección" value={bizDir} onChange={setBizDir} error={errors.bizDir} />
              <InputField icon={Phone} type="tel" placeholder="Teléfono del negocio" value={bizTel} onChange={setBizTel} />
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium mb-2" style={{ color: "#065F46", fontSize: "0.82rem" }}>
                Categoría del negocio
              </p>
              <div className="flex flex-wrap gap-2">
                {BUSINESS_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? "border-accent bg-accent text-accent-foreground shadow-sm"
                        : "border-[#6EE7B7] bg-white text-[#065F46] hover:bg-[#D1FAE5]"
                    }`}
                    style={{ fontSize: "0.75rem" }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {errors.categoria && <p className="text-red-500 text-xs mt-1">{errors.categoria}</p>}
            </div>

            <div className="mt-4 flex gap-2.5 p-3 rounded-xl bg-white/70 border border-[#A7F3D0]">
              <MapPin size={16} color="#10B981" className="shrink-0 mt-0.5" />
              <p style={{ fontSize: "0.75rem", color: "#047857", lineHeight: "1.5" }}>
                Para verificar tu negocio se solicitarán datos oficiales. Solo se aceptan establecimientos ubicados en{" "}
                <strong>Quintana Roo</strong>.
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleRegister}
          className="w-full mt-6 py-3.5 rounded-xl text-primary-foreground flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] shadow-md"
          style={{ background: "#1E3A8A", fontWeight: 600, fontSize: "0.9rem" }}
        >
          {isNegocio ? "Crear cuenta y solicitar verificación" : "Crear cuenta"}
          <ChevronRight size={18} />
        </button>

        <p className="text-center mt-6 text-muted-foreground" style={{ fontSize: "0.875rem" }}>
          ¿Ya tienes cuenta?{" "}
          <button type="button" onClick={onSwitch} className="hover:underline font-semibold" style={{ color: "#1E3A8A" }}>
            Iniciar sesión
          </button>
        </p>
      </div>

      <div className="flex justify-center gap-5 mt-5">
        {["Términos de uso", "Aviso de privacidad"].map((t) => (
          <button key={t} type="button" className="text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: "0.78rem" }}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ APP PRINCIPAL ============
export default function App() {
  const [screen, setScreen] = useState<Screen>("login");

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center py-10 px-4"
      style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #F9FAFB 50%, #ECFDF5 100%)" }}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-10" style={{ background: "#1E3A8A" }} />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full opacity-8" style={{ background: "#10B981" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5" style={{ border: "2px solid #1E3A8A" }} />
      </div>

      <div className="relative z-10 w-full">
        {screen === "login" ? (
          <LoginScreen onSwitch={() => setScreen("register")} />
        ) : (
          <RegisterScreen onSwitch={() => setScreen("login")} />
        )}
      </div>
    </div>
  );
}