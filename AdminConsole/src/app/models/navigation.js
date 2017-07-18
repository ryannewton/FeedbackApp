export const navigation = {
  brand:      'reactDirectorAdmin',
  leftLinks:  [],
  rightLinks: [
    {
      label:      'Home',
      link:       '/admin/',
      view:       'home',
      isRouteBtn: true,
    },
    {
      label:      'About',
      link:       '/admin/about',
      view:       'about',
      isRouteBtn: true,
    }
  ],
  sideMenu: [
    // Manage Menu
    {
      id: 1,
      group: 'Pages',
      menus: [
        {
          name: 'Dashboard',
          linkTo: '/admin/dashboard',
          faIconName: 'fa-dashboard',
        },
        {
          name: 'Approve',
          linkTo: '/admin/approve',
          faIconName: 'fa-check-square-o',
        },
      ],
    },
  ],
};
