# MDX 博客写作指南

本博客基于 Contentlayer2 + MDX，支持标准 Markdown 语法和以下扩展功能。

---

## 一、Frontmatter（文章元数据）

每篇 `.mdx` 文件顶部必须有 YAML frontmatter，用 `---` 包裹：

```yaml
---
title: 文章标题          # 必填
date: '2026-06-14'      # 必填，格式 YYYY-MM-DD
tags: ['标签1', '标签2'] # 可选
lastmod: '2026-06-15'   # 可选，最后修改日期
draft: false             # 可选，true 时生产环境不显示
summary: 文章摘要        # 可选，用于列表页和 SEO
images: ['/static/images/cover.png']  # 可选，社交分享图
authors: ['default']     # 可选，默认 ['default']
layout: PostLayout       # 可选：PostLayout | PostSimple | PostBanner
canonicalUrl: 'https://...' # 可选，规范链接
bibliography: references.bib # 可选，引用文献文件
---
```

---

## 二、标题

```md
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
```

标题会自动生成锚点 ID 和可点击的链接图标（鼠标悬停可见）。

---

## 三、文本格式

```md
**加粗文本**
*斜体文本*
***加粗且斜体***
~~删除线~~
`行内代码`
```

效果：

- **加粗文本**
- *斜体文本*
- ***加粗且斜体***
- ~~删除线~~
- `行内代码`

### 上标和下标（KaTeX 方式）

```md
H$_2$O          <!-- 下标 -->
x$^2$           <!-- 上标 -->
```

---

## 四、链接

```md
[链接文字](https://example.com)
[带标题的链接](https://example.com "鼠标悬停提示")
```

站内链接可简写：

```md
[关于我](/about)
```

---

## 五、图片

### 基本语法

```md
![图片描述](/static/images/example.png)
```

图片路径相对于 `public/` 目录，所以 `/static/images/example.png` 对应 `public/static/images/example.png`。

### 带链接的图片

```md
[![图片描述](/static/images/example.png)](https://example.com)
```

### 指定宽高（HTML 方式）

```html
<img src="/static/images/example.png" alt="描述" width="500" height="300" />
```

---

## 六、视频

MDX 支持直接嵌入 HTML，所以可以用 `<video>` 标签：

```html
<video controls width="100%">
  <source src="/static/videos/demo.mp4" type="video/mp4" />
  你的浏览器不支持 video 标签
</video>
```

视频文件放在 `public/static/videos/` 目录。

### 嵌入 B 站视频

```html
<iframe
  src="//player.bilibili.com/player.html?bvid=BVxxxxxx&page=1"
  scrolling="no"
  border="0"
  frameborder="no"
  framespacing="0"
  allowfullscreen="true"
  style="width:100%;height:500px;"
/>
```

### 嵌入 YouTube 视频

```html
<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/视频ID"
  title="YouTube video player"
  frameborder="0"
  allowfullscreen
/>
```

---

## 七、代码块

### 基本代码块

用三个反引号包裹，指定语言可启用语法高亮：

````md
```js
const hello = 'world'
console.log(hello)
```
````

### 带标题的代码块（remarkCodeTitles）

在语言标识后加 `:标题`：

````md
```js:hello.js
const hello = 'world'
console.log(hello)
```
````

显示为带文件名标题的代码块。

### 支持的常用语言标识

`js`、`ts`、`tsx`、`jsx`、`python` / `py`、`bash` / `sh`、`json`、`yaml`、`html`、`css`、`md`、`c`、`cpp`、`csharp`、`go`、`rust`、`java`、`sql`

### 行高亮

````md
```js {1,3-5}
const a = 1  // 高亮
const b = 2
const c = 3  // 高亮
const d = 4  // 高亮
const e = 5  // 高亮
```
````

### 行号

默认显示行号，代码块左侂数字自动生成。

---

## 八、列表

### 无序列表

```md
- 项目一
- 项目二
  - 子项目
  - 子项目
- 项目三
```

### 有序列表

```md
1. 第一步
2. 第二步
3. 第三步
```

### 任务列表（GFM）

```md
- [x] 已完成任务
- [ ] 未完成任务
```

---

## 九、引用块

```md
> 这是一段引用
>
> 多行引用
```

### GitHub 风格告警（remarkAlert）

```md
> [!NOTE]
> 这是一条提示信息

> [!TIP]
> 这是一条建议

> [!IMPORTANT]
> 这是一条重要信息

> [!WARNING]
> 这是一条警告

> [!CAUTION]
> 这是一条注意信息
```

