var base;
var local;
var remote;

$( document ).ready(function() {
	// Handler for .ready() called.
	$( "#generateDiff" ).click(function() {
		$.ajax("/notebook").done( 
			function(data) { 
				var dataObject = JSON.parse(data);
				nb = new NotebookMerge(dataObject);
				base = nb.getBase();
				local = nb.getLocal();
				remote = nb.getRemote();
				var baseCells = base.getCellSize();
				var localCells = local.getCellSize();
				var remoteCells = remote.getCellSize();
				createTable(baseCells);
				local.render("local");
				base.render("base");
				remote.render("remote");
				} 
		)
	});
	
	$( "#nbLink" ).click(function() {
		base.saveNotebook();
	});
	
	function createTable(rows) {
		$("#merge_table > tbody").empty();
		$("#merge_table").append("<tr><td><p>Left Side Content:</p></td><td><p>Results:</p></td><td><p>Right Side Content:</p></td></tr>")
		for(var i = 0; i < rows; i++)
		{
			var $row = $("<tr id="+i+"></tr>").appendTo("#merge_table > tbody")
			$("<td class='local' draggable='true' ondragenter='dragEnter(event)' ondragstart='drag(event)' ondrop='drop(event)' ondragover='allowDrop(event)'></td>").appendTo($row);
			$("<td class='base' draggable='true' ondragenter='dragEnter(event)' ondragstart='drag(event)' ondrop='drop(event)' ondragover='allowDrop(event)'></td>").appendTo($row);
			$("<td class='remote' draggable='true' ondragenter='dragEnter(event)' ondragstart='drag(event)' ondrop='drop(event)' ondragover='allowDrop(event)'></td>").appendTo($row);
		}
	}
	
});

function dragEnter(ev) {
   ev.preventDefault();
   return true;
}

function allowDrop(ev)
{
	ev.preventDefault();
}

function drag(ev)
{
	var data = ev.target.parentNode.id +" > td."+ ev.target.className;
	ev.dataTransfer.setData("data", data);
}

function drop(ev)
{
	ev.preventDefault();
	var data=ev.dataTransfer.getData("data");
	var $source = $('#'+data);
	var sourceCell;
	if($source.attr("class") == "local")
	{
		sourceCell = local.getCell($source.closest("tr").attr("id"));
	}
	else if($source.attr("class") == "base")
	{
		sourceCell = base.getCell($source.closest("tr").attr("id"));
	}
	else if($source.attr("class") == "remote")
	{
		sourceCell = remote.getCell($source.closest("tr").attr("id"));
	}
	var $target = $(ev.target);
	if($target.attr("class") == "local")
	{
		local.setCell($target.closest("tr").attr("id"), sourceCell);
	}
	else if($target.attr("class") == "base")
	{
		base.setCell($target.closest("tr").attr("id"), sourceCell);
	}
	else if($target.attr("class") == "remote")
	{
		remote.setCell($target.closest("tr").attr("id"), sourceCell);
	}
	$target.closest("td").html($source.html())
}