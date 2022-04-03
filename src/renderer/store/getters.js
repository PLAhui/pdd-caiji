

/**
 * 在这里则是state.文件名.状态名
 */
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  roles: state => state.user.roles,
  departs: state => state.user.departs,
  permission_routes: state => state.permission.routers,
  PinDuoDuoCaiJiData: state => state.gather.PinDuoDuo,
}

export default getters
