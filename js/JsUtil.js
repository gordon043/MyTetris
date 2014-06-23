CssUtil = {
	getPixelLength: function(num){
		return (num>0 ? num : 0) + "px";
	}
}

MathUtil = {
	selectFrom: function(lowerNum, upperNum){//��ȡlowerNum��upperNum֮�䣨�������ߣ��������
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