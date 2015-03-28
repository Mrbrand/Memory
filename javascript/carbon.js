var itemList = {
	itemArray: [], //lagrar projektdata
	
	
	/* Hämtar projektdata från angiven källa och lagrar i objektet ************/
	init : function(key) {     
		this.itemArray = JSON.parse(window.localStorage.getItem(key));
		if (this.itemArray==undefined) this.itemArray = {employees: [{id: 0,name: "Coenraets"}]};
	},
	
	
	/* Rensar .list objektet och återskapar alla element via json-array *******/
	refresh : function(item_id) {   
		
		//rensa lista
		$("#list").empty();
		
		//filtrera itemArray
		var filterArray = this.get_subitems(item_id);
		var string_object;
		var item_notes;
		var item_class;
		
		//skapa lista från filterArray
		filterArray.forEach(function(item) {
			/*var subitems = itemList.get_subitems(item.item_id,1);
			subitems.sort(function(a, b){return a.type-b.type});*/
			var template = $('#item_template').html();
			var html = Mustache.to_html(template, item);
			$("#list").append(html);
		});
		 
	   
		//sortera listan   
	},
	
	/* returnerar projekt med givet item_id */
	get_item : function(item_id){
		return this.itemArray.filter(function (item){
			return item.item_id == item_id;
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
		
		//lägga till parent_id till objektet
		item["parent_id"] = 0;
		
		//lägga till objekt i listan
		this.add_item(item);
	},
	
	
	remove_item : function(id){
		for(var i in this.itemArray){
			if(this.itemArray[i].item_id==id){
				this.itemArray.splice(i,1);
				break;
				}
		}
	},
	
	
	get_subitems : function(id, prio){
		return this.itemArray.filter(function (item){
			//console.log(prio);
			if (prio === undefined){ 
				return item.parent_id == id;
			}
			else {
				return item.parent_id == id & item.prio == prio;
			}
		});
	}
}