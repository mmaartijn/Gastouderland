var ko_testViewModel = new GastouderViewModel();

var homePage = new PageViewModel('#page_home', 'Wie is er?');
ko_testViewModel.pages.push(homePage);
ko_testViewModel.pages.push(new PageViewModel('#page_months', 'Maandoverzicht', undefined, true))
ko_testViewModel.pages.push(new PageViewModel('children.html', 'Kinderen'))
ko_testViewModel.selectedPage(homePage);

var melle = new ChildViewModel('Melle');
melle.playTimes.push(new PlayTimeViewModel(new Date('2015-02-18 08:15')));
melle.playTimes.push(new PlayTimeViewModel(new Date('2014-12-13 08:15'), new Date('2014-12-13 17:15')));
melle.playTimes.push(new PlayTimeViewModel(new Date('2014-12-12 08:15'), new Date('2014-12-12 17:15')));


var siem = new ChildViewModel('Siem');
siem.playTimes.push(new PlayTimeViewModel(new Date('2015-02-12 08:15'), new Date('2015-02-12 17:15')));
siem.playTimes.push(new PlayTimeViewModel(new Date('2015-01-12 08:15'), new Date('2015-01-12 17:15')));
siem.playTimes.push(new PlayTimeViewModel(new Date('2015-01-13 08:15'), new Date('2015-01-13 17:15')));
siem.playTimes.push(new PlayTimeViewModel(new Date('2014-12-13 08:15'), new Date('2014-12-13 17:15')));
siem.playTimes.push(new PlayTimeViewModel(new Date('2014-12-12 08:15'), new Date('2014-12-12 17:45')));

ko_testViewModel.pushChild(melle);
ko_testViewModel.pushChild(siem);