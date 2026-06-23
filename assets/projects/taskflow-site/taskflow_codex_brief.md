# TaskFlow / FlowCue 商品介绍网页 Codex 开发说明

> 项目目标：把现有 10 张网页视觉稿落成一个可运行的网页 Demo。  
> 产品定位：面向 AI 眼镜的动态任务协作系统。重点不是硬件形态，而是“复杂任务如何被拆解、提醒、纠错、恢复、沉淀”。

---

## 1. 最重要的设计原则

1. **不要做成参数型硬件官网。**  
   这个网页不是卖摄像头像素、重量、续航，而是展示 TaskFlow 如何在复杂任务中帮助用户保持清晰感知。

2. **不要堆信息。**  
   产品图和核心视觉周围必须留白。每屏只讲一个核心点。

3. **背景统一。**  
   现在所有页面底色需要统一成柔和浅紫 / 暖白背景。参考最后一张 Ending 的背景色，但不使用 Ending 图本身。  
   推荐背景：
   - `#FBFAFF`
   - `#F6F4FF`
   - radial glow: `rgba(107, 95, 211, 0.12)`

4. **视觉关键词。**  
   Warm Minimalism / Soft Spatial UI / Skeuomorphic Glass / Apple 式留白 / Flighty 式信息清晰。

5. **所有 section label 删除。**  
   例如 `2 / Pain`、`3 / Core Promise`、`04 / SYSTEM PRINCIPLE`、`SECTION 9 / SCENARIO GALLERY`、`SECTION 10 / BEYOND TRAVEL` 这类小标签不要出现在最终网页里。

6. **最后一张 Ending 不要做。**  
   结尾可以用简单文字收束，但不要使用之前生成的 Ending 图。Ending 原图只参考背景颜色。

---

## 2. 技术栈建议

优先使用：

- Vite + React
- CSS Modules 或普通 CSS
- GSAP
- GSAP ScrollTrigger
- GSAP Draggable
- 可选：Lenis / locomotive-scroll 做平滑滚动，但不要为了炫技增加复杂依赖

不强制 Tailwind。若用 Tailwind，也必须保证自定义 CSS 能精确控制留白、玻璃卡片和动画。

---

## 3. 需要 Codex 使用 / 参考的外部资料

### 参考网站

1. **Apple Vision Pro 官方页面**  
   参考点：首屏大留白、产品主视觉、滚动叙事、极简文案层级。

2. **华为 AI 眼镜官方页面**  
   参考点：智能眼镜产品功能如何拆成场景模块，硬件注释和功能卖点的表达方式。

3. **Flighty 官方网站**  
   参考点：实时出行信息的清晰表达、低焦虑提醒感、复杂信息如何用少量卡片呈现。

4. **Topology / Unseen Studio 类 WebGL 风格页面**  
   参考点：交互产品探索模块中的拖拽旋转、点位 hover、空间层次。

### 推荐查阅 / 调用的 skills 或文档

如果 Codex 环境里有 skills，优先调用：

- `gsap-scrolltrigger` / `ScrollTrigger`
- `gsap-draggable` / `Draggable`
- `responsive-web-layout`
- `image-asset-optimization`
- `accessibility`
- `performance`
- `react-component-architecture`

如果没有 skills，就按官方文档实现。

---

## 4. 资产文件清单

把图片放到：

```txt
public/assets/
```

建议使用下面这些文件名：

```txt
01_hero.png
02_pain.png
03_core_promise.png
04_system_principle.png
05_travel_scroll_story.png
06_agent_posture.png
07_shortcut_template.png
08_scenario_gallery.png
09_beyond_travel.png
10_product_explorer_reference.png

product_white_3quarter.png
product_white_detail_temple.png
product_white_front.png
product_white_three_views.png
product_black_3quarter.png
product_black_front.png
product_black_three_views.png
```

### 图片使用规则

- `01_hero.png` 到 `09_beyond_travel.png`：作为主要网页 section 的视觉稿，可以直接放入对应 section。
- `10_product_explorer_reference.png`：只作为产品交互探索模块的风格参考，不建议直接整张当底图使用，因为图上注释默认可见，不符合交互要求。
- 产品探索模块请优先使用 `product_white_3quarter.png` 或 `product_black_3quarter.png` 作为可拖拽主产品图。

---

## 5. 页面结构

最终页面建议顺序：

1. Hero
2. Product Explorer / 产品交互探索
3. Pain / 复杂任务痛点
4. Core Promise / 四个核心价值
5. System Principle / 信息分层
6. Travel Scroll Story / 旅行流程
7. Agent Posture / AI 协作姿态
8. Shortcut Template / 快捷方式沉淀
9. Scenario Gallery / 情境画廊
10. Beyond Travel / 更多场景
11. Simple Ending / 文字收束

---

## 6. 全局样式规范

### 页面尺寸

- desktop 主宽度：`min(1200px, calc(100vw - 80px))`
- section 最小高度：`100vh`
- 视觉稿图片建议宽度：`min(1180px, 92vw)`
- 大 section 上下留白：`96px ~ 140px`

### 颜色

