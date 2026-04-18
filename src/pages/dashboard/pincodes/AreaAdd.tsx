import { FormPageHeader } from "@/components/shared";
import { ROUTES } from "@/core/config/routes";
import { AddArea } from "@/features/dashboard/pincodes";

export default function AreaAdd() {
    return (
        <div className="space-y-6">
            <FormPageHeader 
                title="Expand Service Network" 
                description="Register new delivery sub-zones and coordinates to enhance your logistics grid."
                backPath={ROUTES.DASHBOARD.PINCODES}
            />
            
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <AddArea />
            </div>
        </div>
    );
}
