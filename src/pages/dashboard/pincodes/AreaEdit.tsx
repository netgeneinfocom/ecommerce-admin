import { FormPageHeader } from "@/components/shared";
import { ROUTES } from "@/core/config/routes";
import { EditArea } from "@/features/dashboard/pincodes";

export default function AreaEdit() {
    return (
        <div className="space-y-6">
            <FormPageHeader 
                title="Edit Suburb Area" 
                description="Update geographic coordinates and service status for this specific delivery zone."
                backPath={ROUTES.DASHBOARD.PINCODES}
            />
            
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <EditArea />
            </div>
        </div>
    );
}
