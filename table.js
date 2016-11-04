/**
 * ����json���ݣ�����table���
 *<pre>
 *     var mappings = {
 *               "���" :function(td, row, column, content){
 *                   return row + 1;
 *               },
 *               "���":function(td, row, column, content){
 *                   return "<a href='#'>"+content.id+"</a>";
 *               },
 *               "����":function(td, row, column, content){
 *                   return content.name;
 *               },
 *               "����":function(td, row, column, content){
 *                   return content.age;
 *               }
 *      };
 *
 *      var data = [{"id":1,"name":"����","age":15},{"id":2,"name":"����","age":18}];
 *
 *      tab_jsonDivTable($("#table"),data,mappings,function(tab){})
 *</pre>
 * @param target ���Ŀ�����
 * @param data �����б�
 * @param mapping ���ݴ�����ӳ��
 * @param onComplete ���б������ɺ�Ĵ�����
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
					//td:��ǰtd, j:��(row)  ,k:��(column), hi:ֵ����
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