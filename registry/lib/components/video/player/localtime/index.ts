import { ComponentMetadata, ComponentEntry } from '@/components/types'
import { playerAgent } from '@/components/video/player-agent'
import { videoChange } from '@/core/observer'
import { addComponentListener } from '@/core/settings'
import { allVideoUrls } from '@/core/utils/urls'

let intervalID
let updateFunc = none

const parseTime = (t: Date, options: any): string => {
  let hours = t.getHours()
  let minutes = t.getMinutes().toFixed()
  let seconds = t.getSeconds().toFixed()

  if (Number(minutes) < 10) {
    minutes = minutes.padStart(2, '0')
  }

  if (Number(seconds) < 10) {
    seconds = seconds.padStart(2, '0')
  }

  if (!options?.TFFormat && hours > 12) {
    hours -= 12
  }

  const timeStr = `${hours}:${minutes}`
  return options?.showSecond ? `${timeStr}:${seconds}` : timeStr
}

enum Position {
  TR = '右上角',
  TL = '左上角',
}

const entry: ComponentEntry = async ({ settings: { options }, metadata }) => {
  const time = document.createElement('span')
  time.id = 'cur-time'
  const style = {
    position: 'absolute',
    top: '0',
    right: '0',
    zIndex: '10',
    fontFamily: 'Arial',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '1rem',
  }
  const dyStyle = {
    color: options.color,
    opacity: options.opacity,
    fontFamily: options.fontFamily,
    fontSize: `${options.fontSize}px`,
  }

  // 绑定样式
  Object.keys(Object.assign(style, dyStyle)).forEach(key => {
    time.style[key] = style[key]
  })

  // 绑定动态样式
  Object.keys(dyStyle).forEach(key => {
    addComponentListener(`${metadata.name}.${key}`, (value: string) => {
      if (key === 'fontSize') {
        time.style.fontSize = `${value}px`
      } else {
        time.style[key] = value
      }
    })
  })

  addComponentListener(
    `${metadata.name}.position`,
    (value: string) => {
      if (value === Position.TR) {
        time.style.left = ''
        time.style.right = '0'
      } else if (value === Position.TL) {
        time.style.right = ''
        time.style.left = '0'
      }
    },
    true,
  )

  videoChange(async () => {
    const video = await playerAgent.query.video.wrap()
    video.appendChild(time)
  })

  updateFunc = () => {
    const t = new Date()
    time.innerHTML = parseTime(t, options)
  }
  intervalID = setInterval(updateFunc, 1000)
}
export const component: ComponentMetadata = {
  name: 'videoCurTime',
  author: {
    name: 'FoundTheWOUT',
    link: 'https://github.com/FoundTheWOUT',
  },
  description: {
    'zh-CN': '在视频的右上角显示当前时间',
  },
  displayName: '视频内显示时间',
  entry,
  reload() {
    document.getElementById('cur-time').style.visibility = ''
    intervalID = setInterval(updateFunc, 1000)
  },
  unload() {
    document.getElementById('cur-time').style.visibility = 'hidden'
    clearInterval(intervalID)
  },
  tags: [componentsTags.video],
  options: {
    opacity: {
      slider: {
        max: 1,
        min: 0,
        step: 0.01,
      },
      defaultValue: 0.5,
      displayName: '透明度',
    },
    color: {
      color: true,
      defaultValue: '#d1d5db',
      displayName: '颜色',
    },
    showSecond: {
      defaultValue: false,
      displayName: '显示秒',
    },
    TFFormat: {
      defaultValue: true,
      displayName: '24小时制',
    },
    position: {
      defaultValue: Position.TR,
      displayName: '位置',
      dropdownEnum: Position,
    },
    fontFamily: {
      defaultValue: '',
      displayName: '字体',
    },
    fontSize: {
      defaultValue: 24,
      displayName: '尺寸',
      slider: {
        min: 10,
        max: 100,
        step: 1,
      },
    },
  },
  urlInclude: allVideoUrls,
}
