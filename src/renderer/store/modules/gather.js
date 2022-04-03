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
  },

  mutations: {
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
      localStorage.setItem("CaiJiData_1688", JSON.stringify({urls:[]}));
      state.Alibaba = {urls:[]};
    },
    /**
     * 1688
     * 导入网址库
     * @param state
     * @param data
     * @constructor
     */
    INSERT_DAIJI_Alibaba_Url:(state, data) => {
      console.log(data)
      var Alibaba = JSON.parse(localStorage.getItem("CaiJiData_1688"))
      console.log(Alibaba.urls.length)
      Alibaba.urls=data
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


  },
};

export default gather;
