let actions = {
	
	pullDataFromServer(feedback) {
		return {
			type: 'PULL_DATA_FROM_SERVER',
			feedback,			
		}
	},

	updateStartDate(date) {
		return {
			type: 'UPDATE_START_DATE',
			date,			
		}
	},

	updateEndDate(date) {
		return {
			type: 'UPDATE_END_DATE',
			date,			
		}
	},

}

export default actions