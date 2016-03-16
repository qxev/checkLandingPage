$(function () {
    $("#job-grid").flexigrid({
        url: 'jobGrid',
        dataType: 'json',
        theadAlign: 'center',
        width: 700,
        align: 'left',
        colModel: [{
            display: 'ID',
            name: 'id',
            sortable: false,
            align: 'right',
            width: 20
        }, {
            display: '项目名',
            name: 'name',
            sortable: false,
            width: 80,
            align: 'center'
        }, {
            display: '开始时间',
            name: 'startAt',
            sortable: false,
            width: 120,
            align: 'center'
        }, {
            display: '结束时间',
            name: 'endAt',
            sortable: false,
            width: 120,
            align: 'center'
        }, {
            display: '当前运行条数',
            name: 'currentNum',
            sortable: false,
            width: 73,
            align: 'center'
        }, {
            display: '总共条数',
            name: 'totalNum',
            sortable: false,
            width: 60,
            align: 'center'
        }, {
            display: '执行状态',
            name: 'status',
            sortable: false,
            width: 60,
            align: 'center'
        }, {
            display: '下载',
            name: 'operate',
            sortable: false,
            width: 60,
            align: 'center'
	  	}],
	  	dataProcess : function(data) {
			for ( var i = 0, length = data.rows.length; i < length; i++) {
				var row = data.rows[i];
				if (row.cell['status']=='完成'){
					row.cell['operate'] = '<a href="xls/'+row.cell["id"]+'.xls">下载</a>';
				}
			}
		}
    });
});