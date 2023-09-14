const tools = {
    随机数(min,max){
        return Math.floor(Math.random()*(max+1-min)+min);
    },
    async 载入文件(name){
        try{
            let url = `./人生重开日常/词库/${name}.json`;
            let data = await $.getJSON(url,(data)=>{
                    return data;
            })
            return data;
        }catch(e){
            // console.log(e);
        }
        
    }
}