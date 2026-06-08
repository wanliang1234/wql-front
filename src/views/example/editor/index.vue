<!--
  整体说明：
  1. 本组件实现了基于 wangeditor 的富文本编辑器，支持加粗、斜体、下划线、文字颜色、插入图片等功能。
  2. 图片上传采用 FileReader 转 Base64 方式，无需后端，纯前端即可预览图片。
  3. 使用 Vue 3 的 <script setup> 语法，简洁高效。
  4. 在组件销毁前会自动销毁编辑器实例，防止内存泄漏。
  5. 添加了自定义美化样式（圆角、阴影、滚动条、字体等）。
-->

<template>
  <!-- 外层 div：带美化类名，实现圆角边框、悬浮阴影等效果 -->
  <div class="rich-editor-wrapper">
    <!-- 工具栏组件：提供各种编辑功能按钮（加粗、斜体、插入图片等） -->
    <!-- :editor="editorRef" ：将编辑器实例绑定给工具栏，使工具栏能操作编辑器 -->
    <!-- :defaultConfig="toolbarConfig" ：传入工具栏的配置，决定显示哪些按钮 -->
    <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
    />
    <!-- 编辑器组件：核心的富文本编辑区域 -->
    <!-- style="height: 500px; overflow-y: hidden;" ：固定高度 500px，超出部分由内部滚动条处理 -->
    <!-- v-model="content" ：双向绑定编辑器的 HTML 内容 -->
    <!-- :defaultConfig="editorConfig" ：传入编辑器的配置（占位符、图片上传等） -->
    <!-- @onCreated="handleCreated" ：编辑器创建完成后触发，回调接收编辑器实例 -->
    <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="content"
        :defaultConfig="editorConfig"
        @onCreated="handleCreated"
    />
  </div>
</template>

<script setup>
// 从 Vue 中导入需要的组合式 API 函数
// ref: 创建响应式数据（如 content），值变化时自动更新视图
// shallowRef: 创建浅响应式数据，适用于存储大对象或实例（如编辑器实例），避免深度监听带来的性能开销
// onBeforeUnmount: 组件卸载前自动执行的生命周期钩子，用于清理资源
import {ref, shallowRef, onBeforeUnmount} from 'vue';

// 从 wangeditor 的 Vue 3 专用适配包中导入编辑器组件和工具栏组件
// 注意：Vue 3 项目必须安装 @wangeditor/editor-for-vue@next
import {Editor, Toolbar} from '@wangeditor/editor-for-vue';

// 引入 wangeditor 自带的 CSS 样式，保证工具栏和编辑区域显示正常
import '@wangeditor/editor/dist/css/style.css';

// 引入自定义美化样式（需要你在同目录下创建 editor-theme.css 文件，或者直接写在 scoped 样式里）
// 为了方便，后面会提供 <style scoped> 块，这里不再单独导入外部 CSS
// import './editor-theme.css';

// ---------- 响应式数据定义 ----------
// 创建浅响应式引用，初始值为 null，用于存储编辑器实例
// 使用 shallowRef 而不是 ref，因为编辑器实例内部结构复杂，不需要深度响应式
const editorRef = shallowRef(null);

// 创建响应式引用，存储编辑器的 HTML 内容，初始值为一段提示文本
// 注意：v-model 会同步这个值，内容变化时页面自动更新
const content = ref('<p>请输入内容...</p>');

// ---------- 工具栏配置 ----------
// 定义工具栏上显示的按钮数组：加粗、斜体、下划线、文字颜色、插入图片
// 可以根据需要增删按钮，例如添加 'header'、'code' 等
const toolbarConfig = {
  toolbarKeys: ['bold', 'italic', 'underline', 'color', 'insertImage'],
};

