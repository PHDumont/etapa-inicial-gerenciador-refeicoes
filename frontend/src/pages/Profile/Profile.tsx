import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/react";
import { Sidebar } from "../../components/SideBar";
import { SummaryPanel } from "../SummaryPanel";
import "./Profile.css";

type SaveStatus = "idle" | "loading" | "success" | "error";

interface ProfilePayload {
  currentWeight: number;
  height: number;
  dailyCaloriesGoal: number;
  dailyWaterIntake: number;
}

interface ProfileFormState {
  currentWeight: string;
  height: string;
  dailyCaloriesGoal: string;
  dailyWaterIntake: string;
}

const initialFormState: ProfileFormState = {
  currentWeight: "",
  height: "",
  dailyCaloriesGoal: "",
  dailyWaterIntake: "",
};

export function Profile() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [formData, setFormData] = useState<ProfileFormState>(initialFormState);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [loadError, setLoadError] = useState("");

  const isSaving = saveStatus === "loading";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadError("");

        if (isLoaded && isSignedIn && user) {
          await axios.post("/users/sync", {
            email: user.emailAddresses[0]?.emailAddress ?? "",
            name: user.fullName ?? "Usuario",
          });
        }

        const response = await axios.get<ProfilePayload>("/users/profile");
        const profile = response.data;

        setFormData({
          currentWeight: String(profile.currentWeight ?? 0),
          height: String(profile.height ?? 0),
          dailyCaloriesGoal: String(profile.dailyCaloriesGoal ?? 0),
          dailyWaterIntake: String(profile.dailyWaterIntake ?? 0),
        });
      } catch {
        setLoadError(
          "Nao foi possivel carregar o perfil. Verifique seu login e tente novamente.",
        );
      }
    };

    void fetchProfile();
  }, [isLoaded, isSignedIn, user]);

  const statusMessage = useMemo(() => {
    if (saveStatus === "loading") {
      return "Salvando alteracoes...";
    }
    if (saveStatus === "success") {
      return "Perfil atualizado com sucesso.";
    }
    if (saveStatus === "error") {
      return "Nao foi possivel salvar. Confira os dados e tente novamente.";
    }
    return "";
  }, [saveStatus]);

  const handleChange = (field: keyof ProfileFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (saveStatus === "success" || saveStatus === "error") {
      setSaveStatus("idle");
    }
  };

  const parseNumber = (value: string) => {
    const parsed = Number(value.replace(",", "."));
    return Number.isFinite(parsed) ? parsed : NaN;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveStatus("loading");

    const payload: ProfilePayload = {
      currentWeight: parseNumber(formData.currentWeight),
      height: parseNumber(formData.height),
      dailyCaloriesGoal: parseNumber(formData.dailyCaloriesGoal),
      dailyWaterIntake: parseNumber(formData.dailyWaterIntake),
    };

    const hasInvalidValues = Object.values(payload).some(
      (value) => Number.isNaN(value) || value < 0,
    );

    if (hasInvalidValues) {
      setSaveStatus("error");
      return;
    }

    try {
      const response = await axios.put<ProfilePayload>(
        "/users/profile",
        payload,
      );
      const profile = response.data;

      setFormData({
        currentWeight: String(profile.currentWeight),
        height: String(profile.height),
        dailyCaloriesGoal: String(profile.dailyCaloriesGoal),
        dailyWaterIntake: String(profile.dailyWaterIntake),
      });
      setSaveStatus("success");
    } catch {
      setSaveStatus("error");
    }
  };

  return (
    <>
      <title>Perfil</title>
      <Sidebar />
      <main className="profile-container">
        <section className="profile-card">
          <header className="profile-header">
            <p className="profile-eyebrow">Configuracoes pessoais</p>
            <h2>Meu Perfil</h2>
            <p className="profile-subtitle">
              Atualize suas medidas e metas diarias para acompanhar melhor sua
              rotina.
            </p>
          </header>

          {loadError ? (
            <p className="profile-message profile-message--error">
              {loadError}
            </p>
          ) : null}

          <form className="profile-form" onSubmit={handleSubmit}>
            <label className="profile-field">
              <span>Peso Atual (kg)</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.currentWeight}
                onChange={(event) =>
                  handleChange("currentWeight", event.target.value)
                }
                required
              />
            </label>

            <label className="profile-field">
              <span>Altura (cm)</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.height}
                onChange={(event) => handleChange("height", event.target.value)}
                required
              />
            </label>

            <label className="profile-field">
              <span>Meta de Calorias (kcal)</span>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.dailyCaloriesGoal}
                onChange={(event) =>
                  handleChange("dailyCaloriesGoal", event.target.value)
                }
                required
              />
            </label>

            <label className="profile-field">
              <span>Meta de Agua (ml)</span>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.dailyWaterIntake}
                onChange={(event) =>
                  handleChange("dailyWaterIntake", event.target.value)
                }
                required
              />
            </label>

            <div className="profile-actions">
              <button type="submit" disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar alteracoes"}
              </button>
              {statusMessage ? (
                <p
                  className={`profile-message ${
                    saveStatus === "success"
                      ? "profile-message--success"
                      : saveStatus === "error"
                        ? "profile-message--error"
                        : ""
                  }`}
                  role="status"
                >
                  {statusMessage}
                </p>
              ) : null}
            </div>
          </form>
        </section>
      </main>
      <SummaryPanel />
    </>
  );
}
