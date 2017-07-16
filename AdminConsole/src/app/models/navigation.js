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
      group: 'Manage',
      menus: [
        {
          name: 'Approve Feedback',
          linkTo: '/admin/approveFeedback',
          faIconName: 'fa-check-square-o'
        },
        {
          name: 'Approve Solutions',
          linkTo: '/admin/approveSolutions',
          faIconName: 'fa-check-square'
        },
        {
          name: 'Edit & Delete',
          linkTo: '/admin/edit',
          faIconName: 'fa-comment'
        },
      ]
    },
    // Insights Menu
    {
      id: 2,
      group: 'Insights & Actions',
      menus: [
        {
          name: 'Key Stats',
          linkTo: '/admin/keystats',
          faIconName: 'fa-bar-chart'
        },
        {
          name: 'Dashboard',
          linkTo: '/admin/dashboard',
          faIconName: 'fa-bar-chart'
        },
        {
          name: 'Respond',
          linkTo: '/admin/respond',
          faIconName: 'fa-comment'
        },
        {
          name: 'Form a Focus Group',
          linkTo: '/admin/focusgroup',
          faIconName: 'fa-comment'
        },
      ]
    },
    // Profile Menu
    {
      id: 3,
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
