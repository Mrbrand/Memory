var itemList = {
	itemArray: [], //lagrar projektdata
	
	
	/* Hämtar projektdata från angiven källa och lagrar i objektet ************/
	init : function(key) {     
		this.itemArray = JSON.parse(window.localStorage.getItem(key));
		if (this.itemArray==undefined) this.itemArray = {employees: [{id: 0,name: "Coenraets"}]};
	},
	
	
	/* Rensar .list objektet och återskapar alla element via json-array *******/
	RefreshList : function(project_id) {   
		
		//rensa lista
		$("#projects>.list").empty();
		
		//filtrera array
		var filterdata = this.get_subprojects(project_id);
		var string_object;
		var item_notes;
		var item_class;
		//skapa lista från array
		filterdata.forEach(function(project) {
			var subprojects = projectList.get_subprojects(project.project_id,1);
			subprojects.sort(function(a, b){return a.type-b.type});
			if(project.type >= 100) item_class = "document";
			else item_class = "project";
			
			if(project.notes!="") item_notes = '<span class="notes">'+project.notes+'</span>';
			else item_notes = "";
			
			string_object =
			'<div class="subitem '+item_class+'">'
						
				+'<div class="subitem-left quick_edit_project">'
					+'<img class="prio-icon" src="../img/prio'+project.prio+'.png"/>'
					+'<img class="type-icon" style="margin:4px 3px;" src="../img/type'+project.type+'.png"/>'
					+'<img class="type-icon" style="margin:0;" src="../img/size'+project.size+'.png"/>'
					
				+'</div>'
				
				+'<div class="subitem-center">'
					+'<div class="title" style="">'+project.title+'</div>'
					+'<div class="next_action_div" style="float:left;">'
					+item_notes; 
					subprojects.forEach(function(subproject) {
					   string_object +=
						'<img class="type-icon" style="margin:4px 7px;height:10px;" src="../img/type'+subproject.type+'.png"/>'
						+'<span class="next_action">'+subproject.title+'</span><br/>';                
						
					});
				
				string_object +=
					'</div>'
				+'</div><!-- end subitem-center -->'
				 +'<div style="clear:both;"></div>'
				//gömda datafält
				+'<span class="project_id" style="display:none;">'+project.project_id+'</span>'
				+'<span class="prio" style="display:none;">'+project.prio+'</span>'
				+'<span class="type" style="display:none;">'+project.type+'</span>'
			+'</div><!-- end subitem  -->';
			 $("#projects>.list").append(string_object);
		});
		 
	   
		//sortera listan   
	},
	
	/* returnerar projekt med givet project_id */
	get_project : function(project_id){
		return this.projectArray.filter(function (project){
			return project.project_id == project_id;
		})[0];
	},
	
	get_last_id : function(){
		last_id = Math.max.apply(Math,this.itemArray.map(function(item){return item.id;}));
		if (last_id=="-Infinity") last_id=0; //om inget objekt är skapat ännu
		return last_id;
	},
	
	add_item : function(item){
		this.itemArray.push(item);
	},
	
	add_from_form : function(form_id){
		//skapa objekt av formdata
		var temp = $( form_id ).serializeArray();
		var item = {};
		for(var i = 0; i <temp.length;i++){
			temp2 = temp[i];
			item[temp2["name"]] = temp2["value"];
		}
		
		//lägga till startdate till objektet
		item["start_date"] = new Date().toLocaleString();
		
		//lägga till id till objektet
		item["id"] = itemList.get_last_id()+1;
		
		//lägga till objekt i listan
		this.add_item(item);
	},
	
	
	remove_project : function(id){
		for(var i in this.projectArray){
			if(this.projectArray[i].project_id==id){
				this.projectArray.splice(i,1);
				break;
				}
		}
	},
	
	
	get_subprojects : function(project_id, prio){
		return this.projectArray.filter(function (project){
			//console.log(prio);
			if (prio === undefined){ 
				return project.parent_id == project_id;
			}
			else {
				return project.parent_id == project_id & project.prio == prio;
			}
		});
	}
}