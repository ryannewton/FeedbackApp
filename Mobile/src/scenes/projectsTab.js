// Import Libraries
import { StackNavigator } from 'react-navigation';

// Import Scenes
import Projects from './projects';
import ProjectDetails from './project_details';

const ProjectsTab = StackNavigator({
  Projects: { screen: Projects },
  Details: { screen: ProjectDetails },
});

export default ProjectsTab;
