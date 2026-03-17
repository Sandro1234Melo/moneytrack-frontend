import { useEffect, useRef, useState } from "react";
import UserProfileCard from "../components/settings/UserProfileCard";
import SettingsSection from "../components/settings/SettingsSection";
import { getLoggedUser } from "../utils/auth";
import { Button } from "../components/ui/Button";
import api from "../api/axios";
import SelectField from "../components/molecules/select-field";
import { Pencil, Trash2, X } from "lucide-react";

const Settings = () => {
  const initialUser = getLoggedUser();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [currentUser, setCurrentUser] = useState(initialUser);
  const [loadingUser, setLoadingUser] = useState(true);

  const [currency, setCurrency] = useState(
    initialUser?.currency_code || "BRL"
  );
  const [country, setCountry] = useState(
    initialUser?.country_code || "BR"
  );
  const [language, setLanguage] = useState(
    initialUser?.language || "pt-BR"
  );
  const [profileUrl, setProfileUrl] = useState(
    initialUser?.profile_image_url || ""
  );

  const [saving, setSaving] = useState(false);
  const [, setUploading] = useState(false);
  const [openPhotoModal, setOpenPhotoModal] = useState(false);


  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("/users/me");
        const u = res.data;

        const normalizedUser = {
          ...u,
          currency_code: u.currency_Code,
          country_code: u.country_Code,
          profile_image_url: u.profile_Image_Url,
          bottom_nav_config: u.bottom_Nav_Config,
        };

        setCurrentUser(normalizedUser);
        setCurrency(normalizedUser.currency_code || "BRL");
        setCountry(normalizedUser.country_code || "BR");
        setLanguage(normalizedUser.language || "pt-BR");
        setProfileUrl(normalizedUser.profile_image_url || "");

        sessionStorage.setItem("user", JSON.stringify(normalizedUser));
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, []);

  // ================= LOADING STATE =================
  if (loadingUser) {
    return (
      <div className="p-6 text-center text-gray-400">
        Carregando...
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="p-6 text-center text-gray-400">
        Usuário não autenticado
      </div>
    );
  }

  // ================= SAVE PREFS =================
  const handleSavePreferences = async () => {
    try {
      setSaving(true);

      await api.put("/users/me/preferences", {
        currency_code: currency,
        country_code: country,
        language: language,
        theme: currentUser.theme,
        bottom_nav_config: currentUser.bottom_nav_config,
      });

      const updatedUser = {
        ...currentUser,
        currency_code: currency,
        country_code: country,
        language: language,
        profile_image_url: profileUrl,
      };

      setCurrentUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Erro ao salvar preferências:", error);
    } finally {
      setSaving(false);
    }
  };

  // ================= UPLOAD =================
  const handleSelectPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleUploadPhoto = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post(
        "/users/me/upload-photo",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const imageUrl = res.data?.url;

      if (imageUrl) {
        const base = api.defaults.baseURL?.replace("/api", "") || "";
        const fullUrl = `${base}${imageUrl}?t=${Date.now()}`;

        setProfileUrl(fullUrl);

        const updatedUser = {
          ...currentUser,
          profile_image_url: fullUrl,
        };

        setCurrentUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Erro ao enviar foto:", error);
    } finally {
      setUploading(false);
    }
  };

  // ================= DELETE PHOTO =================
  const handleDeletePhoto = async () => {
    try {
      await api.delete("/users/me/profile-photo");

      setProfileUrl("");

      const updatedUser = {
        ...currentUser,
        profile_image_url: "",
      };

      setCurrentUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setOpenPhotoModal(false);
    } catch (error) {
      console.error("Erro ao remover foto:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#050518] text-white">
      <div className="p-4 lg:p-6 pb-24 space-y-6">
        {/* HEADER */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Configurações</h1>
          <p className="text-sm text-gray-400">
            Gerencie suas preferências da conta
          </p>
        </div>

        {/* PERFIL */}
        <div
          onClick={() => setOpenPhotoModal(true)}
          className="cursor-pointer"
        >
          <UserProfileCard
            user={{ ...currentUser, profile_image_url: profileUrl }}
          />
        </div>

        {/* PREFERÊNCIAS */}
        <SettingsSection title="Preferências">
          <div className="grid gap-4">
            <SelectField
              label="Moeda"
              value={currency}
              onChange={setCurrency}
              options={[
                { value: "BRL", label: "Real (R$)" },
                { value: "EUR", label: "Euro (€)" },
                { value: "USD", label: "Dólar ($)" },
              ]}
            />

            <SelectField
              label="País"
              value={country}
              onChange={setCountry}
              options={[
                { value: "BR", label: "Brasil" },
                { value: "PT", label: "Portugal" },
                { value: "US", label: "Estados Unidos" },
              ]}
            />

            <SelectField
              label="Idioma"
              value={language}
              onChange={setLanguage}
              options={[
                { value: "pt-BR", label: "Português (BR)" },
                { value: "pt-PT", label: "Português (PT)" },
                { value: "en-US", label: "Inglês" },
              ]}
            />

            <div className="flex justify-end pt-2">
              <Button
                label={saving ? "Salvando..." : "Salvar preferências"}
                variant="primary"
                onClick={handleSavePreferences}
              />
            </div>
          </div>
        </SettingsSection>
      </div>

      {/* ================= MODAL FOTO ================= */}
      {openPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative w-[90%] max-w-sm bg-[#0b1220] border border-white/10 rounded-xl p-6 text-center space-y-4">
            <button
              onClick={() => setOpenPhotoModal(false)}
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex justify-center">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-[#111827] border border-white/10">
                {profileUrl ? (
                  <img
                    src={profileUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Sem foto
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-6 pt-2">
              <button
                onClick={handleSelectPhoto}
                className="flex flex-col items-center text-sm text-gray-300 hover:text-white"
              >
                <Pencil size={20} />
                Editar
              </button>

              <button
                onClick={handleDeletePhoto}
                className="flex flex-col items-center text-sm text-red-400 hover:text-red-300"
              >
                <Trash2 size={20} />
                Deletar
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUploadPhoto}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;