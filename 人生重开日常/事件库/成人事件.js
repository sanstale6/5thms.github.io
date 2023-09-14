class 成人事件库 extends 事件库模板 {
    constructor(){
        super();
        this.执行列表 = ['结婚','离婚']
    }
    结婚(){
        if((!属性.isMarried) && 属性.age >= 24 && (tools.随机数(1,3) == 1)){
            添加状态('已婚','good');
            设置属性({isMarried:true});
            添加词条(`<span style="color:red">你结婚了</span>`);
        }
    }
    离婚(){
        if(!属性.isMarried || (tools.随机数(1,3) != 1) || 属性.hasChild) return;
        抉择中心.创建抉择窗口('你的老婆决定跟你离婚',[{text:'痛哭挽留'},{text:'淡然同意'}]);
        订阅事件('痛哭挽留',()=>{
            if(tools.随机数(1,3) != 1){
                添加词条("[你的老婆决定跟你离婚] 你的动人挽留起到了效果,你的婚姻得到了勉强的维持");
            }else{
                添加词条("[你的老婆决定跟你离婚] 即使你一再挽留,你的老婆还是毅然决然跟你离婚了");
                删除状态('已婚');
                添加状态('离异','bad');
                设置属性({isMarried:false});
            }
            return true;
        })
        订阅事件('淡然同意',()=>{
            设置属性({isMarried:false});
            删除状态('已婚');
            添加状态('离异','bad');
            添加词条("[你的老婆决定跟你离婚] 你的冷淡让你的老婆更加痛心-你离婚了,真悲惨");
            return true;
        })
        // if(confirm('你的老婆决定跟你离婚,是否挽留??')){
        //     if(tools.随机数(1,3) != 1){
        //         添加词条("你的动人挽留起到了效果,你的婚姻得到了勉强的维持");
        //     }else{
        //         添加词条("即使你一再挽留,你的老婆还是毅然决然跟你离婚了");
        //         删除状态('已婚');
        //         添加状态('离异','bad');
        //         设置属性({isMarried:false});
        //     }
        // }else{
        //     设置属性({isMarried:false});
        //     删除状态('已婚');
        //     添加状态('离异','bad');
        //     添加词条("你的冷淡让你的老婆更加痛心-你离婚了,真悲惨");
        // }
    }
}
let 事件库 = new 成人事件库();
export default 事件库;