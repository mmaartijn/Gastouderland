var GastouderViewModel = function(){
	var self = this;

	self.children = ko.observableArray();

	self.sortedChildren = ko.computed(function(){
	   return self.children().sort(function (left, right) { 
	   		left.firstName() < right.firstName ? -1 : 1;
		});
	});

	self.selectedChild = ko.observable(new ChildViewModel());

	self.pages = ko.observableArray();
	self.selectedPage = ko.observable();

	self.pushChild = function(childViewModel){
		self.children.push(childViewModel);
		self.pages.push(new PageViewModel(childViewModel.firstName(), childViewModel.firstName(), false, childViewModel));
	};
}

var PageViewModel = function(href, name, childViewModel){
	var self = this;

	self.href = ko.observable(href);
	self.name = ko.observable(name);
	self.childViewModel = ko.observable(childViewModel);
}

var ChildViewModel = function(firstName){
	var self = this;
	
	self.firstName = ko.observable(firstName);
	self.playTimes = ko.observableArray();

	self.isPresent = ko.computed(function(){
		var playTimes = self.playTimes();
		if(playTimes.length > 0){
			var last = playTimes[playTimes.length - 1];
			return last.startDate() < new Date() && last.endDate() == undefined;
		}
		else {
			return false;
		}
	});

	self.presentFrom = ko.computed(function(){
		var playTimes = self.playTimes();
		if(playTimes.length > 0){
			var last = playTimes[playTimes.length - 1];
			if(last.endDate() == undefined){
				var start = playTimes[playTimes.length - 1].startDate();
				return start.getHours() + ':' + start.getMinutes();
			}
		}
		return '';
	});

	self.suggestedStartStopHours = ko.observable();

	self.suggestedStartStopMinutes = ko.observable();

	self.leave = function(){
		console.log(self.firstName() + ' left the building!');
		var playTimes = self.playTimes();
		if(playTimes.length > 0){
			var leaveDate = new Date();
			leaveDate.setHours(self.suggestedStartStopHours());
			leaveDate.setMinutes(self.suggestedStartStopMinutes());
			playTimes[playTimes.length - 1].endDate(leaveDate);
		}
	};

	self.arrive = function(){
		console.log(self.firstName() + ' entered the building!');
		var arrivalDate = new Date();
		arrivalDate.setHours(self.suggestedStartStopHours());
		arrivalDate.setMinutes(self.suggestedStartStopMinutes());
		self.playTimes.push(new PlayTimeViewModel(arrivalDate));
	};
}

var PlayTimeViewModel = function(startDate, endDate){
	var self = this;

	self.startDate = ko.observable(startDate);
	self.endDate = ko.observable(endDate);
}