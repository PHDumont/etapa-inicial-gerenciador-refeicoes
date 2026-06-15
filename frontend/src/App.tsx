import { lazy, Suspense, useCallback, useEffect, useState } from "react";
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
const Profile = lazy(() =>
  import("./pages/Profile/Profile").then((m) => ({ default: m.Profile })),
);
const Water = lazy(() => import("./pages/Water/Water").then((m) => ({ default: m.default }))
);

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export interface Food {
  _id: string;
  name: string;
  category: string;
  kcalPer100g: number;
  proteinPer100g?: number;
  carbohydratesPer100g?: number;
  fatPer100g?: number;
  fiberPer100g?: number;
  sugarPer100g?: number;
  sodiumPer100g?: number;
  barcode?: string;
  source?: "default" | "user" | "open-food-facts";
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

  const loadFoods = useCallback(async () => {
    const response = await axios.get<Food[]>("/foods");
    setFoods(response.data);
  }, []);

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
  }, [loadFoods]);

  return (
    <>
      <Show when="signed-out">
        <div className="app-auth-screen" role="main">
          <div className="app-auth-card">
            <p className="app-auth-eyebrow">Meal Tracker</p>
            <h1 className="app-auth-title">Your food diary, in one place</h1>
            <p className="app-auth-lead">
              Register meals, consult calories and keep the food catalog
              organized with the security of your account.
            </p>
            <ul className="app-auth-points" aria-label="Recursos">
              <li>Food diary with totals per day</li>
              <li>Customizable food catalog</li>
              <li>Quick nutritional summary</li>
            </ul>
            <div className="app-auth-actions">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="app-auth-btn app-auth-btn--primary"
                >
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="app-auth-btn app-auth-btn--outline"
                >
                  Sign Up
                </button>
              </SignUpButton>
            </div>
            <p className="app-auth-footnote">
              By continuing, you use the secure authentication flows of Clerk.
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
              <Link to="/profile" className="app-topbar-link">
                Profile
              </Link>
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
                      fallback={<div className="route-loading">Loading...</div>}
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
                      fallback={<div className="route-loading">Loading...</div>}
                    >
                      <Diary />
                    </Suspense>
                  </div>
                }
              />
              <Route
                path="/profile"
                element={
                  <div className="container">
                    <Suspense
                      fallback={<div className="route-loading">Loading...</div>}
                    >
                      <Profile />
                    </Suspense>
                  </div>
                }
              />
              <Route
                path="/water"
                element={
                  <div className="container">
                    <Suspense
                      fallback={<div className="route-loading">Loading...</div>}
                    >
                      <Water/>
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
