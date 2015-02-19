var viewmodel = ko_testViewModel || new ChildrenViewModel();

$(document).ready(function(){
    initKnockout();
    initGlobals();
});

initKnockout = function(){
    ko.virtualElements.allowedBindings.updateListviewOnChange = true;
    ko.bindingHandlers.updateListviewOnChange = {
      update: function (element, valueAccessor) {
        ko.utils.unwrapObservable(valueAccessor());  //grab dependency

        var listview = $(element).parents()
                                 .andSelf()
                                 .filter("[data-role='listview']");

        if (listview) {
          try {
            $(listview).listview('refresh');
          } catch (e) {
            // if the listview is not initialised, the above call with throw an exception
            // there doe snot appear to be any way to easily test for this state, so
            // we just swallow the exception here.
          }
        }
      }
    };

    ko.applyBindings(viewmodel);
}

initGlobals = function(){
  $("#globalHeader").toolbar();
  $("#globalPanel").panel();
  $("#globalPanel ul[data-role='listview']").listview();

  $("#globalPanel").on("vclick", "a", function(e){
    var page = ko.dataFor(this);
    viewmodel.selectedPage(page);
    
    e.preventDefault();
    $.mobile.navigate($(this).attr("href"));
    $("#globalPanel ul[data-role='listview']").listview();
  });  
}

$("#page_home").on("click", ".startStopShow", function() {
    var child = ko.dataFor(this);

    var minutes = new Date().getMinutes();
    var hours = new Date().getHours();
    child.suggestedStartStopMinutes((((minutes + 7.5)/15 | 0) * 15) % 60);
    child.suggestedStartStopHours(((((minutes/105) + .5) | 0) + hours) % 24);

    viewmodel.selectedChild(child);
    return true;
});

$("#page_home").on("click", "#popup_stopstart a", function() {
    var child = viewmodel.selectedChild();
    if(child.isPresent()){
      child.leave();
    }
    else{
      child.arrive();
    }
    return true;
});

$('#btnToggleEuro').vclick(function(e){
  e.preventDefault();

  viewmodel.currentToggleIsEuro(!viewmodel.currentToggleIsEuro());
})