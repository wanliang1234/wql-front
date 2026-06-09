<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-card">
        <div class="login-header">
          <h1>欢迎登录</h1>
          <p>请输入您的账号和密码</p>
        </div>

        <Form ref="loginForm" :model="formData" :rules="formRules" class="login-form">
          <FormItem prop="username">
            <Input
                v-model="formData.username"
                prefix="ios-person"
                size="large"
                placeholder="请输入用户名"
                clearable
            />
          </FormItem>

          <FormItem prop="password">
            <Input
                v-model="formData.password"
                prefix="ios-lock"
                type="password"
                size="large"
                placeholder="请输入密码"
                password
            />
          </FormItem>

          <FormItem>
            <Button
                type="primary"
                size="large"
                long
                :loading="loading"
                @click="handleLogin"
            >
              {{ loading ? '登录中...' : '登录' }}
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import {twoServer} from '@/utils/dataUtils'
import axios from 'axios';

export default {
  name: 'LoginPage',
  data() {
    return {
      loading: false,
      token: null,
      formData: {
        username: '',
        password: ''
      },
      formRules: {
        username: [
          {required: true, message: '用户名不能为空', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          axios({
            url: twoServer + '/user/jwtToken',
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            data: this.formData,
          }).then((resp) => {
            this.token = resp.data || [];
            if (this.token) {
              this.$Message.success('登录成功!')
              this.$router.push({
                path: "/homepage"
              })
            } else {
              this.$Message.success('账号或密码错误!');
            }
          }).catch((err) => {
            this.$Message.error('信息获取失败!');
          }).finally(() => {
            this.loading = false
          });
        } else {
          this.$Message.error('请填写正确的登录信息!')
        }
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('https://ts1.tc.mm.bing.net/th/id/OIP-C.xWYkfNO8UxUq40LO_-PF-QAAAA?rs=1&pid=ImgDetMain&o=7&rm=3');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}

.login-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: -1;
}

.login-wrapper {
  width: 100%;
  max-width: 400px;
  z-index: 1; /* 确保登录框在背景之上 */
}

.login-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px 30px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

.login-header p {
  color: #666;
  font-size: 14px;
}

.login-form {
  margin-bottom: 20px;
}

.login-footer p {
  color: #666;
  font-size: 14px;
}

.login-footer a {
  color: #2d8cf0;
  text-decoration: none;
}


.login-divider span {
  background: white;
  padding: 0 15px;
  color: #999;
  font-size: 14px;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }

  .login-header h1 {
    font-size: 20px;
  }
}
</style>
