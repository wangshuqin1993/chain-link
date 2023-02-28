<template>
  <div class="create-edit-request">
    <div class="title">{{ title }}</div>
    <div id="container" style="height:100%;"></div>
    <a-button @click="getValue">getValue</a-button>
  </div>
</template>
<script lang='ts' setup>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import { ref, onMounted } from "vue";
import { useRoute } from 'vue-router';
const { params } = useRoute()
const title = ref('');

const getValue = () => {
  let monacoEditor = null;
  monacoEditor = monaco.editor.create(document.getElementById("container"), {
    value: "console.log('hello word')",
    language: 'yaml',
    theme: "custom",
    automaticLayout: true,
    selectOnLineNumbers: false,
    minimap: {
      enabled: false,
    },
    fontSize: 16,
    scrollBeyondLastLine: false,
    overviewRulerBorder: false,
    fixedOverflowWidgets: false,
    scrollbar: {
      alwaysConsumeMouseWheel: false,
    },
  });

  const currenValue = monacoEditor?.getValue();
  // console.log(currenValue, '989898')
}


onMounted(() => {
  title.value = params.type === '1' ? 'Create' : 'Edit';
})

</script>
<style lang='scss' scoped>
.create-edit-request {
  max-width: 1920px;
  margin: 32px;
  text-align: left;

  .title {
    font-size: 24px;
    font-weight: 700;
    color: #1a2b6b;
  }

}
</style>