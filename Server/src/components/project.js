import React from 'react';

export default class Project extends React.Component {
  constructor(props) {
    super(props);

    //TO DO - STATE SHOULD NOT REFERENCE PROPS
    this.state = {
      edit_mode: false,
      project: props.project,
    }
  }

  upVote(event) {
  	let project = this.state.project;
  	if (this.props.upVotes.indexOf(this.props.project.id) === -1) {
	    project.votes += 1;
	    this.props.addUpVote(this.props.project.id);
	  }
	  else {
	  	project.votes -= 1;
	    this.props.removeUpVote(this.props.project.id);
	  }
    this.props.saveProjectChanges(project);
  }

  switchEditMode(event) {
    if (this.state.edit_mode) {
      this.props.saveProjectChanges(this.state.project);
    }
    this.setState({edit_mode: !this.state.edit_mode});
  }

  titleChanged(event) {
    let project = this.state.project;
    project.title = event.target.value;
    this.setState({project});
  }

  descriptionChanged(event) {
    let project = this.state.project;
    project.description = event.target.value;
    this.setState({project});
  }

  deleteProject(event) {
    this.props.deleteProject(this.state.project.id);
  }

  render() {

  	let up_voted = (this.props.upVotes.indexOf(this.props.project.id) !== -1);
    let title = <h3 style={{width: "75%"}} className="panel-title">{this.state.project.title}</h3>;
    let description = <span style={{width: "100%", whiteSpace: 'pre-wrap'}}>{this.state.project.description}</span>;
    if (this.state.edit_mode) {
      title = <input onChange={this.titleChanged.bind(this)} type="text" style={{width: "75%"}} className="panel-title" value={this.state.project.title} />;
      description = <textarea onChange={this.descriptionChanged.bind(this)} style={{width: "100%"}} value={this.state.project.description} />
    }
    let vote_button = (
	    	<button type="button" className="btn btn-default btn-project pull-right" onClick={this.upVote.bind(this)}>
          &nbsp;Up Vote!&nbsp;
          <span className="glyphicon glyphicon-thumbs-up"></span>&nbsp;
          <span className="numberCircle">{this.state.project.votes}</span>
        </button>
    	);
    let voted_button = (
	    	<button type="button" className="btn btn-success btn-project pull-right" onClick={this.upVote.bind(this)}>
          &nbsp;Voted&nbsp;
          <span className="glyphicon glyphicon-thumbs-up"></span>&nbsp;
          <span className="numberCircle">{this.state.project.votes}</span>
        </button>
    	);

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          {title}
          {up_voted ? voted_button : vote_button}
        </div>
        <div className="panel-body">
          {description}
          <a onClick={this.deleteProject.bind(this)} className="pull-right link-edit">{this.state.edit_mode ? "Delete" : ""}</a>
          <a onClick={this.switchEditMode.bind(this)} className="pull-right link-edit">{this.state.edit_mode ? "Save" : "Edit"}</a>          
        </div>          
      </div>
    );
  }
}