// 图片压缩递归，小于1M跳出
export function  imageCompress(file){
	
	
}


export function formatRichText(html){
  let newContent= html.replace(/<img[^>]*>/gi,function(match,capture){
      match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
      match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
      match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
      return match;
  });
  newContent = newContent.replace(/style="[^"]+"/gi,function(match,capture){
      match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
      return match;
  });
  newContent = newContent.replace(/<br[^>]*\/>/gi, '');
  newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;margin:10px 0;"');
  return newContent;
}
 export function HashMap(){
	//定义长度
	var length=0;
	//创建一个对象
	var obj=new Object();

	//判断Map是否为空
	this.isEmpty=function(){
		return length==0;
	}

	//判断对象中是否包含给定Key
	this.containsKey=function(key){
		return (key in obj);
	}

	//判断对象中是否包含给定的Value
	this.containsValue=function(value){
		for(var key in obj){
			if(obj[key]==value){
				return true; 
			}
		}
		return false;
	}

	//向map中添加数据
	this.put=function(key,value){
		if(!this.containsKey(key)){
			length++;
		}
		obj[key]=value;
	}

	//根据给定的key获取Value
	this.get=function(key){
		return this.containsKey(key)?obj[key]:null;
	}

	//根据给定的Key删除一个值
	this.remove=function(key){
		if(this.containsKey(key)&&(delete obj[key])){
			length--;
		}
	}

	//获得Map中所有的value
	this.values=function(){
		var _values=new Array();
		for(var key in obj){
			_values.push(obj[key]);
		}
		return _values;
	}

	//获得Map中的所有key
	this.keySet=function(){
		var _keys=new Array();
		for(var key in obj){
			_keys.push(key);
		}
		return _keys;
	}

	//获得Map的长度
	this.size=function(){
		return length;
	}

	//清空Map
	this.clear=function(){
		length=0;
		obj=new Object();
	}
	
}
