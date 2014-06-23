/**
 * 主体
 */
Diamonds = {
	CELL_SIZE: 15,	//内长
	CELL_BORDER: 5,	//边界
	
	VIEW_ROWS: 16,	//行数
	VIEW_COLS: 9,	//列数
	
	VIEW_BGCOLOR:"#FFF",
	
	BORDER_BGCOLOR:"#222",
	BORDER_LTCOLOR:"#777",
	BORDER_RBCOLOR:"#000",
	
	CELL_BGCOLOR:"#555",
	CELL_LTCOLOR:"#AAA",
	CELL_RBCOLOR:"#333",
	
	CELL_STYLE_ARRAY: [
		["#FFA500","#FCC742","#A88200"],//黄
		["#008000","#339C33","#006400"],//绿
		["#0000FF","#0D80EE","#00008B"],//蓝
		["#FF0000","#FF6347","#8B0000"]//红
	],
	
	CELL_TYPE_BORDER: -1,
	CELL_TYPE_FILLED: 1,
	CELL_TYPE_EMPTY: 0,
		
	ROW_TYPE_FILLED: 1,
	ROW_TYPE_EMPTY: 0,
	ROW_TYPE_OTHER: 2,
	
	BUTTON_ENTER: 13,
	BUTTON_UP: 38,
	BUTTON_LEFT: 37,
	BUTTON_RIGHT: 39,
	BUTTON_DOWN: 40,
	BUTTON_BLANK: 32,
		
	GAME_START_X: 5,
	GAME_START_Y: -3,//弃用
	GAME_GRADE: [900, 800, 700, 600, 500, 400, 300, 200, 100],
	GAME_GRADE_MARK: [0, 50, 100, 200, 300, 500, 1000, 5000, 10000],
	GAME_MARKRULE: [2, 3, 6, 12],
	GAME_STATE_NOSTART: 0,
	GAME_STATE_STARTED: 1,
	GAME_STATE_STOP: 2,
	GAME_STATE_OVER: 3,
	BLINK_TIME: 80,
	
	ACTION_CHANGE: "CHANGE",
	ACTION_DOWN: "DOWN",
	ACTION_LEFT: "LEFT",
	ACTION_RIGHT: "RIGHT",
	
	DIAMOND_STATUS: [//方块种类
		"1", 	// 正方形	[00, 10, 01, 11]
		
		"21",	// 长条1	[00, 10, 20, 30]
		"22",	// 长条2	[00, 01, 02, 03]
		
		"31",	// 正S1		[10, 20, 01, 11]
		"32",	// 正S2		[00, 01, 11, 12]
		
		"41",	// 反S1		[00, 10, 11, 21]
		"42",	// 反S2		[10, 01, 11, 02]
		
		"51",	// 正L1		[00, 01, 02, 12]
		"52",	// 正L2		[00, 10, 20, 01]
		"53",	// 正L3		[00, 10, 11, 12]
		"54",	// 正L4		[20, 01, 11, 21]
		
		"61",	// 反L1		[10, 11, 02, 12]
		"62",	// 反L2		[00, 01, 11, 21]
		"63",	// 反L3		[00, 10, 01, 02]
		"64",	// 反L4		[00, 10, 20, 21]
		
		"71",	// 土1		[10, 01, 11, 21]
		"72",	// 土2		[00, 01, 11, 02]
		"73",	// 土3		[00, 10, 20, 11]
		"74"	// 土4		[10, 01, 11, 12]
	],
	
	view: null,
	waitArea: null,
	currDiamond: null,
	nextDiamond: null,
	state: null,
	getRowType: function(row){
		var filledCount = 0;
		var emptyCount = 0;
		for(var j=0; j<Diamonds.VIEW_COLS; j++){
			var cell = row.cells[j+1];
			if(cell.type==Diamonds.CELL_TYPE_FILLED){
				filledCount++;
			}else if(cell.type==Diamonds.CELL_TYPE_EMPTY){
				emptyCount++;
			}
		}
		
		if(filledCount==Diamonds.VIEW_COLS){
			return Diamonds.ROW_TYPE_FILLED;
		}else if(filledCount==Diamonds.VIEW_COLS){
			return Diamonds.ROW_TYPE_EMPTY;
		}else{
			return Diamonds.ROW_TYPE_OTHER;
		}
	},
	getFilledCellByRowIndex: function(index){
		var cells = [];
		var row = this.view.rows[index];
		for(var i=0; i<Diamonds.VIEW_COLS; i++){
			var cell = row.cells[i+1];
			if(cell.type == Diamonds.CELL_TYPE_FILLED){
				cells.push(cell);
			}
		}
		return cells;
	},
	setCellEmptyByRowIndex: function(index){
		var row = this.view.rows[index];
		for(var i=0; i<Diamonds.VIEW_COLS; i++){
			var cell = row.cells[i+1];
			setEmptyCellStyle(cell);
		}
	},
	setCellFilledByRowIndex: function(index, cellStyle){
		var row = this.view.rows[index];
		for(var i=0; i<Diamonds.VIEW_COLS; i++){
			var cell = row.cells[i+1];
			setFilledCellStyle(cell, cellStyle);
		}
	},
	getFullRowIndexs: function(){
		var rowIndexs = [];
		var y = Diamonds.currDiamond.startY;
		var height = Diamonds.currDiamond.height;
		
		if(y>0){
			// 获取被可消除行
			for(var i=0; i<height; i++){
				var row = Diamonds.view.rows[y+i];
				var rowType = Diamonds.getRowType(row);
				
				if(rowType==Diamonds.ROW_TYPE_FILLED){
					rowIndexs.push(y+i);
				}
			}
		}
		return rowIndexs;
	},
	doFullRowRemove: function(rowIndexs){
		var y = Diamonds.currDiamond.startY;
		var height = Diamonds.currDiamond.height;
		
		// 其他行下移
		var count = 0;
		for(var i=0; i<y+height; i++){
			var rowIndex = (y+height) - (i+1);// 自下往上顺序
			if((","+rowIndexs.join(",")+",").indexOf(","+rowIndex+",")>-1){// 过滤已删除行
				count++;
				continue;
			}
			//var row = Diamonds.view.rows[rowIndex];
			var cells = Diamonds.getFilledCellByRowIndex(rowIndex);
			Diamonds.moveFilledCellsDownByRow(cells, count);
		}
	},
	blinkRows: function(rowIndexs, callback){
		Diamonds.state = Diamonds.GAME_STATE_STOP;
		for(var i=0; i<rowIndexs.length; i++){// 变白
			Diamonds.setCellFilledByRowIndex(rowIndexs[i], [Diamonds.VIEW_BGCOLOR, Diamonds.VIEW_BGCOLOR, Diamonds.VIEW_BGCOLOR]);
		}
		
		setTimeout(function(){
			for(var i=0; i<rowIndexs.length; i++){// 变灰
				Diamonds.setCellFilledByRowIndex(rowIndexs[i], [Diamonds.CELL_BGCOLOR, Diamonds.CELL_LTCOLOR, Diamonds.CELL_RBCOLOR]);
			}
		
			setTimeout(function(){
				for(var i=0; i<rowIndexs.length; i++){// 制空
					Diamonds.setCellEmptyByRowIndex(rowIndexs[i]);
				}
				
				setTimeout(function(){
					Diamonds.state = Diamonds.GAME_STATE_STARTED;
					callback();
				}, Diamonds.BLINK_TIME);
				
			}, Diamonds.BLINK_TIME);
			
		}, Diamonds.BLINK_TIME);
	},
	countMark: function(count){
		var markObj = document.getElementById("markObj");
		var gradeInput = document.getElementById("gradeInput");
		var grade = parseInt(gradeInput.value);
		var val = parseInt(markObj.value) + Diamonds.GAME_MARKRULE[count-1]*grade;
		markObj.value = val;
		if(val>=Diamonds.GAME_GRADE_MARK[grade]){
			gradeInput.value = grade+1;
		}
	},
	moveFilledCellsDownByRow: function(cells, count){
		for(var i=0; i<cells.length; i++){
			var cell = cells[i];
			var cellIndex = cell.cellIndex;
			var rowIndex = cell.parentNode.rowIndex;
			var targetCell = null;
			
			if(typeof count=="undefined"){
				for(var j=0; j<Diamonds.VIEW_ROWS-rowIndex; j++){//此段代码暂无使用
					var nextCell = Diamonds.view.rows[rowIndex+j+1].cells[cellIndex];
					if(nextCell.type!=Diamonds.CELL_TYPE_EMPTY){
						targetIndex = rowIndex+j;
						break;
					}else{
						targetCell = nextCell;
					}
				}
			}else if(count>0){
				targetCell = Diamonds.view.rows[rowIndex+count].cells[cellIndex];
			}
			
			if(targetCell!=null){
				setEmptyCellStyle(cell);//当前单元格设置为空
				setFilledCellStyle(targetCell, Diamonds.currDiamond.cellStyle);//目标单元格设置填充
			}
		}
	},
	changeDiamondStatus: function(){
		if(Diamonds.state != Diamonds.GAME_STATE_STARTED){
			return;
		}
		try{
			var valid = Diamonds.currDiamond.isValid(Diamonds.ACTION_CHANGE) && Diamonds.state==Diamonds.GAME_STATE_STARTED;
			if(valid){
				if(Diamonds.currDiamond!=null){
					Diamonds.currDiamond.changeStatus();
				}
			}
		}catch(e){}
	},
	checkAndRemoveFullRow: function(callback){
			//执行消除行操作
			var rowIndexs = Diamonds.getFullRowIndexs();
			
			if(rowIndexs.length>0){
				Diamonds.blinkRows(rowIndexs, function(){
					
					Diamonds.doFullRowRemove(rowIndexs);
					
					// 积分设置
					Diamonds.countMark(rowIndexs.length);
					
					// 产生新的方块
					callback();
				});
			}else{
				// 产生新的方块
				callback();
			}
	},
	moveDiamondDown: function(){
		if(Diamonds.state != Diamonds.GAME_STATE_STARTED){
			return;
		}
		try{
			var valid = Diamonds.currDiamond.isValid(Diamonds.ACTION_DOWN) && Diamonds.state==Diamonds.GAME_STATE_STARTED;
			if(!valid){//不可向下移动：执行消除行操作 && 产生新的方块
				//执行消除行操作
				Diamonds.checkAndRemoveFullRow(function(){
					// 产生新的方块
					Diamonds.next();
					if(Diamonds.currDiamond!=null){
						Diamonds.moveDiamondDown();
					}
				});
			}else{
				Diamonds.currDiamond.moveDown();
			}
			
		}catch(e){}
	},
	moveDiamondDownMax: function(){
		if(Diamonds.state != Diamonds.GAME_STATE_STARTED){
			return;
		}
		try{
			var valid = Diamonds.currDiamond.isValid(Diamonds.ACTION_DOWN) && Diamonds.state==Diamonds.GAME_STATE_STARTED;
			if(!valid){
				
				//执行消除行操作
				Diamonds.checkAndRemoveFullRow(function(){
					// 产生新的方块
					Diamonds.next();
					if(Diamonds.currDiamond!=null){
						Diamonds.moveDiamondDownMax();
					}
				});
				
			}else{
				Diamonds.currDiamond.moveDownMax();
			}
			
		}catch(e){}
	},
	moveDiamondLeft: function(){
		if(Diamonds.state != Diamonds.GAME_STATE_STARTED){
			return;
		}
		try{
			var valid = Diamonds.currDiamond.isValid(Diamonds.ACTION_LEFT) && Diamonds.state==Diamonds.GAME_STATE_STARTED;
			if(valid){
				if(Diamonds.currDiamond!=null){
					Diamonds.currDiamond.moveLeft();
				}
			}
		}catch(e){}
	},
	moveDiamondRight: function(){
		if(Diamonds.state != Diamonds.GAME_STATE_STARTED){
			return;
		}
		try{
			var valid = Diamonds.currDiamond.isValid(Diamonds.ACTION_RIGHT) && Diamonds.state==Diamonds.GAME_STATE_STARTED;
			if(valid){
				if(Diamonds.currDiamond!=null){
					Diamonds.currDiamond.moveRight();
				}
			}
		}catch(e){}
	},
	init: function(){
		// 界面
		this.view = createView();
		this.waitArea = createWaitArea();
		document.getElementById("mainArea").appendChild(this.view);
		document.getElementById("waitArea").appendChild(this.waitArea);
		this.resetValue();
		this.next();
		
		document.onkeydown = function(event){//事件绑定
			
			event = event || window.event;
			var keyCode = event.keyCode;
			
			if(Diamonds.state == Diamonds.GAME_STATE_STARTED){
				if(keyCode==Diamonds.BUTTON_UP){// 变换状态
					Diamonds.changeDiamondStatus();
				
				}else if(keyCode==Diamonds.BUTTON_DOWN){//下移
					Diamonds.moveDiamondDownMax();
				}else if(keyCode==Diamonds.BUTTON_LEFT){//左移
					Diamonds.moveDiamondLeft();
					
				}else if(keyCode==Diamonds.BUTTON_RIGHT){//右动
					Diamonds.moveDiamondRight();
				}else if(keyCode==Diamonds.BUTTON_ENTER){//回车
				}else if(keyCode==Diamonds.BUTTON_BLANK){//空格
					Diamonds.stop();
				}
			}else{
				return false;
			}
		}
	},
	getCell: function(x, y, area){
		if(typeof area == "undefined"){
			area = this.view;
		}
		
		var cell = null;
		var height = area.rows.length;
		if(y>=0 && y<=height){
			var width = area.rows[y].cells.length;
			if(x>=0 && x<=width){
				cell = area.rows[y].cells[x];
			}
		}
		return cell;
	},
	next: function(){
		if(this.nextDiamond!=null){
			if(Diamonds.state != Diamonds.GAME_STATE_STARTED){
				return;
			}
			Diamonds.checkOver();
			this.nextDiamond.hide(null, this.waitArea);
			this.currDiamond = this.nextDiamond;
			var startY = 0 - this.currDiamond.height;
			this.currDiamond.show(this.GAME_START_X, startY);
		}
		this.nextDiamond = createDiamond(ArrayUtil.selectFrom(this.DIAMOND_STATUS)).show(0, 0, this.waitArea);
	},
	checkOver: function(){
		if(Diamonds.currDiamond!=null && Diamonds.currDiamond.startY < 1){//此处的判断有待修正
			Diamonds.stop();
			if(confirm("游戏结束！是否再来？")){
				Diamonds.start();
			}
			throw new Error();
		}
	},
	execute: function(){
		var gradeIndex = getGradeIndex();
		var grade = Diamonds.GAME_GRADE[gradeIndex];
		Diamonds.moveDiamondDown();
		Diamonds.doTimeOut();//若无此语句，execute被调用多次时若如及时清除先前timeout，可能造成timeout重复
		Diamonds.timeOut = setTimeout(arguments.callee, grade);
	},
	start: function(){
		Diamonds.resetValue();
		Diamonds.state = Diamonds.GAME_STATE_STARTED;
		this.next();
		Diamonds.execute();
		toggleStartRestartBtn();
	},
	restart: function(){
		if(Diamonds.state == Diamonds.GAME_STATE_STARTED || Diamonds.state == Diamonds.GAME_STATE_STOP){
			Diamonds.stop();
			if(confirm("确认重新开始？")){
				Diamonds.start();
			}else{
				Diamonds.proceed();
			}
		}else if(Diamonds.state == Diamonds.GAME_STATE_OVER){
			Diamonds.start();
		}
	},
	stop: function(){
		if(Diamonds.state == Diamonds.GAME_STATE_STARTED){
			Diamonds.state = Diamonds.GAME_STATE_STOP;
			Diamonds.doTimeOut();
			toggleStopProceedBtn();
		}
	},
	proceed: function(){
		if(Diamonds.state == Diamonds.GAME_STATE_STOP){
			Diamonds.state = Diamonds.GAME_STATE_STARTED;
			Diamonds.execute();
			toggleStopProceedBtn();
		}
	},
	doTimeOut: function(){
		if(Diamonds.timeOut!=null){
			clearTimeout(Diamonds.timeOut);
		}
	},
	resetValue: function(){
		Diamonds.doTimeOut();
		Diamonds.setCellEmptyAll();
		Diamonds.currDiamond = null;
		Diamonds.state = Diamonds.GAME_STATE_NOSTART;
		document.getElementById("markObj").value = 0;
		document.getElementById("gradeInput").value = 1;
		document.getElementById("stopBtn").style.display = "";
		document.getElementById("proceedBtn").style.display = "none";
		document.getElementById("startBtn").style.display = "";
		document.getElementById("restartBtn").style.display = "none";
	},
	setCellEmptyAll: function(){
		// 屏幕方块清空
		var rows = this.view.rows;
		for(var i=1; i<rows.length-1; i++){
			var cells = rows[i].cells;
			for(var j=1; j<cells.length-1;j++){
				var cell = cells[j];
				if(cell.type == Diamonds.CELL_TYPE_FILLED){
					setEmptyCellStyle(cell);
				}
			}
		}
	}
}

function toggleStartRestartBtn(){
	var ids = ["startBtn", "restartBtn"];
	toggleBtn(ids);
}

function toggleStopProceedBtn(){
	var ids = ["stopBtn", "proceedBtn"];
	toggleBtn(ids);
}

function toggleBtn(ids){
	var btn0 = document.getElementById(ids[0]);
	var btn1 = document.getElementById(ids[1]);
	var display = btn0.style.display;
	btn0.style.display = ("none"==display) ? "" : "none";
	btn1.style.display = display;
}

function getGradeIndex(){
	var gradeInput = document.getElementById("gradeInput");
	var gradeIndex = gradeInput.value;
	
	if(gradeIndex<1){
		gradeIndex = 1;
		gradeInput.value = gradeIndex;
	}else if(gradeIndex>Diamonds.GAME_GRADE.length){
		gradeIndex = Diamonds.GAME_GRADE.length;
		gradeInput.value = gradeIndex;
	}
	
	return gradeIndex-1;
}

window.onload = function(){
	Diamonds.init();
}
/**
 * 1. 无法暂停; 仍然存在BUG
 * 2. 行消除有误【已解决】
 * 3. 分数设置
 */