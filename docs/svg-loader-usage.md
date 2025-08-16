# SVG图标映射使用指南

## 概述

SVG图标映射允许你在Markdown中使用自定义的SVG图标。通过直接传递SVG映射数据，确保解析时数据立即可用。

## 功能特性

- ✅ 直接传递数据，无需异步加载
- ✅ 解析时数据立即可用
- ✅ 同步API，性能更好
- ✅ 优雅降级，找不到图标时显示占位符
- ✅ 类型安全，完整的TypeScript支持

## 使用方法

### 1. 基本用法

```typescript
import { markdownToHTML } from 'markdown-plus';

// 定义SVG映射数据
const svgMap = {
  'haluo': '<svg class="svg-icon" viewBox="0 0 24 24"><path d="..."/></svg>',
  'star': '<svg class="svg-icon" viewBox="0 0 24 24"><path d="..."/></svg>',
  'heart': '<svg class="svg-icon" viewBox="0 0 24 24"><path d="..."/></svg>'
};

// 使用markdownToHTML
const html = markdownToHTML(markdown, {
  svgMap: svgMap
});
```

### 2. 在Markdown中使用

```markdown
# 我的文档

这里使用了一个SVG图标：svg:haluo

- svg:star 星星图标
- svg:heart 心形图标
- svg:unknown 不存在的图标（会显示占位符）
```

### 3. 高级用法

```typescript
import { svgLoaderManager } from 'markdown-plus/utils';

// 直接设置SVG映射数据
svgLoaderManager.setSvgMap({
  'custom-icon': '<svg>...</svg>',
  'another-icon': '<svg>...</svg>'
});

// 检查是否已初始化
if (svgLoaderManager.isReady()) {
  console.log('SVG映射已准备就绪');
}

// 获取特定SVG内容
const svgContent = svgLoaderManager.getSvg('custom-icon');
```

## API参考

### ITransformOptions

```typescript
interface ITransformOptions {
  lineNumber?: boolean;
  highlight?: boolean;
  xss?: boolean;
  svgMap?: Record<string, string>;
}
```

### SvgLoaderManager

```typescript
class SvgLoaderManager {
  // 获取单例实例
  static getInstance(): SvgLoaderManager;
  
  // 设置加载器（异步方式）
  setLoader(loader: ISvgLoader): void;
  
  // 直接设置SVG映射数据（同步方式）
  setSvgMap(svgMap: Record<string, string>): void;
  
  // 初始化（异步）
  initialize(): Promise<Record<string, string>>;
  
  // 获取SVG内容
  getSvg(key: string): string | null;
  
  // 检查是否已初始化
  isReady(): boolean;
  
  // 重置状态
  reset(): void;
}
```

## 注意事项

1. **同步API**：`markdownToHTML`是同步函数，无需使用`await`
2. **数据立即可用**：SVG数据直接传递，解析时立即可用
3. **错误处理**：找不到的图标会显示占位符，不会影响整体功能
4. **性能优化**：同步处理，性能更好

## 示例

完整的使用示例请参考 `examples/svg-loader-example.ts` 文件。 