```css
:root {
  --bg: #fbfaff;
  --bg-soft: #f6f4ff;
  --primary: #505cb2;
  --primary-2: #6b5fd3;
  --lavender: #ece7ff;
  --text: #111827;
  --muted: #6b7280;
  --card: rgba(255, 255, 255, 0.72);
  --card-border: rgba(120, 110, 220, 0.16);
}
```

### 字体

```css
font-family: Inter, "SF Pro Display", "HarmonyOS Sans SC", "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif;
```

### 卡片风格

```css
.glass-card {
  background: rgba(255,255,255,0.68);
  border: 1px solid rgba(120,110,220,0.14);
  box-shadow: 0 24px 80px rgba(80, 92, 178, 0.10);
  backdrop-filter: blur(24px);
  border-radius: 28px;
}
```

---

## 7. Section 说明

### 7.1 Hero

使用：`01_hero.png`

要求：

- 背景保持柔和浅紫，不要纯白。
- 保留首图高级波纹感。
- 首屏视觉稿居中偏右，左侧文案可由图片本身承担。
- 不额外叠加过多文字。
- 初始加载时轻微淡入和上浮。

动效：

```txt
title opacity 0 → 1
image y 32 → 0
image scale 0.98 → 1
duration 1s
ease power3.out
```

---

### 7.2 Product Explorer / 产品交互探索

这是新增的重点交互模块。

标题建议：

```txt
交互式产品探索
轻微拖拽旋转镜镜，悬停查看不同部件如何协同工作。
```

核心要求：

1. **默认状态只显示眼镜 + 小热点点位。**
2. **默认状态不显示任何注释文字。**
3. **鼠标 hover 到热点时，才出现功能注释卡片和连接线。**
4. **鼠标离开热点，注释卡片消失。**
5. **鼠标拖拽产品图时，眼镜产生轻微 3D 旋转。**
6. **移动端点击热点显示注释，再点其他热点切换。**
7. 不要把 `10_product_explorer_reference.png` 直接当成最终交互图，因为它的所有注释都默认显示。

推荐主图：

```txt
product_white_3quarter.png
```

热点数据：

```js
const hotspots = [
  {
    id: "camera",
    label: "摄像头",
    short: "识别场景与目标物体",
    detail: "用于理解当前环境、辅助导航纠错与目标提示。",
    x: 28,
    y: 45
  },
  {
    id: "display",
    label: "微显示模组",
    short: "呈现当前一步",
    detail: "只显示当前任务、确认节点和风险提示，避免长文本干扰。",
    x: 42,
    y: 57
  },
  {
    id: "touch",
    label: "触控滑动区",
    short: "滑动切换，点按确认",
    detail: "左右滑动切换任务卡片，点按确认当前步骤，长按返回。",
    x: 74,
    y: 46
  },
  {
    id: "mic",
    label: "收音麦克风",
    short: "语音输入与确认",
    detail: "用于提出模糊目标、补充偏好、确认或取消操作。",
    x: 55,
    y: 59
  },
  {
    id: "haptic",
    label: "震动反馈",
    short: "风险升级提醒",
    detail: "在未响应、方向偏离或高风险节点，通过轻震提醒用户。",
    x: 88,
    y: 48
  },
  {
    id: "audio",
    label: "定向音频",
    short: "听觉先行",
    detail: "用轻量语音说明原因、复述结果，减少视觉占用。",
    x: 92,
    y: 61
  }
];
```

CSS 交互规则：

```css
.hotspot-card {
  opacity: 0;
  transform: translateY(8px) scale(.98);
  pointer-events: none;
  transition: opacity .24s ease, transform .24s ease;
}

.hotspot:hover .hotspot-card,
.hotspot:focus-within .hotspot-card,
.hotspot.is-active .hotspot-card {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.hotspot-line {
  opacity: 0;
  transition: opacity .24s ease;
}

.hotspot:hover .hotspot-line,
.hotspot:focus-within .hotspot-line,
.hotspot.is-active .hotspot-line {
  opacity: 1;
}
```

拖拽旋转逻辑：

```js
// 无 GLB 模型时，用 image + CSS transform 模拟轻微 3D 旋转。
const maxRotate = 8; // degrees
// pointer drag dx/dy -> rotateY/rotateX
// mouse leave / pointer up 后平滑回弹到最近角度，不要旋转太夸张。
```

推荐实现：

- 使用 GSAP Draggable 绑定产品图容器。
- 拖拽时更新 CSS variable：
  - `--rx`
  - `--ry`
- 产品图 transform：
  - `perspective(1200px) rotateX(var(--rx)) rotateY(var(--ry))`
- 松手后用 GSAP 缓动回到 `0deg` 或保留轻微角度。

---

### 7.3 Pain

使用：`02_pain.png`

修改要求：

- 删除顶部 `2 / Pain`。
- 让中间收束线更简洁，避免乱。
- 背景与全站统一。
- “当前一步”可保留，但要清晰地指向最终收束点。

---

### 7.4 Core Promise

使用：`03_core_promise.png`

修改要求：

- 删除顶部 `3 / Core Promise`。
- 保留四张卡片。
- 图片卡片 hover 时轻微放大。
- 不需要额外解释。

