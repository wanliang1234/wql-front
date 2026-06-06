<template>
  <div>{{ title }}</div>
  <Row>
    <Col>
      <Input style="padding: 20px">12</Input>
    </Col>
  </Row>
</template>

<script>
import {Input} from "view-ui-plus";

export default {
  components: {Input},
  data() {
    return {
      title: this.$route.meta.title,
    }
  },
}
</script>

<style scoped>

</style>
