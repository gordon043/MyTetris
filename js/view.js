/**
 * 创建界面
 */
function createView(){
	var view = document.createElement("table");
	
	view.style.width = CssUtil.getPixelLength((Diamonds.CELL_SIZE + Diamonds.CELL_BORDER * 2)*(Diamonds.VIEW_COLS+2));
	view.style.height = CssUtil.getPixelLength((Diamonds.CELL_SIZE + Diamonds.CELL_BORDER * 2)*(Diamonds.VIEW_ROWS+2));
	
	view.cellSpacing = 0;
	view.cellPadding = 0;
	
	for(var i=0; i<Diamonds.VIEW_ROWS+2; i++){
		var row = view.insertRow(i);
		for(var j=0; j<Diamonds.VIEW_COLS+2; j++){
			var cell = row.insertCell(j);
			
			var isBorder =  ( (i%(Diamonds.VIEW_ROWS+1)==0) || (j%(Diamonds.VIEW_COLS+1)==0));
			if(isBorder){
				setBorderCellStyle(cell);
			}else{
				setEmptyCellStyle(cell);
			}
		}
	}
	
	return view;
}

function createWaitArea(){
	var waitArea = document.createElement("table");
	var cols = 4;
	var rows = 4;
	
	waitArea.style.width = CssUtil.getPixelLength((Diamonds.CELL_SIZE + Diamonds.CELL_BORDER * 2)*cols +2);
	waitArea.style.height = CssUtil.getPixelLength((Diamonds.CELL_SIZE + Diamonds.CELL_BORDER * 2)*rows +2);
	
	waitArea.cellSpacing = 0;
	waitArea.cellPadding = 0;
	
	for(var i=0; i<cols; i++){
		var row = waitArea.insertRow(i);
		for(var j=0; j<rows; j++){
			var cell = row.insertCell(j);
			setEmptyCellStyle(cell);
			//cell.style.border = "1px solid #999";

		}
	}
	
	waitArea.style.border = "1px solid #000";
	return waitArea;
}

/**
 * 设置单元格样式
 */
function setCellStyle(cell, bgColor, ltColor, rgColor, type){
	
	cell.width = CssUtil.getPixelLength(Diamonds.CELL_SIZE);
	cell.height = CssUtil.getPixelLength(Diamonds.CELL_SIZE);
	
	cell.style.backgroundColor = bgColor;
	cell.style.border = CssUtil.getPixelLength(Diamonds.CELL_BORDER) + " solid";
	cell.style.borderColor = ltColor + " " + rgColor + " " + rgColor + " " + ltColor;
	
	cell.empty = "show";
	
	cell.type = type;
}

// 设置边界单元格样式
function setBorderCellStyle(cell){
	setCellStyle(cell, Diamonds.BORDER_BGCOLOR, Diamonds.BORDER_LTCOLOR, Diamonds.BORDER_RBCOLOR, Diamonds.CELL_TYPE_BORDER);
}

// 设置被占据的单元格样式
function setFilledCellStyle(cell, ss){
	if(typeof ss == "undefined"){
		ss = [Diamonds.CELL_BGCOLOR, Diamonds.CELL_LTCOLOR, Diamonds.CELL_RBCOLOR];
	}
	//var ss = ArrayUtil.selectFrom(Diamonds.CELL_STYLE_ARRAY);
	setCellStyle(cell, ss[0], ss[1], ss[2], Diamonds.CELL_TYPE_FILLED);
}

// 设置空单元格样式
function setEmptyCellStyle(cell){
	setCellStyle(cell, Diamonds.VIEW_BGCOLOR, Diamonds.VIEW_BGCOLOR, Diamonds.VIEW_BGCOLOR, Diamonds.CELL_TYPE_EMPTY);
}


/**
 * 创建方块
 */
