import UserProfileCard from "../components/settings/UserProfileCard";
import SettingsSection from "../components/settings/SettingsSection";
import { getLoggedUser } from "../utils/auth";

const Settings = () => {
  const user = getLoggedUser();

  if (!user) {
    return (
      <div className="text-center text-gray-400">
        Usuário não autenticado
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      <h1 className="text-2xl font-semibold">
        Configurações
      </h1>

      {/* PERFIL */}
      <UserProfileCard user={user} />

      {/* PREFERÊNCIAS */}
      <SettingsSection title="Preferências">

        <div className="grid gap-4">

          {/* MOEDA */}
          <div>
            <label className="text-sm text-gray-400">Moeda</label>
            <select className="w-full input">
              <option value="BRL">Real (R$)</option>
              <option value="EUR">Euro (€)</option>
              <option value="USD">Dólar ($)</option>
            </select>
          </div>

          {/* PAÍS */}
          <div>
            <label className="text-sm text-gray-400">País</label>
            <select className="w-full input">
              <option value="BR">Brasil</option>
              <option value="PT">Portugal</option>
              <option value="US">Estados Unidos</option>
            </select>
          </div>

          {/* IDIOMA */}
          <div>
            <label className="text-sm text-gray-400">Idioma</label>
            <select className="w-full input">
              <option value="pt-BR">Português (BR)</option>
              <option value="pt-PT">Português (PT)</option>
              <option value="en-US">Inglês</option>
            </select>
          </div>

        </div>

      </SettingsSection>

    </div>
  );
};

export default Settings;
