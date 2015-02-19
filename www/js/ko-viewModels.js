var monthNames = [ "Januari", "Februari", "Maart", "April", "Mei", "Juni",
    "Juli", "Augustus", "September", "October", "November", "December" ];

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
	self.currentToggleIsEuro = ko.observable(false);

	self.pushChild = function(childViewModel){
		self.children.push(childViewModel);
		self.pages.push(new PageViewModel(childViewModel.firstName(), childViewModel.firstName(), false, childViewModel));
	};

	self.months = ko.computed(function(){
		var months = [];

		self.children().forEach(function(child) {
			child.playTimes().forEach(function(playTime){
				if(playTime.endDate()){
					var key = playTime.startDate().getFullYear() * 100 + playTime.startDate().getMonth() + 1; // Month is zero based
					var name = monthNames[playTime.startDate().getMonth()] + ' ' + playTime.startDate().getFullYear();

					var monthResult = $.grep(months, function(item){ return item.key == key; });
					var month = monthResult[0];
					if(monthResult.length == 0){
						month = { key: key, displayName: name, totalHours: 0, totalEuros: 0, children: [] }
						months.push(month);
					}

					var foundChildResult = $.grep(month.children, function(item){ return item.name == child.firstName(); });
					var foundChild = foundChildResult[0];
					if(foundChildResult.length == 0){
						foundChild = { name: child.firstName(), totalHours: 0, totalEuros: 0 };
						month.children.push(foundChild);
					}

					month.totalHours += playTime.totalHours();
					month.totalEuros += playTime.totalEuros();
					foundChild.totalHours += playTime.totalHours();
					foundChild.totalEuros += playTime.totalEuros();
				}
			});
		});

		months.sort(function(left, right){
			// Last to first sorting
			return left.key < right.key ? 1 : -1;
		});
		return months;
	});
}

var PageViewModel = function(href, name, childViewModel, canToggleEuroHours){
	var self = this;

	self.href = ko.observable(href);
	self.name = ko.observable(name);
	self.childViewModel = ko.observable(childViewModel);
	self.canToggleEuroHours = ko.observable(canToggleEuroHours || false);
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

	self.totalHours = ko.computed(function(){
		if(self.endDate()){
			// Is in milliseconds
			return (self.endDate() - self.startDate()) / 1000 / 60 / 60;
		}
		return 0;
	});

	self.totalEuros = ko.computed(function(){
		if(self.endDate()){
			// Is in milliseconds
			return (self.endDate() - self.startDate()) / 1000 / 60 / 60 * 5; /* 5 euro's per hour */
		}
		return 0;
	});
}