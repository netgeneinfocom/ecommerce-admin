import { FormPageHeader } from "@/components/shared";
import { ROUTES } from "@/core/config/routes";
import { AddPincode } from "@/features/dashboard/pincodes";

export default function PincodeAdd() {
    return (
        <div className="space-y-6">
            <FormPageHeader 
                title="Expand Service Network" 
                description="Register a new pincode to enable delivery services in this area."
                backPath={ROUTES.DASHBOARD.PINCODES}
            />
            
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <AddPincode />
            </div>
        </div>
    );
}
