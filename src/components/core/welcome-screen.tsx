import { Button } from '@/components/ui/button';
import { PAGE_MIN_HEIGHT } from '@/lib/constants';
import { useNavigation } from '@/hooks/router/use-navigation';
import { ROUTES } from '@/router/types';
import Image from 'next/image';

export const WelcomeScreen = () => {
  const { navigate } = useNavigation();

  const handleGetStarted = () => {
    navigate({ name: ROUTES.GROUP_CREATE });
  };

  return (
    <div className={`p-3 flex flex-col h-full ${PAGE_MIN_HEIGHT}`}>
      {/* Content - centered */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        {/* App Icon */}
        <div>
          <Image
            src="/icon.png"
            alt="ForgeKey"
            width={56}
            height={56}
            className="rounded-2xl"
          />
        </div>

        {/* Welcome Text */}
        <div className="text-center space-y-2 max-w-xs px-3">
          <h1 className="text-lg font-semibold text-white">
            Welcome to ForgeKey
          </h1>
          <p className="text-xs text-white/60 leading-relaxed">
            Create a Workspace to organize your keystores for each project or environment.
          </p>
        </div>
      </div>

      {/* Get Into Button - fixed at bottom */}
      <div className="w-full pt-3">
        <Button
          onClick={handleGetStarted}
          className="w-full rounded-md h-9"
        >
          Get Into
        </Button>
      </div>
    </div>
  );
};
