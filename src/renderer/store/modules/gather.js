/**
 * 采集相关数据
 * info []
 * {
 *   name:'',//采集器名称
 *   data:{}//采集的数据
 * }
 * @type {{mutations: {INSERT_DAIJI_PinDuoDuo: gather.mutations.INSERT_DAIJI_PinDuoDuo, SET_DAIJI_PinDuoDuo: gather.mutations.SET_DAIJI_PinDuoDuo, DELETE_DAIJI_PinDuoDuo: gather.mutations.DELETE_DAIJI_PinDuoDuo}, state: {PinDuoDuo: any}, actions: {SetPinDuoDuoCaiJiData({commit: *}, *): void, InsertPinDuoDuoCaiJiData({commit: *}, *): void, DeletePinDuoDuoCaiJiData({commit: *}, *): void}}}
 */
const  gather = {
  state: {
    //拼多多数据
    PinDuoDuo: JSON.parse(localStorage.getItem('CaiJiData_Pdd')),
    //1688数据
    Alibaba: JSON.parse(localStorage.getItem('CaiJiData_1688')),
    //天猫汽车数据
    CarZone:JSON.parse(localStorage.getItem('CarZone')),
  },

  mutations: {
    /**
     * 设置采集数据-天猫汽车
     * 首次初始化时调用
     * @param state
     * @param data
     * @constructor
     */
    SET_DAIJI_CarZone:(state, data) => {
      localStorage.setItem("CarZone", JSON.stringify(data));
      state.CarZone = data;
    },
    /**
     * 清空采集的数据
     * @param state
     * @param data
     * @constructor
     */
    DELETE_DAIJI_CarZone:(state, data) => {
      localStorage.setItem("CarZone", JSON.stringify([]));
      state.CarZone = [];
    },




    /**
     * 设置采集数据-拼多多
     * 首次初始化时调用
     * @param state
     * @param data
     * @constructor
     */
    SET_DAIJI_PinDuoDuo:(state, data) => {
      localStorage.setItem("CaiJiData_Pdd", JSON.stringify(data));
      state.PinDuoDuo = data;
    },


    /**
     * 插入拼多多数据
     * 每次采集到数据时
     * @param state
     * @param data
     * @constructor
     */
    INSERT_DAIJI_PinDuoDuo:(state, data) => {
      var PinDuoDuoData = JSON.parse(localStorage.getItem("CaiJiData_Pdd"))
      var list = [];
      data.items.forEach(res=>{
        list.push(res.item_data.goods_model)
      })
      data.items = list;
      PinDuoDuoData.push(data)
      localStorage.setItem("CaiJiData_Pdd", JSON.stringify(PinDuoDuoData));
      state.PinDuoDuo = PinDuoDuoData;
    },



    INSERT_DAIJI_CarZone:(state, data) => {
      var CarZone = JSON.parse(localStorage.getItem("CarZone"))
      var list = [];
      data.items.forEach(res=>{
        list.push(res)
      })
      data.items = list;
      CarZone.push(data)
      localStorage.setItem("CarZone", JSON.stringify(CarZone));
      state.CarZone = CarZone;
    },


    /**
     * 清空采集的数据
     * @param state
     * @param data
     * @constructor
     */
    DELETE_DAIJI_PinDuoDuo:(state, data) => {
      localStorage.setItem("CaiJiData_Pdd", JSON.stringify([]));
      state.PinDuoDuo = [];
    },


    /**
     * 设置采集数据-1688
     * 首次初始化时调用
     * @param state
     * @param data
     * @constructor
     */
    SET_CAIJI_Alibaba:(state, data) => {
      localStorage.setItem("CaiJiData_1688", JSON.stringify(data));
      state.Alibaba = data;
    },
    /**
     * 清空采集的数据
     * @param state
     * @param data
     * @constructor
     */
    DELETE_CAIJI_Alibaba:(state, data) => {
      console.log("清空采集器数据")
      localStorage.setItem("CaiJiData_1688", JSON.stringify({urls:[],result:[],errorUrls:[]}));
      state.Alibaba = {urls:[],result:[],errorUrls:[]};
    },
    /**
     * 1688
     * 导入网址库
     * @param state
     * @param data
     * @constructor
     */
    INSERT_DAIJI_Alibaba_Url:(state, data) => {
      const Alibaba = JSON.parse(localStorage.getItem("CaiJiData_1688"));
      Alibaba.urls=data
      localStorage.setItem("CaiJiData_1688", JSON.stringify(Alibaba));
      state.Alibaba = Alibaba;
    },

    /**
     * 添加采集数据【每采集一个则添加一个】
     * urls中移除此条采集成功链接
     * result:中存储采集成功的数据
     * errList:记录采集异常的数据
     * @param state
     * @param data
     * @constructor
     */
    ADD_DAIJI_Alibaba_INFO:(state, res) => {
      const Alibaba = JSON.parse(localStorage.getItem("CaiJiData_1688"));
      //删除采集到的元素
      let deleteIndex = Alibaba.urls.findIndex(item => item.url === res.item.url);
      Alibaba.urls.splice(deleteIndex,1);
      if(res.status){
        res.data['info'] = res.item
        Alibaba.result.push(res.data)
      }else {
        Alibaba.errorUrls.push(res.item)
      }
      localStorage.setItem("CaiJiData_1688", JSON.stringify(Alibaba));
      state.Alibaba = Alibaba;
    },

  },

  actions: {
    /**
     * 设置采集数据-拼多多
     * 首次初始化时调用
     * @param commit
     * @param data
     * @constructor
     */
    SetCarZoneCaiJiData({ commit },data) {
      commit("SET_DAIJI_CarZone", data);
    },
    DeleteCarZoneCaiJiData({ commit },data) {
      commit("DELETE_DAIJI_CarZone", data);
    },


    /**
     * 设置采集数据-拼多多
     * 首次初始化时调用
     * @param commit
     * @param data
     * @constructor
     */
    SetPinDuoDuoCaiJiData({ commit },data) {
      commit("SET_DAIJI_PinDuoDuo", data);
    },
    /**
     * 插入拼多多数据
     * 每次采集到数据时
     * @param commit
     * @param data
     * @constructor
     */
    InsertPinDuoDuoCaiJiData({ commit },data) {
      commit("INSERT_DAIJI_PinDuoDuo", data);
    },


    InsertCarZoneCaiJiData({ commit },data) {
      commit("INSERT_DAIJI_CarZone", data);
    },

    /**
     * 清空采集的数据
     * @param commit
     * @param data
     * @constructor
     */
    DeletePinDuoDuoCaiJiData({ commit },data) {
      commit("DELETE_DAIJI_PinDuoDuo", data);
    },

    /**
     * 初始化设置1688采集数据
     * @param commit
     * @param data
     * @constructor
     */
    SetAlibabCaiJiData({ commit },data) {
      commit("SET_CAIJI_Alibaba", data);
    },




    /**
     * 清空采集的数据
     * @param commit
     * @param data
     * @constructor
     */
    DeleteAlibabaCaiJiData({ commit },data) {
      commit("DELETE_CAIJI_Alibaba", data);
    },

    /**
     * 1688
     * 导入网址库
     * @param commit
     * @param data
     * @constructor
     */
    InsertAlibabaCaiJiUrl({ commit },data) {
      commit("INSERT_DAIJI_Alibaba_Url", data);
    },

    /**
     * 添加采集数据【每采集一个则添加一个】
     * urls中移除此条采集成功链接
     * result:中存储采集成功的数据
     * errList:记录采集异常的数据
     * @param commit
     * @param data
     * @constructor
     */
    AddAlibabaCaiJiInfo({ commit },data) {
      commit("ADD_DAIJI_Alibaba_INFO", data);
    },



  },
};

export default gather;
