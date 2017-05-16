
$(document).ready(function(e) {

 var deletedTask = null;


	$('#add-todo').button({
		icons: { primary: "ui-icon-circle-plus" }}).click(
		function() {

			$('#new-todo').dialog('open');

		});

		$('#new-todo').dialog({
			modal : true, autoOpen : false,
			buttons : {
				"Add task" : function () {

					var taskName = $('#task').val();
					if (taskName === '') { return false; }
					var xfer = {
                        task:taskName
                    };
					$(this).dialog('close');
					$.ajax({
                        method:'post',
                        url: '/create',
                        dataType: 'json',
                        data: xfer,
                        error: function(data)
                        {
                            alert("error addtask");
                        },
                        success: function (data)
                        {

                        var taskHTML = '<li><span class="done">%</span>';
                        taskHTML += '<span class="delete">x</span>';
                        taskHTML += '<span class="edit">+</span>';
                        taskHTML += '<span class="task"></span></li>';
                        var $newTask = $(taskHTML);
                        $newTask.find('.task').text(taskName);''
                        $newTask.hide();
                        $('#todo-list').prepend($newTask);
                        $newTask.show('clip',250).effect('highlight',1000);
                        $("#jdialog_box_content").empty();
                        
                        $('#task').val("");
                        }
                    });
					

				},
				"Cancel" : function () { $(this).dialog('close'); }
			}
		});

		$('#todo-list').on('click', '.done', function() {

			var $taskItem = $(this).parent('li');
			$taskItem.slideUp(250, function() {
				var $this = $(this);
				$this.detach();
				$('#completed-list').prepend($this);
				$this.slideDown();
			});
		});

		$('#todo-list').on('click', '.edit', function() {

			deletedTask = $(this).parent("li");
			$("#new-edit").dialog('open');
		});

		$('.sortlist').on('click','.delete',function() {
			deletedTask = $(this).parent('li');
			$('#new-del').dialog('open');
		});


		$('.sortlist').sortable({
			connectWith : '.sortlist',
			cursor : 'pointer',
			placeholder : 'ui-state-highlight',
			cancel : '.delete,.done'
		});

		$('#new-del').dialog({
			modal : true, autoOpen : false,
			buttons : {
				"Delete Task" : function () {

					deletedTask.effect('puff', function(){deletedTask.remove();});
					 $(this).dialog('close');
					

				},
				"Cancel" : function () { $(this).dialog('close'); }
			}
		});

		$('#new-edit').dialog({
			modal : true, autoOpen : false,
			buttons : {
				"Edit Task" : function () {

					var Edited = $('#newEdit').val();
					deletedTask.find('.task').text(Edited);
					$('#newEdit').val('');
					$(this).dialog('close');
					

				},
				"Cancel" : function () { $(this).dialog('close'); }
			}
		});









}); // end ready
