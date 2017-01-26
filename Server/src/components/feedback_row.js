import React from 'react';
//import Autocomplete from 'react-autocomplete';

export default class Feedback_Row extends React.Component {
  constructor(props) {
    super(props);
  }

  createProjectFromFeedback() {
    //call create project
    this.props.addProject(this.props.receivedIDForAddProject, this.props.feedback)
    //need to also update feedback's project ID
  }

  /*
  shouldItemRender(category, searchTerm) {
    return (category.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
  }

  sortItems(a, b, searchTerm) {
    return (
      a.name.toLowerCase().indexOf(searchTerm.toLowerCase()) >
      b.name.toLowerCase().indexOf(searchTerm.toLowerCase()) ? 1 : -1
    )
  }
  */

  render() {

    let styles = {
      item: {
        padding: '2px 6px',
        cursor: 'default'
      },

      highlightedItem: {
        color: 'white',
        background: 'hsl(200, 50%, 50%)',
        padding: '2px 6px',
        cursor: 'default'
      },

      menu: {
        border: 'solid 1px #ccc'
      }
    }   

    return (
      <tr>
        <td>{this.props.feedback.text}</td>
        <td>{this.props.feedback.project_id}</td>
        <td>
          <button type="button" className="btn btn-primary" onClick={this.createProjectFromFeedback.bind(this)}>Create Project</button>
          {/*
          <Autocomplete
          value={this.props.department}           
          items={[
            {name: "GSB Residences"},
            {name: "Arbuckle Dining Pavillion"},
            {name: "Other"},
          ]}
          getItemValue={(item) => item.name}
          shouldItemRender={this.shouldItemRender.bind(this)}
          sortItems={this.sortItems.bind(this)}
          onChange={(event, value) => console.log("this.props.updateCategory(this.props.website.url, value)")}
          onSelect={value => console.log("this.props.updateCategory(this.props.website.url, value)")}
          renderItem={(item, isHighlighted) => (
            <div
              style={isHighlighted ? styles.highlightedItem : styles.item}
              key={item.name}>
              {item.name}
            </div>
          )} />
        */}
        </td>
      </tr>
    );
  }
}