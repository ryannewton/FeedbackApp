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
      group: 'Admin Console',
      menus: [
        {
          name: 'Dashboard',
          linkTo: '/admin/dashboard',
          faIconName: 'fa-comment',
        },
        {
          name: 'Approve',
          linkTo: '/admin/approve',
          faIconName: 'fa-check-square-o',
        },
        {
          name: 'Edit',
          linkTo: '/admin/edit',
          faIconName: 'fa-check-square',
        },
      ],
    },
    // Profile Menu
    {
      id: 2,
      group: 'Profile',
      menus: [
        {
          name: 'Log in',
          linkTo: '/admin/login',
          faIconName: 'fa-check-square-o',
        },
        {
          name: 'Log out',
          linkTo: '/admin/logout',
          faIconName: 'fa-check-square',
        },
      ],
    },
  ],
};
