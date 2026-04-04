import { FormPageHeader } from "@/components/shared";
import { ROUTES } from "@/core/config/routes";
import { AddWarehouse } from "@/features/dashboard/warehouses";

export default function WarehouseAdd() {
    return (
        <div className="space-y-6">
            <FormPageHeader 
                title="Register New Warehouse Hub" 
                description="Complete the registration form to add a new storage or logistics facility to your global network."
                backPath={ROUTES.DASHBOARD.WAREHOUSES}
            />
            
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <AddWarehouse />
            </div>
        </div>
    );
}
