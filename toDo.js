function parseDateString(date) {

	
	var day = date.slice(0,2); 
	var month = date.slice(3,5);  
	var year = date.slice(6); 
	
	var dateDueMilli = Date.UTC(year, month-1,day);  //gives task date in milliseconds from 1970. month-1 bc months go from 0-11
	
	return dateDueMilli; 													    					  											    																  			  					
}

function isDate(date) {  //checks if a date is set. if it isn't first letter of string is d in 'do at leisure'

	if(date[0]==='d') { 
		return false; 
	}
	return true; 
}

function calculateDaysLeft(timeLeftMilli) {

	if (timeLeftMilli <=0) {
			
			var timeDifference = -timeLeftMilli; 
				
			if(timeDifference<=86399000){    //86399000 no. of milliseconds in 23hrs 59mins 59seconds
				return '<span class="dueBy">today</span>'; 
			} else {
				return '<span class="dueBy">yesterday</span>'; //if task due less than 23hrs59mins59seconds ago its due today, otherwise it was due yesterday; 
			}
	
	} else {
	
			var milliDays = 1000*60*60*24; //milliseconds in a day
			var daysLeft = timeLeftMilli/milliDays; 
			console.log(daysLeft); 
				
			if(daysLeft<1) {   //if task is in the future, but less than 24 hours in the future, its due tomorrow
				return '<span class="dueBy">tomorrow</span>'; 
			} else {
				daysLeft = Math.ceil(daysLeft); 
				return '<span class="dueBy">in '+daysLeft+' days</span>';  
			}
		}
}

function Task(taskName, dateDue) {  // task object constructor 

	this.taskName = taskName; 
	this.dateDue = dateDue; // pass field value into here

} 

Task.prototype.timeLeft = function() {

	if(isDate(this.dateDue)) { //does the string contain a date?
	
		var dateDueMilli = parseDateString(this.dateDue); //break up date string into year month day to call Date.UTC()
		
		var timeLeftMilli = dateDueMilli - Date.now(); 
		console.log('date due is' + dateDueMilli); //CHANGE FOR DAYLIGHT SAVINGS !!!
		console.log('current time is' +Date.now()); 
		
		var daysLeftString = calculateDaysLeft(timeLeftMilli); 
	
		return daysLeftString; 
	}
	return ''; 
}

$("#taskPopup").dialog({

	modal:true,
	autoOpen:false,
	draggable:false,
	resizable: false,
	buttons: [
	
		{
			text: 'no deadline',
			"id":'noDeadlineButton', 
			click: function() {
			
				$("#deadline").val('do at leisure').removeClass("normalText");  

			}
		},
		
		{
			text: 'add',
			click: function () {
			
					var taskName = $("#task").val(); 
					
					if(taskName !== '') {
					
						escapedTask = $('<div>').text(taskName).html();   //escape text in task field
						taskName = escapedTask; 
					
						var dateDue = $("#deadline").val(); 
			
						var task = new Task(taskName, dateDue); 
				
						var daysLeftString = task.timeLeft(); 
						
						var taskNameString = '<span class="taskName">'+taskName+'</span>'; 
						
						var icons = '<span class="ui-icon ui-icon-check hide"></span>';
						icons +='<span class="deleteIcon hide"></span>'; 
						icons +='<span class="ui-icon ui-icon-folder-open hide"></span>'; 
				
						$("#taskList").append('<p>'+taskNameString + daysLeftString+icons+'</p>');  //add task and time left to DOM
					
					}
			
			$(this).dialog('close');  //close dialog box
		
			}
		}
	]
}); 
	
$("#addTask").click(function(){
	
	$("#taskPopup").dialog("open");
	$("#task").val('');           // resets task field on popup 
	$("#deadline").val('do at leisure').removeClass("normalText");  //default value for task deadline

}); 

$("#deadline").datepicker({ //initialize datepicker 
	
	maxDate: "+6m",
	minDate: "-1",
	dateFormat: "dd/mm/yy"
	
}); 
	
$("#deadline").change(function() {   //change event only triggered when user has chosen datepicker date, not when val is changed to 'do at leisure'		

	$("#deadline").addClass("normalText"); 
});

$("#taskList").on("click", ".taskName", function(e) {  //click on taskName to mark as done
	  
	$(e.target).toggleClass("taskLineThru").siblings().toggleClass("hide");  //siblings() selects dueBy and icons. hides dueBy, shows icons		
}); 

$("#taskList").on("click",".deleteIcon", function(e) {

	$(e.target).parent().remove(); //removes task paragraph from DOM
}); 

$( ".deleteIcon" ).tooltip({
  content: "Awesome title!"
});