function createDiamond(status){
	var coordinates = [];
	var nextStatus = null;
	var width = 0;
	var height = 0;
	var cellStyle = ArrayUtil.selectFrom(Diamonds.CELL_STYLE_ARRAY);
	switch(status){
			case Diamonds.DIAMOND_STATUS[0]:// 正方形
				coordinates = [
					[0, 0],
					[1, 0],
					[0, 1],
					[1, 1]
				];
				nextStatus = null;
				width = 2;
				height = 2;
				break;
			
			case Diamonds.DIAMOND_STATUS[1]:// 长条1
				coordinates = [
					[0, 0],
					[1, 0],
					[2, 0],
					[3, 0]
				];
				nextStatus = Diamonds.DIAMOND_STATUS[2];
				width = 4;
				height = 1;
				break;
				
			case Diamonds.DIAMOND_STATUS[2]:// 长条2
				coordinates = [
					[0, 0],
					[0, 1],
					[0, 2],
					[0, 3]
				];
				nextStatus = Diamonds.DIAMOND_STATUS[1];
				width = 1;
				height = 4;
				break;
				
			case Diamonds.DIAMOND_STATUS[3]:// 正S1
				coordinates = [
					[1, 0],
					[2, 0],
					[0, 1],
					[1, 1]
				];
				nextStatus = Diamonds.DIAMOND_STATUS[4];
				width = 3;
				height = 2;
				break;
				
			case Diamonds.DIAMOND_STATUS[4]:// 正S2
				coordinates = [
					[0, 0],
					[0, 1],
					[1, 1],
					[1, 2]
				];
				nextStatus = Diamonds.DIAMOND_STATUS[3];
				width = 2;
				height = 3;
				break;
				
			case Diamonds.DIAMOND_STATUS[5]:// 反S1
				coordinates = [
					[0, 0],
					[1, 0],
					[1, 1],
					[2, 1]
				];
				nextStatus = Diamonds.DIAMOND_STATUS[6];
				width = 3;
				height = 2;
				break;
				
			case Diamonds.DIAMOND_STATUS[6]:// 反S2
				coordinates = [
					[1, 0],
					[0, 1],
					[1, 1],
					[0, 2]
				];
				nextStatus = Diamonds.DIAMOND_STATUS[5];
				width = 2;
				height = 3;
				break;
			
			case Diamonds.DIAMOND_STATUS[7]:// 正L1
				coordinates = [
					[0, 0],
					[0, 1],
					[0, 2],
					[1, 2]
				];
				nextStatus = Diamonds.DIAMOND_STATUS[8];
				width = 2;
				height = 3;
				break;
				
			case Diamonds.DIAMOND_STATUS[8]:// 正L2
				coordinates = [
					[0, 0],
					[1, 0],
					[2, 0],
					[0, 1]
				];
				nextStatus = Diamonds.DIAMOND_STATUS[9];
				width = 3;
				height = 2;
				break;
				
			case Diamonds.DIAMOND_STATUS[9]:// 正L3
				coordinates = [
					[0, 0],
					[1, 0],
					[1, 1],
					[1, 2]
				];
				nextStatus = Diamonds.DIAMOND_STATUS[10];
				width = 2;
				height = 3;
				break;
				
			case Diamonds.DIAMOND_STATUS[10]:// 正L4
				coordinates = [
					[2, 0],
					[0, 1],
					[1, 1],
					[2, 1]
				];
				nextStatus = Diamonds.DIAMOND_STATUS[7];
				width = 3;
				height = 2;
				break;
				
			case Diamonds.DIAMOND_STATUS[11]:// 反L1
				coordinates = [
					[1, 0],
					[1, 1],
					[0, 2],
					[1, 2]
				];
				nextStatus = Diamonds.DIAMOND_STATUS[12];
				width = 2;
				height = 3;
				break;
				
			case Diamonds.DIAMOND_STATUS[12]:// 反L2
				coordinates = [
					[0, 0],
					[0, 1],
					[1, 1],
					[2, 1]
				];
				nextStatus = Diamonds.DIAMOND_STATUS[13];
				width = 3;
				height = 2;
				break;
				
			case Diamonds.DIAMOND_STATUS[13]:// 反L3
				coordinates = [
					[0, 0],
					[1, 0],
					[0, 1],
					[0, 2]
				];
				nextStatus = Diamonds.DIAMOND_STATUS[14];
				width = 2;
				height = 3;
				break;
				
			case Diamonds.DIAMOND_STATUS[14]:// 反L4
				coordinates = [
					[0, 0],
					[1, 0],
					[2, 0],
					[2, 1]
				];
				nextStatus = Diamonds.DIAMOND_STATUS[11];
				width = 3;
				height = 2;
				break;
				
			case Diamonds.DIAMOND_STATUS[15]:// 土1
				coordinates = [
					[1, 0],
					[0, 1],
					[1, 1],
					[2, 1]
				];
				nextStatus = Diamonds.DIAMOND_STATUS[16];
				width = 3;
				height = 2;
				break;
				
			case Diamonds.DIAMOND_STATUS[16]:// 土2
				coordinates = [
					[0, 0],
					[0, 1],
					[1, 1],
					[0, 2]
				];
				nextStatus = Diamonds.DIAMOND_STATUS[17];
				width = 2;
				height = 3;
				break;
				
			case Diamonds.DIAMOND_STATUS[17]:// 土3
				coordinates = [
					[0, 0],
					[1, 0],
					[2, 0],
					[1, 1]
				];
				nextStatus = Diamonds.DIAMOND_STATUS[18];
				width = 3;
				height = 2;
				break;
				
			case Diamonds.DIAMOND_STATUS[18]:// 土4
				coordinates = [
					[1, 0],
					[0, 1],
					[1, 1],
					[1, 2]
				];
				nextStatus = Diamonds.DIAMOND_STATUS[15];
				width = 2;
				height = 3;
				break;
	};
	
	var diamond = {
		width: width,
		height: height,
		status: status,
		nextStatus: nextStatus,
		coordinates: coordinates,
		startX: 0,
		startY: 0,
		cellStyle: cellStyle,
		
		show: function(x, y, area){
			
			if(typeof area == "undefined"){
				area = Diamonds.view;
			}
			
			this.startX = x;
			this.startY = y;
			for(var i=0; i<this.coordinates.length;i++){
				x = this.coordinates[i][0] + this.startX;
				y = this.coordinates[i][1] + this.startY;
				var cell = Diamonds.getCell(x, y, area);
				this.changeCellStyle(cell, Diamonds.CELL_TYPE_FILLED);
			}
			return this;
		},
		hide: function(hidePoints, area){
			
			if(typeof area == "undefined"){
				area = Diamonds.view;
			}
			
			if(typeof hidePoints == "undefined" || hidePoints==null){
				hidePoints = [];
				for(var i=0; i<this.coordinates.length;i++){
					var x = this.coordinates[i][0] + this.startX;
					var y = this.coordinates[i][1] + this.startY;
					hidePoints.push([x, y]);
				}
			}
			
			for(var i=0; i<hidePoints.length;i++){
				var x = hidePoints[i][0];
				var y = hidePoints[i][1];
				var cell = Diamonds.getCell(x, y, area);
				this.changeCellStyle(cell, Diamonds.CELL_TYPE_EMPTY);
			}
			return this;
		},
		changeCellStyle: function(cell, toType){
			if(cell!=null && cell.type!=toType && cell.type!=Diamonds.CELL_TYPE_BORDER){
				if(toType== Diamonds.CELL_TYPE_FILLED){
					setFilledCellStyle(cell, this.cellStyle);
				}else if(toType == Diamonds.CELL_TYPE_EMPTY){
					setEmptyCellStyle(cell);
				}
			}
		},
		_isValid: function(newX, newY, diamond, newShowPoints){
			
			if(typeof diamond == "undefined"){
				diamond = this;
			}
			
			var width = diamond.width;
			var height = diamond.height;
			var valid = (newX >=1 && newX+(width-1) <= Diamonds.VIEW_COLS) && (newY+(height-1) <= Diamonds.VIEW_ROWS);//newY >=1 && 
			
			if(valid){
				for(var i=0; i<newShowPoints.length;i++){
					var x = newShowPoints[i][0];
					var y = newShowPoints[i][1]; 
					if(y<1){// 新增方块
						continue;
					}
					var cell = Diamonds.getCell(x, y);
					valid = (cell.type == Diamonds.CELL_TYPE_EMPTY);
					
					if(!valid){
						//alert("x: "+x+" width:"+width+"\ny: "+y+" height:"+height+"\nis invalid...");
						break;
					}
				}
			}
			
			return valid;
		},
		
		_getSubtractPoints: function(diamond1, diamond2){
			var substractPoints = [];
			var points1 = diamond1.coordinates;
			var points2 = diamond2.coordinates;
			var sx1 = diamond1.startX;
			var sy1 = diamond1.startY;
			var sx2 = diamond2.startX;
			var sy2 = diamond2.startY;
			for(var i=0; i<points1.length;i++){
				var oldX = points1[i][0]+ sx1;
				var oldY = points1[i][1]+ sy1;
				
				var exist = false;
				for(var j = 0; j<points2.length;j++){
					var newX = points2[j][0]+ sx2;
					var newY = points2[j][1]+ sy2;
					
					var exist = (oldX == newX && oldY == newY);
					
					if(exist){
						break;
					}
				}
				
				if(!exist){
					substractPoints.push([oldX, oldY]);
				}
				
			}
			return substractPoints;
		},
		_doDiamondMove: function(newStartX, newStartY){
			var diamond2 = {
				coordinates: this.coordinates,
				startX: newStartX,
				startY: newStartY
			};
			var oldPoinds = this._getSubtractPoints(this, diamond2);
			this.hide(oldPoinds);
			this.show(newStartX, newStartY);
		},
		getValidDownMax: function(){
			var newStartX = this.startX;
			var newStartY = this.startY;
			var diamond2 = {
				coordinates: this.coordinates,
				startX: newStartX,
				startY: newStartY
			};
			
			for(var i=1; i<=Diamonds.VIEW_ROWS - this.startY; i++){
				newStartY = this.startY + i;
				diamond2.startY = newStartY;
				var newPoints = this._getSubtractPoints(diamond2, this);
				var valid = this._isValid(newStartX, newStartY, this, newPoints);
				if(!valid){
					diamond2.startY = this.startY + (i-1);
					break;
				}
			}
			
			return (diamond2.startY - this.startY);
		},
		isValid: function(actionType){
			var valid = false;
			var newStartX;
			var newStartY;
			var diamond = this;
			
			switch(actionType){
				case Diamonds.ACTION_CHANGE: 
					if(this.nextStatus==null){
						return false;
					}else{
						newStartX = this.startX;
						newStartY = this.startY;
						diamond = createDiamond(this.nextStatus);
					}
					break;
					
				case Diamonds.ACTION_DOWN: 
					newStartX = this.startX;
					newStartY = this.startY + 1;
					
					/**/
					if(newStartY<1){
						if(newStartY + this.height<1){//新增方块, 方块完全在边界以外
							return true;
						}else{
							// 部分单元格在边界外，部分在边界内
						}
					}
					
					break;
					
				case Diamonds.ACTION_LEFT: 
					newStartX = this.startX - 1;
					newStartY = this.startY;
					break;
					
				case Diamonds.ACTION_RIGHT: 
					newStartX = this.startX + 1;
					newStartY = this.startY;
					break;
			}
			
			var tmp = {
				coordinates: diamond.coordinates,
				startX: newStartX,
				startY: newStartY
			};
			
			var newPoints = this._getSubtractPoints(tmp, this);
			valid = this._isValid(newStartX, newStartY, diamond, newPoints);
			
			return valid;
		},
		/**
		 * 变换状态
		 */
		changeStatus: function(){
			
			var x = this.startX;
			var y = this.startY;
			
			var newDiamond = createDiamond(this.nextStatus);
			var diamond2 = {
				coordinates: newDiamond.coordinates,
				startX: x,
				startY: y
			};
			newDiamond.cellStyle = this.cellStyle;
			var oldPoinds = this._getSubtractPoints(this, diamond2);
			this.hide(oldPoinds);
			newDiamond.show(x, y);
			Diamonds.currDiamond = newDiamond;
			
		},
		
		/**
		 * 下移
		 */
		moveDown: function (){
			this._doDiamondMove(this.startX, this.startY + 1);
		},
		
		/**
		 * 下移2
		 */
		moveDownMax: function (){
			var y = this.getValidDownMax();
			this._doDiamondMove(this.startX, this.startY + y);
		},
		/**
		 * 左移
		 */
		moveLeft: function (){
			this._doDiamondMove(this.startX - 1, this.startY);
		},

		/**
		 * 右移
		 */
		moveRight: function (){
			this._doDiamondMove(this.startX + 1, this.startY);
		}
	};
	
	return diamond;
}