import { Executable, VueModule } from '@/core/common-types'

/** 表示 LaunchBar 里的一个动作 */
export interface LaunchBarAction {
  /** 名称 */
  name: string
  /** 要渲染的内容, 是一个导入Vue模块的函数, 省略则直接使用`name` */
  content?: Executable<VueModule>
  /** 用户选择此动作时要执行的代码 */
  action: Executable
}
/** LaunchBar 动作提供者的插件key, 可注入其他提供者 */
export const LaunchBarActionProviders = 'launch-bat-action-providers'
/** 表示 LaunchBar 动作提供者, LaunchBar 在搜索时会遍历所有提供者 */
export interface LaunchBarActionProvider {
  /** 名称 */
  name: string
  /** 为 LaunchBar 提供搜索结果, 参数为用户输入的关键词 */
  getActions: (input: string) => Promise<LaunchBarAction[]>
  /** 获取用户按下 Enter 时的动作, 可以覆盖默认的搜索行为, 返回`null`表示不覆盖 */
  getEnterAction?: (input: string) => ((input: string) => void) | null
}