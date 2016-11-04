/**
 * 根据json数据，绘制table表格
 *<pre>
 *     var mappings = {
 *               "序号" :function(td, row, column, content){
 *                   return row + 1;
 *               },
 *               "编号":function(td, row, column, content){
 *                   return "<a href='#'>"+content.id+"</a>";
 *               },
 *               "名称":function(td, row, column, content){
 *                   return content.name;
 *               },
 *               "年龄":function(td, row, column, content){
 *                   return content.age;
 *               }
 *      };
 *
 *      var data = [{"id":1,"name":"张三","age":15},{"id":2,"name":"李四","age":18}];
 *
 *      tab_jsonDivTable($("#table"),data,mappings,function(tab){})
 *</pre>
 * @param target 填充目标对象
 * @param data 数据列表
 * @param mapping 数据处理方法映射
 * @param onComplete 当列表绘制完成后的处理方法
 */
function tab_jsonTable(target, data, mapping, onComplete) {
	var table = $("<table></table>");
	var tHead = $("<thead></thead>").appendTo(table);
	var trh = $("<tr></tr>").appendTo(tHead);
	var tb = $("<tbody></tbody>").appendTo(table);

	var head = [];
	if(mapping)
		for(var key in mapping)
			head.push(key);

	if(head) {
		for(var i = 0; i < head.length; i++) {
			if(head[i] != null)
				$("<th></th>").appendTo(trh).append(head[i]);
		}
	}
	if(data.length == 0) {
		var td = $("<td></td>").appendTo($("<tr></tr>").appendTo(tb)).append("--");
		if(head)
			td.attr("colspan", head.length);
	} else {
		for(var j = 0; j < data.length; j++) {
			var trc = $("<tr></tr>").appendTo(tb);
			for(var k = 0; k < head.length; k++) {
				var td = $("<td></td>").appendTo(trc);
				var hi = data[j];
				if(mapping[head[k]]) {
					//td:当前td, j:行(row)  ,k:列(column), hi:值对象
					var rs = mapping[head[k]](td, j, k, hi, head[k]);
					if(typeof(rs) === "undefined") {} else if(null === rs) {
						td.remove();
						continue;
					} else {
						hi = rs;
					}
				}
				td.append(hi);
			}
		}
	}
	if(onComplete) {
		onComplete(table);
	}

	if(target) {
		$(target).html(table);
	}

}