---

### 7.5 System Principle

使用：`04_system_principle.png`

修改要求：

- 删除顶部 `04 / SYSTEM PRINCIPLE`。
- 第一视角眼镜中的时间、任务胶囊、天气卡片要严格对齐。
- 去掉“当前任务”四个字。
- 底部说明卡去掉。
- “语音播报”卡片改为更明显的音频组件状态，比如音波 + 短句。
- 三层信息：U1 / U2 / U3 保留。

---

### 7.6 Travel Scroll Story

使用：`05_travel_scroll_story.png`

修改要求：

- 顶部导航改成 11 个模块标签并固定在顶部。
- 删除“5 / 旅程中的任务，会一直延续”。
- 右上角“开始使用”按钮去掉。
- 副标题改成：
  `旅途充满不确定性，别因为意外错过惊喜，TaskFlow 帮您留住惊喜。`

交互：

- 左侧大图固定。
- 右侧步骤列表随滚动高亮。
- 可以点击步骤跳转到对应位置。
- 第 5 步默认展开。

---

### 7.7 Agent Posture

使用：`06_agent_posture.png`

修改要求：

- 删除 `07 / Agent Posture`。
- 删除右侧“表达示例”标题。
- 保留左右两种语气示例和滑杆。
- 卡片 hover 时轻微上浮。

---

### 7.8 Shortcut Template

使用：`07_shortcut_template.png`

修改要求：

- 标签颜色只保留紫色、蓝色、灰白色，不要红橙绿乱色。
- 中央标题“云南旅行快捷方式”字缩小一点，放到卡片左上角。
- 去掉右上角多余装饰小星星。
- 周围标签保持轻盈，不要太花。

---

### 7.9 Scenario Gallery

使用：`08_scenario_gallery.png`

修改要求：

- 删除 `SECTION 9 / SCENARIO GALLERY`。
- 不要把九张图压成一排特别小。
- 做成可拖拽横向画廊：一屏主看 3–4 张，其他露出边缘。
- 当前卡片放大，旁边卡片变窄、变淡。
- 鼠标悬停在某张图上时，该图放大。
- 底部提示：“拖拽浏览更多场景”。

---

### 7.10 Beyond Travel

使用：`09_beyond_travel.png`

修改要求：

- 删除 `SECTION 10 / BEYOND TRAVEL`。
- 删除“旅行只是开始。”，重新排版标题，只保留：
  `复杂日常，都可以被重新编排。`
- 三张大卡片保留。

---

### 7.11 Simple Ending

不使用之前生成的 Ending 图片。

用文本 + 细紫色流线即可：

```txt
Task Flow｜流向光标
让任务跟随你，而不是让你追着任务跑。
A dynamic task collaboration system for AI glasses.
```

---

## 8. 交互动效清单

### 全局滚动

使用 GSAP ScrollTrigger：

- section 进入视口时：opacity 0 → 1，y 50 → 0
- 图片轻微 scale 0.98 → 1
- 背景光斑缓慢移动

### 顶部导航

- sticky fixed top
- 点击锚点平滑滚动
- 当前 section 高亮
- 移动端折叠菜单

### Travel Scroll Story

- 左侧视觉 pinned
- 右侧步骤滚动高亮
- 使用 ScrollTrigger 控制 active step
- 点击右侧步骤跳转

### Scenario Gallery

- 横向拖拽
- 当前卡片 scale 1
- 旁边卡片 scale 0.92 / opacity 0.55
- 鼠标 hover scale 1.04

### Product Explorer

- 产品图可轻微拖拽旋转
- 热点默认只有圆点
- hover / focus / tap 才显示注释文字
- 注释出现时连接线同步出现
- tooltip 不要挡住产品主体

---

## 9. 组件结构建议

```txt
src/
  App.jsx
  main.jsx
  styles/
    global.css
    sections.css
  components/
    Navbar.jsx
    SectionImage.jsx
    ProductExplorer.jsx
    TravelStory.jsx
    ScenarioGallery.jsx
    SimpleEnding.jsx
  data/
    sections.js
    hotspots.js
```

---

## 10. 验收标准

1. 页面能在桌面端完整浏览。
2. 首页加载高级、轻，不要像 PPT 直接拼图。
3. 所有背景色统一。
4. 所有 section label 删除。
5. 产品探索模块默认不显示注释文字。
6. 产品探索模块 hover 后才显示功能说明。
7. 图片不糊、不变形。
8. 整页有明确滚动节奏。
9. 不要出现红色批注。
10. 不要出现 Ending 那张啰嗦的图。
11. 代码结构清晰，后续可以继续替换图片和文案。

---

## 11. 给 Codex 的开发顺序

1. 先搭 Vite React 项目。
2. 放入 assets 并完成全局样式。
3. 先把 9 张 section 图按网页顺序排好。
4. 做 sticky nav 和锚点跳转。
5. 做 ProductExplorer 交互模块。
6. 做 TravelStory 的 pinned scroll。
7. 做 ScenarioGallery 横向拖拽。
8. 做响应式适配。
9. 最后整体调背景、留白、动效速度。
