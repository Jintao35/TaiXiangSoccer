// components/navBar.js
Component({
  // 组件的属性列表

  properties: {
    tabBar: {
      type: Object,
      value: ''
    },
    current_tab: {
      type: Number,
      value: ''
    }
  },

  // 组件的初始数据

  data: {
    width: '',
    current_tab:0
  },

  // 在组件完全初始化完毕、进入页面节点树后， attached 生命周期被触发。此时， this.data 已被初始化为组件的当前值。这个生命周期很有用，绝大多数初始化工作可以在这个时机进行

  attached: function () {
    let tabBar = this.data.tabBar,
      len = tabBar.length
    if (len) {  // 计算 每个 tab_view 宽度
      let width = 100 / len
      // console.log(width)
      this.setData({
        width: width
      })
    }
  },


  // 组件的方法列表

  methods: {
    // 切换顶部 tabBar 按钮 手动
    manual_tabBar(index) {
      // 自定义组件触发事件时，需要使用 triggerEvent 方法，指定事件名、detail对象和事件选项：
      const myEventDetail = { index } // detail对象，提供给事件监听函数 也就是指定页面绑定事件 中的 e.currentTarget.detail
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('switch_tabBar', myEventDetail, myEventOption)
      this.setData({
        current_tab: index
      })
    },

    // 切换顶部 tabBar 按钮 页面传过来的
    switch_tabBar: function (e) { // customMethod()
      let index = e.currentTarget.dataset.index
      // 自定义组件触发事件时，需要使用 triggerEvent 方法，指定事件名、detail对象和事件选项：
      const myEventDetail = { index } // detail对象，提供给事件监听函数 也就是指定页面绑定事件 中的 e.currentTarget.detail
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('switch_tabBar', myEventDetail, myEventOption)
      this.setData({
        current_tab: index
      })
    },
  }
})
