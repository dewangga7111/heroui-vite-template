export const breadcrumbsItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    label: "Settings",
    children: [
      {
        label: "Users",
        path: "/dashboard/users",
        children: [
          {
            label: "Add Users",
            path: "/dashboard/users/add",
          },
          {
            label: "Edit Users",
            path: "/dashboard/users/edit",
          }
        ]
      },
      {
        label: "Roles",
        path: "/dashboard/roles",
        children: [
          {
            label: "Add Roles",
            path: "/dashboard/roles/add",
          },
          {
            label: "Edit Roles",
            path: "/dashboard/roles/edit",
          },
          {
            label: "Edit Permission",
            path: "/dashboard/roles/permission",
          }
        ]
      },
    ],
  },
];
