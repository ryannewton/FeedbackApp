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
      group: 'Dashboard  ',
      menus: [
        {
          name: 'Dashboard preview',
          linkTo: '/',
          faIconName: 'fa-eye'
        },
        {
          name: 'Add Replies',
          linkTo: '/Dashboard/statsCard',
          faIconName: 'fa-check-square-o'
        },
        {
          name: 'Approve Solutions',
          linkTo: '/Dashboard/teamMates',
          faIconName: 'fa-user'
        },
        {
          name: 'Approve Feedback',
          linkTo: '/Dashboard/todoList',
          faIconName: 'fa-check'
        },
      ]
    }
  ]
}
