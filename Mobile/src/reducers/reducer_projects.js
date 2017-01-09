'use strict';

export default function projects(state = [], action) {
  switch (action.type) {
    case 'REQUESTED_PROJECTS':
      return state;
      break;
    case 'RECEIVED_PROJECTS':
      return action.projects;
      break;
    case 'SAVE_PROJECT_CHANGES':
      let index = state.findIndex((project) => {
        return project.id === action.project.id;
      });
      let new_state = state.slice(0);
      new_state.splice(index, 1, action.project);
      return new_state;
      break;
    case 'ADD_PROJECT':
      return state.splice(state.length-1, 0, {id: action.id, title: "Blank Title", description: "Blank Description", votes: 0});
      break;
    case 'DELETE_PROJECT':
      return state.filter((project) => { return project.id !== action.id; });
      break;
    default:
      return state;
  }
}
