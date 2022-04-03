const user = {
  state: {
    token: JSON.parse(localStorage.getItem('token')),
    userInfo: JSON.parse(localStorage.getItem('userInfo')),
    roles: JSON.parse(localStorage.getItem('roles')),
    departs: JSON.parse(localStorage.getItem('departs'))
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      localStorage.setItem("token", JSON.stringify(token));
      state.token = token;
    },
    SET_INFO: (state, userInfo) => {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      state.userInfo = userInfo;
    },
    SET_ROLES: (state, roles) => {
      localStorage.setItem("roles", JSON.stringify(roles));
      state.roles = roles;
    },
    SET_DEPARTS: (state, departs) => {
      localStorage.setItem("departs", JSON.stringify(departs));
      state.departs = departs;
    },
  },

  actions: {
    // 登录
    Login({ commit }, data) {
      return new Promise((resolve, reject) => {
          commit("SET_TOKEN", data.token);
          commit("SET_INFO", data.userInfo);
          commit("SET_DEPARTS", data.departs);
        // if (data.username.includes("admin")) {
        //   commit("SET_TOKEN", "admin");
        //   commit("SET_NAME", "Super Admin");
        //
        // } else {
        //   commit("SET_TOKEN", "edit");
        //   commit("SET_NAME", "Edit");
        // }

        resolve();
      });
    },

    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        commit("SET_TOKEN","");
        commit("SET_INFO","");
        commit("SET_ROLES", "");
        commit("SET_DEPARTS", "");
        resolve();
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise((resolve) => {
        commit("SET_TOKEN", "");
        resolve();
      });
    },
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        var rolesList = [];
        state.departs.forEach(item=>{
          if(item.orgCode=='A03A01'){//采集器用户组
            rolesList.push('PDD')
          }
          if(item.orgCode=='A01'){//超级管理员用户组
            rolesList.push('admin')
          }
        })
        commit("SET_ROLES", rolesList);
        // if (state.token.includes("admin")) {
        //   commit("SET_ROLES", ["admin"]);
        // } else {
        //   commit("SET_ROLES", ["edit"]);
        // }
        resolve(state);
      });
    },
  },
};

export default user;
