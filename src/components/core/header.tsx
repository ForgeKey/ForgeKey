import ThemeToggle from '@/components/core/theme-toggle';

export const Header = () => {
  return (
    <div className="h-[60px] flex justify-between items-center px-4">
      <h1 className="text-lg dark:text-secondary font-semibold">ForgeKey</h1>
      <div className="flex space-x-2">
        <ThemeToggle />
      </div>
    </div>
  );
};
