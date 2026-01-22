import { Button } from "@/components/ui/button";
interface ProviderButtonsProps {
  onProviderClick?: (provider: string) => void;
}
export const ProviderButtons = ({
  onProviderClick
}: ProviderButtonsProps) => {
  const providers = [{
    name: "Google",
    icon: "🔍"
  }, {
    name: "Auth0",
    icon: "🔐"
  }, {
    name: "Cognito",
    icon: "🔒"
  }];
  return <div className="flex gap-2 justify-center pt-4">
      {providers.map(provider => null)}
    </div>;
};