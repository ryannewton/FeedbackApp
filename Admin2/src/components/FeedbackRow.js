import React from 'react';
// import Autocomplete from 'react-autocomplete';

export default class FeedbackRow extends React.Component {

  createProjectFromFeedback() {
    this.props.addProject(this.props.feedback, 'add project from feedback page on website');
    this.createProjectFromFeedback = this.createProjectFromFeedback.bind(this)
  }

  render() {
    const styles = {
      item: {
        padding: '2px 6px',
        cursor: 'default',
      },

      highlightedItem: {
        color: 'white',
        background: 'hsl(200, 50%, 50%)',
        padding: '2px 6px',
        cursor: 'default',
      },

      menu: {
        border: 'solid 1px #ccc',
      },
    };

    return (
      <tr>
        <td>{this.props.feedback.text}</td>
        <td>{this.props.feedback.project_id}</td>
        <td>
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.createProjectFromFeedback.bind(this)}
          >
            Create Project
          </button>
        </td>
      </tr>
    );
  }
}
