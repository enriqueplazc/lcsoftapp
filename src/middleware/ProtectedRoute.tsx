// src/middleware/ProtectedRoute.tsx
// Middleware de autenticación — redirige a /login si no hay sesión activa
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

interface Props {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const [user, setUser] = useState<User | null | undefined>(undefined); // undefined = cargando
  const location = useLocation();

  useEffect(() => {
    // Verificar sesión activa
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // Escuchar cambios de sesión en tiempo real
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Pantalla de carga mientras verifica sesión
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-white/40 text-sm font-light tracking-widest uppercase">Verificando acceso</span>
        </div>
      </div>
    );
  }

  // Sin sesión → redirigir al login guardando el destino original
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
