---
category: 组件
type: Data Display
title: Swipe
subtitle: 轮播
---

组件提供轮播功能，支持手势滑动，需要在移动端环境下可以查看效果

## API

属性 | 说明 | 类型 | 默认值
---- |-----|------|-----
| autoPlay | 是否自滚动 | boolean | false |
| initIndex | 默认起始索引 | number | 0 |
| showIndicators | 是否显示指示器 | boolean | true |
| indicatorColor | 指示器颜色 | string | #ffffff |
| indicatorType | 指示器形式，`dot`圆点、`number`数字，两种类型 | string | dot |
| autoPlayDelay | 滚动间隔时间，单位ms | number | 3000 |
| imgsArr | 轮播数据 | array | [] |
| autoDir | 滚动方向，`row`横向，`column`纵向 | string | row |
| swipeW | 轮播宽度, 包括：数字，百分比。 | number \| string | 100% |
| swipeH | 轮播高度, 包括：数字。纵向滚动必须设置高度 | number | auto |
