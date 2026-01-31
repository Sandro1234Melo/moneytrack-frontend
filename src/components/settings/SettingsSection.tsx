type Props = {
  title: string;
  children: React.ReactNode;
};

const SettingsSection: React.FC<Props> = ({ title, children }) => {
  return (
    <section className="
      bg-surface-dark border border-[#12202a]
      rounded-xl p-4 space-y-4
    ">
      <h2 className="text-lg font-semibold">
        {title}
      </h2>

      {children}
    </section>
  );
};

export default SettingsSection;
