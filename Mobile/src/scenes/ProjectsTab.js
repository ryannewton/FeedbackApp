// Import Libraries
import { StackNavigator } from 'react-navigation';

// Import Scenes
import Projects from './Projects';
import ProjectDetails from './ProjectDetails';

const ProjectsTab = StackNavigator({
  Projects: { screen: Projects },
  Details: { screen: ProjectDetails },
});

export default ProjectsTab;
