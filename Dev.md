开启采集后 按钮应该切换为暂停，并增加暂停控制

列表显示有问题

定时器循环请求bug，改为生成配置文件 采集

采集信息中增加采集的链接


vuex使用
```coffeescript
export default new Vuex.Store({
  modules,
  getters
})
```

```coffeescript
/**
 * 在这里则是state.文件名.状态名
 */
const getters = {
  gather: state => state.gather.info,
}
export default getters

```

```
const  gather = {
  state: {
    info: JSON.parse(localStorage.getItem('gather')),
  },

  mutations: {
    SET_GATHER: (state, gather) => {
      localStorage.setItem("gather", JSON.stringify(gather));
      state.info = gather;
    },
  },

  actions: {
    //设置采集数据
    SetGather({ commit }, data) {
      return new Promise((resolve, reject) => {
        commit("SET_GATHER", data);
        resolve();
      });
    },
  },
};

export default gather;
```

```coffeescript
import { mapGetters } from "vuex";
computed: {
  //取值
 ...mapGetters(["gather"])
}
created() {
 console.log("gather",this.gather)
}
//设置值
this.$store.dispatch('SetGather',new Date().getTime())
```



bus使用
  httpData :  监听发送打开网页的http请求数据



目录结构：
```coffeescript
  src
    main 
      common
        index.js   监听网页http请求，并通过进程通信发送给渲染线程
      services  窗体和主进程的一些配置
    renderer
      api http请求接口配置
      mixins 采集器组件的方法
```

bug:
采集弹窗显示异常
未能自动关闭

采集流程异常，如出现登录时，还会弹出下一个弹出
