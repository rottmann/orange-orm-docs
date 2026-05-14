import DefaultTheme from 'vitepress/theme'
import './custom.css'

import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // $projectName - "Orange" in shades of orange
    Object.defineProperty(app.config.globalProperties, '$projectName', {
      get: () =>
        `<span style="font-weight: bold;"><span style="color: #f7931e;">O</span><span style="color: #f8a33f;">r</span><span style="color: #f9b361;">a</span><span style="color: #fac383;">n</span><span style="color: #fbd3a5;">g</span><span style="color: #fde4c7;">e</span></span>`,
      enumerable: true,
      configurable: true,
    })

    // $projectFullName - "Orange ORM" in shades of orange
    Object.defineProperty(app.config.globalProperties, '$projectFullName', {
      get: () =>
        `<span style="font-weight: bold;"><span style="color: #f7931e;">O</span><span style="color: #f8a33f;">ra</span><span style="color: #f9b361;">n</span><span style="color: #fac383;">ge</span> <span style="color: #fbd3a5;">O</span><span style="color: #fde4c7;">RM</span></span>`,
      enumerable: true,
      configurable: true,
    })
  },
} satisfies Theme
