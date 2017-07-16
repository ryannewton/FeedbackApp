export const navigation = {
  brand:      'reactDirectorAdmin',
  leftLinks:  [],
  rightLinks: [
    {
      label:      'Home',
      link:       '/admin/',
      view:       'home',
      isRouteBtn: true
    },
    {
      label:      'About',
      link:       '/admin/about',
      view:       'about',
      isRouteBtn: true
    }
  ],
  sideMenu: [
    // Manage Menu
    {
      id: 1,
      group: 'Admin Console',
      menus: [
        {
          name: 'Approve',
          linkTo: '/admin/approve',
          faIconName: 'fa-check-square-o'
        },
        {
          name: 'Edit',
          linkTo: '/admin/edit',
          faIconName: 'fa-check-square'
        },
        {
          name: 'Dashboard',
          linkTo: '/admin/dashboard',
          faIconName: 'fa-comment'
        },
      ]
    },    
    // Profile Menu
    {
      id: 2,
      group: 'Profile',
      menus: [
        {
          name: 'Log in',
          linkTo: '/admin/sendCode',
          faIconName: 'fa-check-square-o'
        },
        {
          name: 'Log out',
          linkTo: '/admin/signout',
          faIconName: 'fa-check-square'
        },
      ]
    },
  ]
};
