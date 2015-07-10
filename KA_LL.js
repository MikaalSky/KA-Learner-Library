if(!jQuery){
	alert("KA_LL requires jQuery to contact the database. Please add jQuery as a script.")
}
var KA_LL = {
	rot13: function(inputString) {
	// ROT-13 by Ben Alpert
	// See: http://stackoverflow.com/questions/617647/where-is-my-one-line-implementation-of-rot13-in-javascript-going-wrong
	return inputString.replace(/[a-zA-Z]/g,
	function(c){
		return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);}) 
	},
	onKA: (document.location.origin === "https://www.kasandbox.org"),
	storage: {
		// A function that stores data in sessionStorage
		// if program is running in KA sandbox, uses localStorage
		// otherwise.
		// May be updated with techniques that mimic localStorage on KA
		// allowing programs extra functionality without modification.
		cachedData: {},
		refreshData: function(callback) {
			$.getJSON("https://www.khanacademy.org/api/internal/discussions/scratchpad/6504298256138240/comments?casing=camel&sort=2&limit=200000000000000000000000&page=0&lang=en&callback=?",function(data){
				cachedData = data;
				callback(); //We don't pass the data because they should be using get()
			})
		},
		/*
		 * key, value
		 * key = username (may change)
		 * value = json index
		 * callback = function(data)
		 */
		get: function(key, value, callback) {
			if (KA_LL.onKA) {
				//return sessionStorage.getItem(key, value);
				var comments = KA_LL.storage.cachedData.feedback;
				for(var i = 0; i < comments.length; i++){
					$.getJSON("https://www.khanacademy.org/api/internal/user/profile?kaid=" + comments[i].authorKaid + "&lang=en&callback=?", function(data){
						if(data.username.toLowerCase() == key.toLowerCase()){
							this.parseingData = data.content.replace("|-|KA_LLJSON|-|\n","");
							callback(JSON.parse(this.parseingData));
						}else{
							callback(false);
						}
					})
				}
			} else {
				return localStorage.getItem(key, value);
			}},
		set: function(key, value) {
			if (KA_LL.onKA) {
				sessionStorage.setItem(key, value);
			} else {
				localStorage.setItem(key, value);
			}},
		clear: function() {
			if (KA_LL.onKA) {
				sessionStorage.clear();
			} else {
				localStorage.clear();
			}},
		remove: function(key, value) {
			if (KA_LL.onKA) {
				sessionStorage.removeItem(key, value);
			} else {
				localStorage.removeItem(key, value);
			}
		}},
	randomChoice: function(choices) {
		/**
		* Ever wanted to choose randomly between several options?
		* Tried doing so with the random(min, max) function?
		* That didn't work out for you, did it?
		* That's because random(min, max) only works with numbers and
		* gives ANYTHING in between. Even fractions.
		* 
		* Well! Now there's the randomChoice(choices) function!
		* @author Dalendrion
		* @param {...Mixed} choices - Any number of any type of value you could ever want!
		* @returns {Mixed} Returns one of the given arguments at random.
		*			each argument has an equal chance of being returned.
		*/
		return arguments[floor(random(arguments.length))];
	},
	randomizeChildren: function(tagName) {
		// randomizes the children of element type provided
		// snagged from @pamela's contest result programs, modified
		var lists = document.getElementsByTagName(tagName);
		for (var j = 0; j < lists.length; j++) {
			var theList = lists[j];
			for (var i = theList.children.length; i >= 0; i--) {
				theList.appendChild(theList.children[Math.random() * i | 0]);
			}
		}
	}
};
function contactMT(dataToSend, callback){
	chrome.runtime.sendMessage("melabjdobbjfobmgaagkmgbnhplncdie",{"banana":7},function(data){
  		callback(data)
	});
}
