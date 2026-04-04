import { FormPageHeader } from "@/components/shared";
import { ROUTES } from "@/core/config/routes";
import { EditPincode } from "@/features/dashboard/pincodes";

export default function PincodeEdit() {
    return (
        <div className="space-y-6">
            <FormPageHeader 
                title="Service Network Permissions" 
                description="Manage global availability for your service hubs."
                backPath={ROUTES.DASHBOARD.PINCODES}
            />
            
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <EditPincode />
            </div>
        </div>
    );
}
