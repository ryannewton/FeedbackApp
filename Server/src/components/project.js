import React from 'react';
import ProjectAddition from './project_addition';

export default class Project extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit_mode: false,
      project: props.project,
    };

    this.titleChanged = this.titleChanged.bind(this);
    this.descriptionChanged = this.descriptionChanged.bind(this);
    this.upVote = this.upVote.bind(this);
    this.switchEditMode = this.switchEditMode.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.addSolution = this.addSolution.bind(this);
  }

  upVote() {
    const project = this.state.project;
    if (this.props.upVotes.indexOf(this.props.project.id) === -1) {
      project.votes += 1;
      this.props.addUpVote(this.props.project.id);
    }
    else {
      project.votes -= 1;
      this.props.removeUpVote(this.props.project.id);
    }
    this.props.saveProjectChanges(project, 'upvote');
  }

  switchEditMode() {
    if (this.state.edit_mode) {
      this.props.saveProjectChanges(this.state.project, 'text_edit');
    }
    this.setState({ edit_mode: !this.state.edit_mode });
  }

  titleChanged(event) {
    const project = this.state.project;
    project.title = event.target.value;
    this.setState({ project });
  }

  descriptionChanged(event) {
    const project = this.state.project;
    project.description = event.target.value;
    this.setState({ project });
  }

  deleteProject() {
    this.props.deleteProject(this.state.project.id, 'delete_project');
  }

  addSolution() {
    this.props.addSolution(this.state.project.id, 'addSolution');
  }

  render() {
    const project = this.state.project;
    const upVoted = (this.props.upVotes.indexOf(this.props.project.id) !== -1);
    let title = <span className="h4"><strong>{'Comment: ' + this.state.project.title}</strong></span>;
    let description = <span style={{ width: '100%', whiteSpace: 'pre-wrap' }}>{this.state.project.description}</span>;
    if (this.state.edit_mode) {
      title = <input onChange={this.titleChanged} type="text" style={{ width: '75%' }} className="panel-title" value={this.state.project.title} />;
      description = <textarea onChange={this.descriptionChanged} style={{ width: '100%' }} value={this.state.project.description} />;
    }
    let voteButton = (
        <button type="button" className="btn btn-default btn-project pull-right" onClick={this.upVote}>
          &nbsp;Up Vote!&nbsp;
          <span className="glyphicon glyphicon-thumbs-up"></span>&nbsp;
          <span className="numberCircle">{this.state.project.votes}</span>
        </button>
      );
    let votedButton = (
        <button type="button" className="btn btn-success btn-project pull-right" onClick={this.upVote}>
          &nbsp;Voted&nbsp;
          <span className="glyphicon glyphicon-thumbs-up"></span>&nbsp;
          <span className="numberCircle">{this.state.project.votes}</span>
        </button>
      );

    let myProjectAdditions = this.props.projectAdditions.filter((projectAddition) => {
      return projectAddition.project_id === project.id
    }).map((projectAddition) => {
      return <ProjectAddition projectAddition={projectAddition} deleteProjectAddition={this.props.deleteProjectAddition} saveProjectAdditionChanges={this.props.saveProjectAdditionChanges} key={projectAddition.id} />
    });

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
            {upVoted ? votedButton : voteButton}
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
          {this.state.edit_mode ? deleteButton : addSolution}
          {this.state.edit_mode ? saveButton : editButton}
        </div>
      </div>
    );
  }
}
