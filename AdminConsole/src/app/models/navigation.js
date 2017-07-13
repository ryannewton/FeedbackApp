export const navigation = {
  brand:      'reactDirectorAdmin',
  leftLinks:  [],
  rightLinks: [
    {
      label:      'Home',
      link:       '/',
      view:       'home',
      isRouteBtn: true
    },
    {
      label:      'About',
      link:       '/about',
      view:       'about',
      isRouteBtn: true
    }
  ],
  sideMenu: [
    // group menu #1
    {
      id: 1,
      group: 'Manage',
      menus: [
        {
          name: 'Approve Feedback',
          linkTo: '/approveFeedback',
          faIconName: 'fa-check-square-o'
        },
        {
          name: 'Approve Solutions',
          linkTo: '/approveSolutions',
          faIconName: 'fa-check-square'
        },
        {
          name: 'Official Reply',
          linkTo: '/officialReply',
          faIconName: 'fa-comment'
        },
      ]
    },
    // group menu #2
    {
      id: 2,
      group: 'Dashboard',
      menus: [
        {
          name: 'Dashboard',
          linkTo: '/dashboard',
          faIconName: 'fa-bar-chart'
        },
      ]
    },
  ]
};