// ---------- 编辑器配置 ----------
// 配置编辑器的各种行为，如占位符、图片上传等
const editorConfig = {
  // 编辑器空白时显示的灰色提示文字
  placeholder: '请输入内容...',
  // 菜单配置：针对不同功能的详细配置
  MENU_CONF: {
    // 配置“插入图片”菜单
    uploadImage: {
      // 自定义图片上传方法：当用户选择图片后，会调用此函数
      // file: 用户选中的图片文件（File 对象）
      // insertFn: 插入图片到编辑器的回调函数，需要传入图片的 URL
      async customUpload(file, insertFn) {
        // 使用 FileReader 将图片文件转换为 Base64 字符串，实现纯前端预览
        // 优点：无需后端服务器，即开即用
        // 缺点：Base64 会增加 HTML 内容体积，适合小图片或测试环境

        // 创建一个 FileReader 实例，用于读取本地文件
        const reader = new FileReader();

        // 监听文件读取完成事件
        reader.onload = (e) => {
          // e.target.result 就是图片的 Base64 字符串（例如 data:image/png;base64,...）
          const base64Url = e.target.result;
          // 调用 insertFn 将 Base64 图片插入到编辑器中（光标所在位置）
          insertFn(base64Url);
        };

        // 监听文件读取错误事件（可选，用于调试）
        reader.onerror = (error) => {
          console.error('图片读取失败：', error);
        };

        // 开始读取文件，读取结果为 data:URL 格式的 Base64 字符串
        reader.readAsDataURL(file);
      },
    },
  },
};

// ---------- 事件处理函数 ----------
// 当编辑器创建完成时，wangEditor 会自动调用此函数，并传入编辑器实例
// 我们需要将实例保存到 editorRef 中，以便后续操作（如销毁、获取内容等）
const handleCreated = (editor) => {
  editorRef.value = editor;
};

// ---------- 生命周期钩子 ----------
// 组件卸载（销毁）之前自动执行，用于清理编辑器实例，释放内存、解绑事件，避免内存泄漏
onBeforeUnmount(() => {
  // 如果编辑器实例存在，则调用其 destroy 方法销毁实例
  if (editorRef.value) editorRef.value.destroy();
});
</script>

<!-- 自定义美化样式（直接写在 scoped 中，不影响外部） -->
<style scoped>
/* 1. 美化外层容器 */
.rich-editor-wrapper {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background-color: #fff;
  margin: 50px;
}

/* 悬浮效果 */
.rich-editor-wrapper:hover {
  border-color: #dee2e6;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

/* 2. 工具栏样式微调（注意：由于 wangeditor 的类名可能不是 .w-e-toolbar，这里用样式穿透） */
:deep(.w-e-toolbar) {
  border-bottom: 1px solid #e9ecef;
  background-color: #fafbfc;
  padding: 8px 12px;
}

/* 3. 核心编辑区背景 */
:deep(.w-e-text-container) {
  background-color: #ffffff;
}

/* 4. 内容区文字样式 */
:deep(.w-e-text-container [data-slate-editor]) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei',
  'WenQuanYi Micro Hei', 'Helvetica Neue', Roboto, Arial, sans-serif;
  font-size: 15px;
  line-height: 1.7;
  color: #2c3e50;
}

/* 5. 聚焦时的视觉效果（编辑区获得焦点时外发光） */
:deep(.w-e-text-container:focus-within) {
  box-shadow: inset 0 0 0 1px rgba(24, 144, 255, 0.2), 0 0 0 3px rgba(24, 144, 255, 0.1);
}

/* 6. 自定义滚动条（现代浏览器有效） */
:deep(.w-e-text-container::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(.w-e-text-container::-webkit-scrollbar-track) {
  background: #f5f5f5;
  border-radius: 10px;
}

:deep(.w-e-text-container::-webkit-scrollbar-thumb) {
  background: #ddd;
  border-radius: 10px;
}

:deep(.w-e-text-container::-webkit-scrollbar-thumb:hover) {
  background: #bbb;
}
</style>
