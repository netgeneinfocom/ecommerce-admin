import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/core/hooks/use-toast";
import { FormPageHeader, FormActions } from "@/components/shared";
import { ROUTES } from "@/core/config/routes";
import { userService } from "@/features/dashboard/users";
import { Loader } from "@/components/loader/Loader";
import { useAuth } from "@/features/auth/hooks";

type UserFormData = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  role: "admin" | "superadmin";
};

export default function UserAdd() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<UserFormData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    role: "admin",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const canAddSuperAdmin = user?.permission?.[0]?.can_add_superadmin ?? false;
  const canAddAdmin = user?.permission?.[0]?.can_add_admin ?? false;

  const isRoleAllowed = (formData.role === 'admin' && canAddAdmin) || (formData.role === 'superadmin' && canAddSuperAdmin);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      toast({
        title: "Error",
        description: "First name and last name are required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Error",
        description: "Valid email is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.password.trim()) {
      toast({
        title: "Error",
        description: "Password is required",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await userService.createUser(formData);

      toast({
        title: "User added",
        description: "The new user has been added successfully.",
      });

      navigate(ROUTES.DASHBOARD.USERS);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add user",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormPageHeader
        title="Add New User"
        description="Fill in the details to add a new user"
        backPath={ROUTES.DASHBOARD.USERS}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic User Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="e.g., Tariq"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="e.g., Mir"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g., tariq@gmail.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                placeholder="e.g., 123467889"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <PasswordInput
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
                required
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 6 characters long
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "admin" | "superadmin") =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <FormActions
          cancelPath={ROUTES.DASHBOARD.USERS}
          submitLabel="Add User"
          isSubmitting={isSubmitting}
          disabled={!isRoleAllowed}
          disabledTooltip={!isRoleAllowed ? `You are ${user?.role}, you cannot add ${formData.role}s` : undefined}
        />
      </form>
      {isSubmitting && <Loader fullScreen message="Adding user..." />}
    </div>
  );
}
