import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router";
import axios from "axios";
import "./App.css";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/react";

const FoodCatalogy = lazy(() =>
  import("./pages/FoodCatalogy/FoodCatalogy").then((m) => ({
    default: m.FoodCatalogy,
  })),
);
const Diary = lazy(() =>
  import("./pages/Diary/Diary").then((m) => ({ default: m.Diary })),
);

axios.defaults.baseURL = "http://localhost:3000";

export interface Food {
  _id: string;
  name: string;
  caloriesPerGram: number;
  category: string;
}
export interface Meal {
  _id: string;
  name: string;
  date: string;
  totalCalories: number;
  isExpanded: boolean;
  items: foodId[];
}
export interface foodId {
  foodId: Food;
  quantityGrams: number;
  _id: string;
}

function App() {
  const [foods, setFoods] = useState<Food[]>([]);

  const { getToken } = useAuth();

  const loadFoods = async () => {
    const response = await axios.get<Food[]>("/foods");
    setFoods(response.data);
  };

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        const token = await getToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [getToken]);

  useEffect(() => {
    loadFoods();
  }, []);

  return (
    <>
      <Show when="signed-out">
        <div className="app-auth-screen" role="main">
          <div className="app-auth-card">
            <p className="app-auth-eyebrow">Meal Tracker</p>
            <h1 className="app-auth-title">
              Seu diário alimentar, em um só lugar
            </h1>
            <p className="app-auth-lead">
              Registre refeições, consulte calorias e mantenha o catálogo de
              alimentos organizado com segurança da sua conta.
            </p>
            <ul className="app-auth-points" aria-label="Recursos">
              <li>Diário com totais por dia</li>
              <li>Catálogo personalizável</li>
              <li>Resumo nutricional rápido</li>
            </ul>
            <div className="app-auth-actions">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="app-auth-btn app-auth-btn--primary"
                >
                  Entrar
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="app-auth-btn app-auth-btn--outline"
                >
                  Criar conta
                </button>
              </SignUpButton>
            </div>
            <p className="app-auth-footnote">
              Ao continuar, você usa os fluxos seguros de autenticação do Clerk.
            </p>
          </div>
        </div>
      </Show>

      <Show when="signed-in">
        <div className="app-shell">
          <header className="app-topbar">
            <Link to="/diary" className="app-topbar-brand">
              <span className="app-topbar-text">
                <span className="app-topbar-name">Meal Tracker</span>
              </span>
            </Link>
            <div className="app-topbar-actions">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "app-user-avatar",
                  },
                }}
              />
            </div>
          </header>
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Navigate to="/diary" replace />} />
              <Route
                path="/food-catalogy"
                element={
                  <div className="container">
                    <Suspense
                      fallback={
                        <div className="route-loading">Carregando…</div>
                      }
                    >
                      <FoodCatalogy foods={foods} loadFoods={loadFoods} />
                    </Suspense>
                  </div>
                }
              />
              <Route
                path="/diary"
                element={
                  <div className="container">
                    <Suspense
                      fallback={
                        <div className="route-loading">Carregando…</div>
                      }
                    >
                      <Diary foods={foods} />
                    </Suspense>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </Show>
    </>
  );
}

export default App;
