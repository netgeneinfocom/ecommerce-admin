import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/core/hooks/use-toast";
import { FormPageHeader, FormActions } from "@/components/shared";
import { ROUTES } from "@/core/config/routes";
import { Loader } from "@/components/loader/Loader";
import { userService } from "@/features/dashboard/users/services/userService";
import { User, UserFormData } from "@/features/dashboard/users/types";

export default function UserEdit() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<UserFormData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    role: "admin",
  });

  const { data: usersData, isLoading: isFetching } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getUsers(),
    enabled: !!userId,
  });

  useEffect(() => {
    if (usersData?.users && userId) {
      const user = usersData.users.find((u) => u._id === userId);
      if (user) {
        setFormData({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone_number: user.phone_number || "",
          role: user.role as "admin" | "superadmin" | "customer",
          password: "", // Don't populate password
        });
      }
    }
  }, [usersData, userId]);

  const updateMutation = useMutation({
    mutationFn: (data: UserFormData) => userService.updateUser(userId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      navigate(ROUTES.DASHBOARD.USERS);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      toast({
        title: "Error",
        description: "First name and last name are required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Error",
        description: "Valid email is required",
        variant: "destructive",
      });
      return;
    }

    if (formData.password && formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    const submitData = { ...formData };
    if (!submitData.password) {
      delete submitData.password;
    }

    updateMutation.mutate(submitData);
  };

  if (isFetching) {
    return <Loader fullScreen message="Fetching user details..." />;
  }

  return (
    <div className="space-y-6">
      <FormPageHeader
        title="Edit User"
        description="Update user information"
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
            <CardTitle>Security & Role</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password (leave blank to keep current)</Label>
              <PasswordInput
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter new password"
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
          submitLabel="Update User"
          isSubmitting={updateMutation.isPending}
        />
      </form>
      {updateMutation.isPending && <Loader fullScreen message="Updating user..." />}
    </div>
  );
}
