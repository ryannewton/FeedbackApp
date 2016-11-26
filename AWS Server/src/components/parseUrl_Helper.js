// Takes a raw url and returns the full domain
// (e.g. "https://mail.google.com/mail/u/0/#inbox" --> "mail.google.com")
export default function parseUrl(url) {
	//In the special case that a url is an IDLE entry we don't want to parse it
	if (url === "IDLE") {return url;}

	var fullSite = url;	

	//Remove 'http://', 'https://', 'chrome://', etc if there
	if(fullSite.indexOf('://') !== -1) {
		fullSite = fullSite.split('://')[1];
	}	
	
	//Remove 'www.' if there
	if(fullSite.slice(0,4) === "www." || fullSite.slice(0,4) === "WWW.") {
		fullSite = fullSite.slice(4);
	}

	//Remove everything after the next '/' if it exists
	if (fullSite.indexOf('/') !== -1) {
		fullSite = fullSite.slice(0, fullSite.indexOf('/'));
	}

	var domains = ['.com', '.edu', '.org', '.net', '.gov', '.int', '.mil', '.info', '.io'];

	//Remove the domain if it exists
	for(let i = 0; i < domains.length; i++) {
		
		let domain = domains[i];
		let endOfFullSite = fullSite.slice(fullSite.length-domain.length, fullSite.length)

		if (endOfFullSite === domain) {
			fullSite = fullSite.slice(0, fullSite.length-domain.length);
			break;		
		}
	}

	return fullSite;

	/*
	// mainSite is the second-level domain (i.e. "https://mail.google.com/mail/u/0/#inbox" --> "mail.google.com")
	// This is set up if needed for future use
	var mainSite;	

	//If fullsite contains periods, find mainSite
	if(fullSite.indexOf('.') !== -1) {
		mainSite = fullSite.slice(fullSite.indexOf('.'));
	} else {
		mainSite = fullSite;
	}

	*/
}
