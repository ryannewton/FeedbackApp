//Import Libraries
import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';

export default class Website_Row extends Component {

	constructor(props) {
		super(props);
	}

	shouldItemRender(category, searchTerm) {
		return (category.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
	}

	sortItems(a, b, searchTerm) {
		return (
    	a.name.toLowerCase().indexOf(searchTerm.toLowerCase()) >
    	b.name.toLowerCase().indexOf(searchTerm.toLowerCase()) ? 1 : -1
  	)
	}

	excludeURL(event) {
		event.preventDefault();
		this.props.excludeURL(this.props.website.url, String(this.props.type === "Exclude"));
	}

	removeURL(event) {
		event.preventDefault();
		this.props.removeURL(this.props.website.url);
	}

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

		let excludeButton;
		let removeButton;
		if (this.props.type === "Exclude") {
			excludeButton = ( <td><button type="button" onClick={this.excludeURL.bind(this)} className="btn btn-warning">Exclude</button></td> )
		} 
		else if (this.props.type === "Remove") {
			excludeButton = ( <td><button type="button" onClick={this.excludeURL.bind(this)} className="btn btn-info">Include</button></td> )
			removeButton = ( <td><button type="button" onClick={this.removeURL.bind(this)} className="btn btn-danger">Delete</button></td> )
		}

		let category;
		if (this.props.type === "Private") {
			category = <Autocomplete
        value={this.props.website.category}          	
        items={[
        	{name: "Entertainment: TV/Video"},
        	{name: "Entertainment: Social Network"},
        	{name: "Entertainment: Reading"},
        	{name: "News"},
        	{name: "Shopping"},
        	{name: "Search Engine"},
        	{name: "Research"},
        	{name: "Email"},
        	{name: "Entertainment: Games"},
        	{name: "Programming"},
        	{name: "Work"},
        	{name: "Banking"},
        	{name: "Pornography"},
        	{name: "Messaging"},
        	{name: "Online Dating"},
        	{name: "Entertainment: Sports"},
        	{name: "Fantasy Football"},
        	{name: "Music"},
        	{name: "School"},
        	{name: "Productivity"},
        	{name: "Errands"},
      	]}
        getItemValue={(item) => item.name}
        shouldItemRender={this.shouldItemRender.bind(this)}
        sortItems={this.sortItems.bind(this)}
        onChange={(event, value) => this.props.updateCategory(this.props.website.url, value)}
        onSelect={value => this.props.updateCategory(this.props.website.url, value)}
        renderItem={(item, isHighlighted) => (
          <div
            style={isHighlighted ? styles.highlightedItem : styles.item}
            key={item.name}
          >{item.name}</div>
        )}
    	/>
		}
		else {
			category = this.props.website.category;
		}

		return (
			<tr>
	      <td>{this.props.website.url}</td>
	      <td>{Math.floor((this.props.website.timeElapsed/this.props.totalTime) * 100) + "%"}</td>
	      <td>{Math.floor(this.props.website.timeElapsed/this.props.totalNumDays/(1000 * 60))}</td>
	    	<td>{ category }</td>
				{ excludeButton }
				{ removeButton }
    	</tr>
		);
	}
}
