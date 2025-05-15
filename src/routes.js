import React from 'react';

export const Routes = {
    // pages
    User: { path: "/dashboard/overview" },
    Employee: { path: "/employee" },
    EmployeeNew: { path: "/employee/create" },
    EmployeeDetail: { path: "/employee/:id" },
    EmployeeEdit: { path: "/employee/:id/edit" },
    Settings: { path: "/settings" },
    Upgrade: { path: "/upgrade" },
    BootstrapTables: { path: "/tables/bootstrap-tables" },
    Billing: { path: "/billing" },
    Invoice: { path: "/invoice" },
    Signin: { path: "/sign-in" },
    Signup: { path: "/sign-up" },
    ForgotPassword: { path: "/forgot-password" },
    ResetPassword: { path: "/reset-password" },
    Lock: { path: "/lock" },
    NotFound: { path: "/404" },
    ServerError: { path: "/500" },
    User: {
        path: "/users",
        component: React.lazy(() => import("./pages/User"))
    },
    UserNew: {
        path: "/users/new",
        component: React.lazy(() => import("./pages/UserNew"))
    },
    UserDetail: {
        path: "/users/:id",
        component: React.lazy(() => import("./pages/UserDetail"))
    },
    UserEdit: {
        path: "/users/:id/edit",
        component: React.lazy(() => import("./pages/UserEdit"))
    },
    UserRole: { path: "/users-role" },
    UserRoleNew: { path: "/users-role/create" },
    UserRoleEdit: { path: "/users-role/:id/edit" },
    UserRoleDetail: { path: "/users-role/:id" },
    ContractType: {
        path: "/contract-types",
        component: React.lazy(() => import("./pages/ContractType")),
    },
    ContractTypeNew: {
        path: "/contract-types/new",
        component: React.lazy(() => import("./pages/ContractTypeNew")),
    },
    ContractTypeEdit: {
        path: "/contract-types/:id/edit",
        component: React.lazy(() => import("./pages/ContractTypeEdit")),
    },
    Contract: {
        path: "/contracts",
        component: React.lazy(() => import("./pages/Contract")),
    },
    ContractNew: {
        path: "/contracts/new",
        component: React.lazy(() => import("./pages/ContractNew")),
    },
    ContractDetail: {
        path: "/contracts/:id",
        component: React.lazy(() => import("./pages/ContractDetail")),
    },
    ContractEdit: {
        path: "/contracts/:id/edit",
        component: React.lazy(() => import("./pages/ContractEdit")),
    },
    JobTitle: {
        path: "/job-titles",
        component: React.lazy(() => import("./pages/JobTitle")),
    },
    JobTitleNew: {
        path: "/job-titles/new",
        component: React.lazy(() => import("./pages/JobTitleNew")),
    },
    JobTitleDetail: {
        path: "/job-titles/:id",
        component: React.lazy(() => import("./pages/JobTitleDetail")),
    },
    JobTitleEdit: {
        path: "/job-titles/:id/edit",
        component: React.lazy(() => import("./pages/JobTitleEdit")),
    },

    // docs
    DocsOverview: { path: "/documentation/overview" },
    DocsDownload: { path: "/documentation/download" },
    DocsQuickStart: { path: "/documentation/quick-start" },
    DocsLicense: { path: "/documentation/license" },
    DocsFolderStructure: { path: "/documentation/folder-structure" },
    DocsBuild: { path: "/documentation/build-tools" },
    DocsChangelog: { path: "/documentation/changelog" },

    // components
    Accordions: { path: "/components/accordions" },
    Alerts: { path: "/components/alerts" },
    Badges: { path: "/components/badges" },
    Widgets: { path: "/widgets" },
    Breadcrumbs: { path: "/components/breadcrumbs" },
    Buttons: { path: "/components/buttons" },
    Forms: { path: "/components/forms" },
    Modals: { path: "/components/modals" },
    Navs: { path: "/components/navs" },
    Navbars: { path: "/components/navbars" },
    Pagination: { path: "/components/pagination" },
    Popovers: { path: "/components/popovers" },
    Progress: { path: "/components/progress" },
    Tables: { path: "/components/tables" },
    Tabs: { path: "/components/tabs" },
    Tooltips: { path: "/components/tooltips" },
    Toasts: { path: "/components/toasts" },
    WidgetsComponent: { path: "/components/widgets" }
};