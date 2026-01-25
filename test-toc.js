const { formatToc } = require('./utils/tool');

// 测试 Markdown 内容
const markdownContent = `# 标题1
## 标题1.1
### 标题1.1.1
## 标题1.2
# 标题2
## 标题2.1`;

// 测试 formatToc 函数
try {
  const toc = formatToc(markdownContent);
  console.log('测试成功！');
  console.log('生成的目录：', toc);
} catch (error) {
  console.error('测试失败：', error);
}