---

## 十、表格

```md
| 表头1 | 表头2 | 表头3 |
| ----- | ----- | ----- |
| 单元格 | 单元格 | 单元格 |
| 单元格 | 单元格 | 单元格 |
```

对齐方式：

```md
| 左对齐 | 居中对齐 | 右对齐 |
| :----- | :------: | -----: |
| 内容   |   内容   |   内容 |
```

表格会自动包裹在可滚动容器中（`TableWrapper` 组件），移动端不会溢出。

---

## 十一、数学公式（KaTeX）

### 行内公式

```md
质能方程 $E = mc^2$ 是物理学的基础。
```

### 块级公式

```md
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### 常用公式示例

```md
<!-- 分数 -->
$\frac{a}{b}$

<!-- 上下标 -->
$x_i^2$

<!-- 希腊字母 -->
$\alpha, \beta, \gamma, \delta, \theta, \lambda, \sigma, \omega$

<!-- 求和与积分 -->
$\sum_{i=1}^{n} x_i$
$\int_0^1 f(x)dx$

<!-- 矩阵 -->
$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
$$

<!-- 箭头 -->
$\rightarrow, \Rightarrow, \leftrightarrow$
```

---

## 十二、目录（TOCInline）

在文章任意位置插入目录组件：

```mdx
<TOCInline toc={toc} asDisclosure />
```

`toc` 由 Contentlayer 自动从标题生成。`asDisclosure` 使其可折叠。

---

## 十三、引用文献（rehype-citation）

在 `data/` 目录放置 `.bib` 文件（BibTeX 格式），frontmatter 中指定：

```yaml
bibliography: references.bib
```

正文引用：

```md
相关研究[@author2024]表明...

多个引用[@author2024;@another2023]也可以。
```

---

## 十四、脚注（GFM）

```md
这里有一条脚注[^1]。

[^1]: 这是脚注的内容。
```

---

## 十五、分隔线

```md
---
```

三个或更多短横线，生成水平分隔线。

---

## 十六、HTML 内容

MDX 支持直接写 HTML：

```mdx
<span style={{color: 'red', fontSize: '24px'}}>红色大字</span>
```

### 字体大小调整

MDX 中没有原生 Markdown 语法调整字体大小，使用内联 JSX：

```mdx
<span style={{fontSize: '12px'}}>小字</span>
<span style={{fontSize: '16px'}}>正常字</span>
<span style={{fontSize: '20px'}}>大字</span>
<span style={{fontSize: '28px'}}>很大</span>
<span style={{fontSize: '2rem'}}>用 rem 单位</span>
```

或者用 Tailwind CSS 类名：

```mdx
<span className="text-xs">超小 (12px)</span>
<span className="text-sm">小 (14px)</span>
<span className="text-base">默认 (16px)</span>
<span className="text-lg">大 (18px)</span>
<span className="text-xl">更大 (20px)</span>
<span className="text-2xl">24px</span>
<span className="text-3xl">30px</span>
<span className="text-4xl">36px</span>
```

---

## 十七、折叠内容

HTML `<details>` 标签实现折叠：

```mdx
<details>
<summary>点击展开详情</summary>

这里是隐藏的内容，支持 **Markdown** 语法。

</details>
```

---

## 十八、Newsletter 表单

在文章中插入订阅组件：

```mdx
<BlogNewsletterForm />
```

---

## 十九、自定义组件

本站注册了以下全局 MDX 组件，可直接使用：

| 组件 | 用途 |
|------|------|
| `<Image />` | Next/Image 封装，支持优化 |
| `<TOCInline />` | 文章内目录 |
| `<Pre />` | 代码块（自动处理） |
| `<TableWrapper />` | 表格滚动容器（自动处理） |
| `<BlogNewsletterForm />` | Newsletter 订阅表单 |

如需添加自定义组件，参见 `faq/custom-mdx-component.md`。

---

## 二十、注意事项

1. **文件位置**：博客文章放在 `data/blog/` 下，支持嵌套目录
2. **文件扩展名**：必须是 `.mdx`（不是 `.md`）
3. **Slug 规则**：路径 `data/blog/foo/bar.mdx` 的 slug 是 `foo/bar`
4. **草稿**：`draft: true` 的文章在生产构建中不会出现
5. **Frontmatter 必填**：`title` 和 `date` 缺一不可，否则构建报错
6. **路径分隔符**：图片路径用 `/`，不要用 `\`
