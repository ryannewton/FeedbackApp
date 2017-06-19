// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import componenets, functions, and styles
import ProjectAddition from './ProjectAddition';
import {
  addProjectUpvote,
  removeProjectUpvote,
  saveProjectChanges,
  deleteProject,
  addSolution,
  saveProjectAdditionChanges,
  deleteProjectAddition,
} from '../actions';

class Project extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      project: props.project,
    };

    this.titleChanged = this.titleChanged.bind(this);
    this.descriptionChanged = this.descriptionChanged.bind(this);
    this.projectUpvote = this.projectUpvote.bind(this);
    this.switchEditMode = this.switchEditMode.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.addSolution = this.addSolution.bind(this);
  }

  projectUpvote() {
    if (!this.props.projectUpvotes.includes(this.props.project.id)) {
      const project = { ...this.state.project, votes: this.state.project.votes + 1 };
      this.props.addProjectUpvote(project);
      this.props.saveProjectChanges(project, 'Added Upvote');
      this.setState({ project: { ...this.state.project, votes: this.state.project.votes + 1 } });
    }
    else {
      const project = { ...this.state.project, votes: this.state.project.votes - 1 };
      this.props.removeProjectUpvote(project);
      this.props.saveProjectChanges(project, 'Removed Upvote');
      this.setState({ project: { ...this.state.project, votes: this.state.project.votes - 1 } });
    }
  }

  switchEditMode() {
    if (this.state.editMode) {
      this.props.saveProjectChanges(this.state.project, 'Edited Text');
    }
    this.setState({ editMode: !this.state.editMode });
  }

  titleChanged(event) {
    this.setState({ project: { ...this.state.project, title: event.target.value } });
  }

  descriptionChanged(event) {
    this.setState({ project: { ...this.state.project, description: event.target.value } });
  }

  deleteProject() {
    this.props.deleteProject(this.state.project.id, 'Deleted Project');
  }

  addSolution() {
    this.props.addSolution(this.state.project.id, 'Added Solution');
  }

  render() {
    const project = this.state.project;
    const projectUpvoted = this.props.projectUpvotes.indexOf(this.props.project.id) !== -1;
    let title = <span className="h4"><strong>{'Comment: ' + this.state.project.title}</strong></span>;
    let description = <span style={{ width: '100%', whiteSpace: 'pre-wrap' }}>{this.state.project.description}</span>;
    if (this.state.editMode) {
      title = <input onChange={this.titleChanged} type="text" style={{ width: '75%' }} className="panel-title" value={this.state.project.title} />;
      description = <textarea onChange={this.descriptionChanged} style={{ width: '100%' }} value={this.state.project.description} />;
    }
    let voteButton = (
        <button type="button" className="btn btn-default btn-project pull-right" onClick={this.projectUpvote}>
          &nbsp;Up Vote!&nbsp;
          <span className="glyphicon glyphicon-thumbs-up"></span>&nbsp;
          <span className="numberCircle">{this.state.project.votes}</span>
        </button>
      );
    let votedButton = (
        <button type="button" className="btn btn-success btn-project pull-right" onClick={this.projectUpvote}>
          &nbsp;Voted&nbsp;
          <span className="glyphicon glyphicon-thumbs-up"></span>&nbsp;
          <span className="numberCircle">{this.state.project.votes}</span>
        </button>
      );

    let myProjectAdditions = this.props.projectAdditions.filter((projectAddition) => {
      return projectAddition.project_id === project.id;
    }).map(projectAddition =>
      <ProjectAddition
        projectAddition={projectAddition}
        deleteProjectAddition={this.props.deleteProjectAddition}
        saveProjectAdditionChanges={this.props.saveProjectAdditionChanges}
        key={projectAddition.id}
      />
    );

    let editButton =
      <button type="button"
        className="btn btn-primary pull-left"
        onClick={this.switchEditMode}
      >
        Edit
      </button>;
    let saveButton =
      <button type="button"
        className="btn btn-success pull-left"
        onClick={this.switchEditMode}
      >
        Save
      </button>;
    let deleteButton =
      <button type="button"
        className="btn btn-danger pull-right"
        onClick={this.deleteProject}
      >
        Delete
      </button>;
    let addSolution =
      <button type="button"
        className="btn btn-primary pull-right"
        onClick={this.addSolution}
      >
        Add Solution
      </button>;

    return (
      <div className="panel panel-default">
        <div className="panel-body" style={{ backgroundColor: '#f4f4f4' }}>
          <div className="clearfix" style={{ marginBottom: '5px' }}>
            {title}
            {projectUpvoted ? votedButton : voteButton}
          </div>
          <div className="panel-group" role="tablist">
            <div className="panel panel-default">
              <div className="panel-heading" role="tab">
                <h4 className="panel-title clearfix">
                  <a role="button" data-toggle="collapse" href={ '#project_' + this.props.project.id } aria-expanded="true">
                    Details
                  </a>
                  <a role="button" data-toggle="collapse" href={ '#project_' + this.props.project.id } className="glyphicon glyphicon-menu-down pull-right"></a>
                </h4>
              </div>
              <div id={'project_' + this.props.project.id} className="panel-collapse collapse in" role="tabpanel">
                <div className="panel-body">
                  {description}
                </div>
              </div>
            </div>
            {myProjectAdditions}
          </div>
          {this.state.editMode ? deleteButton : addSolution}
          {this.state.editMode ? saveButton : editButton}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const projectUpvotes = state.user.projectUpvotes;
  const projectAdditions = state.projectAdditions;
  return { projectUpvotes, projectAdditions };
};

export default connect(mapStateToProps, {
  addProjectUpvote,
  removeProjectUpvote,
  saveProjectChanges,
  deleteProject,
  addSolution,
  saveProjectAdditionChanges,
  deleteProjectAddition,
})(Project);
