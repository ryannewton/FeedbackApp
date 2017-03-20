import React from 'react';
import Project_Addition from './project_addition.js';

export default class Project extends React.Component {
	constructor(props) {
		super(props);

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
		this.props.saveProjectChanges(project, 'upvote');
	}

	switchEditMode(event) {
		if (this.state.edit_mode) {
			this.props.saveProjectChanges(this.state.project, 'text_edit');
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
		this.props.deleteProject(this.state.project.id, 'delete_project');
	}

	addSolution(event) {
		this.props.addSolution(this.state.project.id, 'add_solution');
	}

	render() {
		let project = this.state.project;
		let up_voted = (this.props.upVotes.indexOf(this.props.project.id) !== -1);
		let title = <span className="h4"><strong>{'Comment: ' + this.state.project.title}</strong></span>;
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

		let my_project_additions = this.props.project_additions.filter((project_addition) => {
			return project_addition.project_id === project.id
		}).map((project_addition) => {
			return <Project_Addition project_addition={project_addition} deleteProjectAddition={this.props.deleteProjectAddition} saveProjectAdditionChanges={this.props.saveProjectAdditionChanges} key={project_addition.id} />
		});

		let edit_button = (<button type="button" className="btn btn-primary pull-left" onClick={this.switchEditMode.bind(this)}>Edit</button>);
		let save_button = (<button type="button" className="btn btn-success pull-left" onClick={this.switchEditMode.bind(this)}>Save</button>);
		let delete_button = (<button type="button" className="btn btn-danger pull-right" onClick={this.deleteProject.bind(this)}>Delete</button>);
		let add_solution = (<button type="button" className="btn btn-primary pull-right" onClick={this.addSolution.bind(this)}>Add Solution</button>);


		return (      
			<div className="panel panel-default">
				<div className="panel-body" style={{backgroundColor: '#f4f4f4'}}>
					<div className="clearfix" style={{marginBottom: '5px'}}>
						{title}
						{up_voted ? voted_button : vote_button}
					</div>
					<div className="panel-group" role="tablist">
						<div className="panel panel-default">
							<div className="panel-heading" role="tab">
								<h4 className="panel-title clearfix">
									<a role="button" data-toggle="collapse" href={'#project_' + this.props.project.id} aria-expanded="true">
										Details
									</a>
									<a role="button" data-toggle="collapse" href={"#project_" + this.props.project.id} className="glyphicon glyphicon-menu-down pull-right"></a>
								</h4>
							</div>
							<div id={'project_' + this.props.project.id} className="panel-collapse collapse in" role="tabpanel">
								<div className="panel-body">
									{description}                  
								</div>
							</div>
						</div>  
						{my_project_additions}   
					</div>
					{this.state.edit_mode ? delete_button : add_solution}
					{this.state.edit_mode ? save_button : edit_button}
				</div>
			</div>
		);
	}
}