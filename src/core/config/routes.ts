import { lazy } from "react";

// Lazy load page components
const Index = lazy(() => import("@/pages/Index"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Error = lazy(() => import("@/pages/Error"));
const Dashboard = lazy(() => import("@/pages/dashboard/dashboard/Dashboard"));
const DashboardHome = lazy(() => import("@/pages/dashboard/dashboard/DashboardHome"));
const Products = lazy(() => import("@/pages/dashboard/products/Products"));
const ProductAdd = lazy(() => import("@/pages/dashboard/products/ProductAdd"));
const ProductEdit = lazy(() => import("@/pages/dashboard/products/ProductEdit"));
const Orders = lazy(() => import("@/pages/dashboard/orders/Orders"));
const OrderDetail = lazy(() => import("@/pages/dashboard/orders/OrderDetail"));
const Categories = lazy(() => import("@/pages/dashboard/categories/Categories"));
const CategoryAdd = lazy(() => import("@/pages/dashboard/categories/CategoryAdd"));
const CategoryEdit = lazy(() => import("@/pages/dashboard/categories/CategoryEdit"));
const SubCategories = lazy(() => import("@/pages/dashboard/subcategories/SubCategories"));
const SubCategoryAdd = lazy(() => import("@/pages/dashboard/subcategories/SubCategoryAdd"));
const SubCategoryEdit = lazy(() => import("@/pages/dashboard/subcategories/SubCategoryEdit"));
const Brands = lazy(() => import("@/pages/dashboard/brands/Brands"));
const BrandAdd = lazy(() => import("@/pages/dashboard/brands/BrandAdd"));
const BrandEdit = lazy(() => import("@/pages/dashboard/brands/BrandEdit"));
const Users = lazy(() => import("@/pages/dashboard/users/Users"));
const UserAdd = lazy(() => import("@/pages/dashboard/users/UserAdd"));
const UserEdit = lazy(() => import("@/pages/dashboard/users/UserEdit"));
const Inventory = lazy(() => import("@/pages/dashboard/inventory/Inventory"));
const Promotions = lazy(() => import("@/pages/dashboard/promotions/Promotions"));

// Route path constants
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: {
    HOME: "/dashboard",
    USERS: "/dashboard/users",
    USERS_ADD: "/dashboard/users/add",
    USERS_EDIT: "/dashboard/users/edit",
    PRODUCTS: "/dashboard/products",
    PRODUCTS_ADD: "/dashboard/products/add",
    PRODUCTS_EDIT: (id: string) => `/dashboard/products/edit/${id}`,
    CATEGORIES: "/dashboard/categories",
    CATEGORIES_ADD: "/dashboard/categories/add",
    CATEGORIES_EDIT: "/dashboard/categories/edit",
    SUBCATEGORIES: "/dashboard/subcategories",
    SUBCATEGORIES_ADD: "/dashboard/subcategories/add",
    SUBCATEGORIES_EDIT: "/dashboard/subcategories/edit",
    BRAND: "/dashboard/brand",
    BRAND_ADD: "/dashboard/brand/add",
    BRAND_EDIT: "/dashboard/brand/edit",
    ORDERS: "/dashboard/orders",
    ORDER_DETAIL: (id: string) => `/dashboard/orders/${id}`,
    INVENTORY: "/dashboard/inventory",
    PROMOTIONS: "/dashboard/promotions",
  },
} as const;

// Route configuration with component mappings
export interface RouteConfig {
  path: string;
  element: React.LazyExoticComponent<() => JSX.Element>;
  index?: boolean;
  children?: RouteConfig[];
}

export const routeConfig: RouteConfig[] = [
  {
    path: ROUTES.HOME,
    element: Login,
  },
  {
    path: ROUTES.LOGIN,
    element: Login,
  },
  {
    path: ROUTES.DASHBOARD.HOME,
    element: Dashboard,
    children: [
      {
        path: "",
        element: DashboardHome,
        index: true,
      },
      // Users
      {
        path: "users",
        element: Users,
      },
      {
        path: "users/add",
        element: UserAdd,
      },
      {
        path: "users/edit",
        element: UserEdit,
      },
      // Products
      {
        path: "products",
        element: Products,
      },
      {
        path: "products/add",
        element: ProductAdd,
      },
      {
        path: "products/edit/:productId",
        element: ProductEdit,
      },
      // Categories
      {
        path: "categories",
        element: Categories,
      },
      {
        path: "categories/add",
        element: CategoryAdd,
      },
      {
        path: "categories/edit",
        element: CategoryEdit,
      },
      // SubCategories
      {
        path: "subcategories",
        element: SubCategories,
      },
      {
        path: "subcategories/add",
        element: SubCategoryAdd,
      },
      {
        path: "subcategories/edit",
        element: SubCategoryEdit,
      },
      // Brands
      {
        path: "brand",
        element: Brands,
      },
      {
        path: "brand/add",
        element: BrandAdd,
      },
      {
        path: "brand/edit",
        element: BrandEdit,
      },
      // Orders
      {
        path: "orders",
        element: Orders,
      },
      {
        path: "orders/:orderId",
        element: OrderDetail,
      },
      // Inventory
      {
        path: "inventory",
        element: Inventory,
      },
      // Promotions
      {
        path: "promotions",
        element: Promotions,
      },
    ],
  },
];

// Error route
export const errorRoute: RouteConfig = {
  path: "*",
  element: Error,
};
