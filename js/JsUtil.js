CssUtil = {
	getPixelLength: function(num){
		return (num>0 ? num : 0) + "px";
	}
}

MathUtil = {
	selectFrom: function(lowerNum, upperNum){//获取lowerNum与upperNum之间（包括二者）的随机数
		var choices = upperNum - lowerNum + 1;
		return Math.floor(Math.random() * choices + lowerNum);
	}
}

ArrayUtil = {
	selectFrom: function(array){
		var index = MathUtil.selectFrom(0, array.length-1);
		return array[index];
	}
}