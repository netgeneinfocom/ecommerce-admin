import { LayoutDashboard, Package, ShoppingCart, Users, FolderOpen, Layers, Tag, ClipboardList, Megaphone } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, useSidebar } from "@/components/ui/sidebar";
import { ProfileMenu } from "@/components/shared/ProfileMenu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ROUTES } from "@/core/config/routes";
import { Ripple } from "@/components/ui/ripple";

const dashboardItems = [{
  title: "Dashboard",
  url: ROUTES.DASHBOARD.HOME,
  icon: LayoutDashboard
}, {
  title: "Users",
  url: ROUTES.DASHBOARD.USERS,
  icon: Users
}, {
  title: "Products",
  url: ROUTES.DASHBOARD.PRODUCTS,
  icon: Package
}, {
  title: "Categories",
  url: ROUTES.DASHBOARD.CATEGORIES,
  icon: FolderOpen
}, {
  title: "SubCategories",
  url: ROUTES.DASHBOARD.SUBCATEGORIES,
  icon: Layers
}, {
  title: "Brand",
  url: ROUTES.DASHBOARD.BRAND,
  icon: Tag
}, {
  title: "Orders",
  url: ROUTES.DASHBOARD.ORDERS,
  icon: ShoppingCart
}, {
  title: "Inventory",
  url: ROUTES.DASHBOARD.INVENTORY,
  icon: ClipboardList
}, {
  title: "Promotions",
  url: ROUTES.DASHBOARD.PROMOTIONS,
  icon: Megaphone
}];

export function AppSidebar() {
  const {
    open,
    isMobile,
    setOpenMobile
  } = useSidebar();

  const handleItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return <Sidebar collapsible="icon" className="border-r border-border/10 shadow-lg bg-card data-[state=collapsed]:w-24 data-[state=expanded]:w-48">
    <SidebarContent>
      {/* Logo/Brand Section */}
      <div className={`px-4 ${open ? 'py-6' : 'py-4'}`}>
        {open ? <div className="flex items-baseline gap-1">
          <h1 className="text-2xl font-bold text-primary">Able</h1>
          <span className="text-xs text-muted-foreground font-semibold px-1.5 py-0.5 bg-primary/10 rounded">
            PRO
          </span>
        </div> : <div className="flex justify-center">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
            A
          </div>
        </div>}
      </div>

      {/* Dashboard Section */}
      <SidebarGroup>
        {open}
        <SidebarGroupContent>
          <SidebarMenu className="space-y-2">
            {dashboardItems.map(item => <SidebarMenuItem key={item.title}>
              <Ripple>
                <SidebarMenuButton asChild tooltip={item.title} className="h-11">
                  <NavLink to={item.url} end={item.url === ROUTES.DASHBOARD.HOME} className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200" activeClassName="bg-primary/10 text-primary font-medium border-l-4 border-primary shadow-sm" onClick={handleItemClick}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </Ripple>
            </SidebarMenuItem>)}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    {/* Footer Profile Section */}
    <SidebarFooter className="border-t">
      <SidebarMenu>
        <SidebarMenuItem>
          <div className={`p-2 ${!open && "flex justify-center"}`}>
            <ProfileMenu variant={open ? "full" : "icon"} />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>;
}