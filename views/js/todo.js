
$(document).ready(function(e) {

 var deletedTask = null;

    $.ajax({
        method:'get',
        url: '/getall',
        dataType: 'json',
        error: function(data)
        {
        alert("error getall");
        },
        success: function (data)
        {

            $.each(data,function(i,data){
            if(data.status == 0){
                var taskHTML = '<li><span class="done">%</span>';
                taskHTML += '<span class="delete">x</span>';
                taskHTML += '<span class="edit">+</span>';
                taskHTML += '<span class="task">'+data.todo_name+'</span>';
                taskHTML += '<span style = "display:none" class="id">'+data.id+'</span></li>';
                $('#todo-list').append(taskHTML);
            }else{
                var taskHTML = '<li><span class="done">%</span>';
                taskHTML += '<span class="delete">x</span>';
            
                taskHTML += '<span class="task">'+data.todo_name+'</span>';
                taskHTML += '<span style = "display:none" class="id">'+data.id+'</span></li>';
                $('#completed-list').append(taskHTML);
            }
            
            });
        }
    });

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
                        taskHTML += '<span class="task"></span>';
                        taskHTML += '<span style = "display:none" class="id">'+data.id+'</span></li>';
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
            var taskItem = $(this).parent('li');
            var taskName = taskItem.find('.task').text();
            var identifier = taskItem.find('.id').text();
            var xfer = {
                id:identifier,
                task:taskName,
                status:1
            };
            
            $.ajax({
                method:'put',
                url: '/update',
                dataType: 'json',
                data: xfer,
                error: function(data)
                {
                    alert("error update");
                },
                success: function (data)
                {

                    taskItem.slideUp(250, function() {
                        var $this = $(this);
                        $this.detach();
                        $('#completed-list').prepend($this);
                        $this.slideDown();
                    });
                }
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
				var taskName = deletedTask.find('.task').text();
                var identifier = deletedTask.find('.id').text();
                    var xfer = {
                        id:identifier,
                        task:taskName
                    };
					$(this).dialog('close');
					$.ajax({
                        method:'delete',
                        url: '/delete',
                        dataType: 'json',
                        data: xfer,
                        error: function(data)
                        {
                            alert("error delete");
                        },
                        success: function (data)
                        {

                        deletedTask.effect('puff', function(){deletedTask.remove();});
                        $(this).dialog('close');
                        }
                    });

				},
				"Cancel" : function () { $(this).dialog('close'); }
			}
		});

		$('#new-edit').dialog({
			modal : true, autoOpen : false,
			buttons : {
				"Edit Task" : function () {
					
					$('#newEdit').val('');
					$(this).dialog('close');
                    var taskName = deletedTask.find('.task').text();
                    var identifier = deletedTask.find('.id').text();
                    var Edited = $('#newEdit').val();
					
                    var xfer = {
                        id:identifier,
                        task:taskName
                        newName:edited
                    };
					$(this).dialog('close');
					$.ajax({
                        method:'put',
                        url: '/updatetaskname',
                        dataType: 'json',
                        data: xfer,
                        error: function(data)
                        {
                            alert("error delete");
                        },
                        success: function (data)
                        {
                        deletedTask.find('.task').text(Edited);
                        }
                    });

                    
				
					

				},
				"Cancel" : function () { $(this).dialog('close'); }
			}
		});









}); // end ready
