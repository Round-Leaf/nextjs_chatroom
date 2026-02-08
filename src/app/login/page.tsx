"use client";
import React, { useActionState, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Avatar,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Link,
  Stack,
} from "@mui/material";
import { Alert, Fade } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { signIn } from "../../auth";
import { loginAction } from "../actions/auth";
import { registerAction } from "../actions/register";

const theme = createTheme({
  palette: {
    primary: { main: "#00a884" },
    background: { default: "#f0f2f5" },
  },
});

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginState, loginFormAction, loginIsPending] = useActionState(
    loginAction,
    null,
  );
  const [registerState, registerFormAction, registerIsPending] = useActionState(
    registerAction,
    null,
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* 顶部绿色装饰条 */}
      <Box
        sx={{
          height: "210px",
          backgroundColor: "#00a884",
          position: "absolute",
          top: 0,
          width: "100%",
          zIndex: -1,
        }}
      />

      <Container maxWidth="xs">
        <Box
          sx={{
            mt: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper elevation={3} sx={{ p: 4, width: "100%", borderRadius: 2 }}>
            <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <Avatar sx={{ bgcolor: "#25D366", width: 56, height: 56 }}>
                <WhatsAppIcon sx={{ fontSize: 35 }} />
              </Avatar>
              <Typography
                variant="h5"
                sx={{ color: "#41525d", fontWeight: 600 }}
              >
                {isLogin ? "登录 WhatsApp" : "创建账号"}
              </Typography>
            </Stack>

            {isLogin ? (
              /* --- 登录表单 --- */
              <Box
                component="form"
                action={loginFormAction}
                noValidate
                key="login-form"
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="用户名"
                  name="username"
                  autoFocus
                />
                <input type="hidden" name="redirectTo" value="/" />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="密码"
                  type="password"
                  id="password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    borderRadius: 10,
                    py: 1.2,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  登录
                </Button>
                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    还没有账号？
                    <Link
                      component="button"
                      type="button"
                      onClick={() => setIsLogin(false)}
                      sx={{
                        ml: 1,
                        fontWeight: "bold",
                        color: "#00a884",
                        textDecoration: "none",
                      }}
                    >
                      立即注册
                    </Link>
                  </Typography>
                </Box>
                <Box sx={{ mt: 2, minHeight: "48px" }}>
                  {loginState?.success === false && (
                    <Fade in={!!loginState}>
                      <Alert severity="error" sx={{ borderRadius: 2 }}>
                        {loginState?.message || "登录失败"}
                      </Alert>
                    </Fade>
                  )}

                  {loginState?.success === true && (
                    <Fade in={!!loginState}>
                      <Alert severity="success" sx={{ borderRadius: 2 }}>
                        {loginState?.message || "登录成功"}
                      </Alert>
                    </Fade>
                  )}
                </Box>
              </Box>
            ) : (
              /* --- 注册表单 --- */
              <Box
                component="form"
                action={registerFormAction}
                noValidate
                key="register-form"
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="reg-username"
                  label="用户名"
                  name="username"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="密码"
                  type="password"
                  id="reg-password"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="确认密码"
                  type="password"
                  id="confirm-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    borderRadius: 10,
                    py: 1.2,
                    textTransform: "none",
                    fontWeight: "bold",
                    bgcolor: "#25D366",
                    "&:hover": { bgcolor: "#1ebc57" },
                  }}
                >
                  注册
                </Button>
                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    已有账号？
                    <Link
                      component="button"
                      type="button"
                      onClick={() => setIsLogin(true)}
                      sx={{
                        ml: 1,
                        fontWeight: "bold",
                        color: "#00a884",
                        textDecoration: "none",
                      }}
                    >
                      返回登录
                    </Link>
                  </Typography>
                </Box>
                <Box sx={{ mt: 2, minHeight: "48px" }}>
                  {registerState?.success === false && (
                    <Fade in={!!registerState}>
                      <Alert severity="error" sx={{ borderRadius: 2 }}>
                        {registerState?.message || "注册失败"}
                      </Alert>
                    </Fade>
                  )}

                  {registerState?.success === true && (
                    <Fade in={!!registerState}>
                      <Alert severity="success" sx={{ borderRadius: 2 }}>
                        {registerState?.message || "注册成功"}
                      </Alert>
                    </Fade>
                  )}
                </Box>
              </Box>
            )}

            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "center",
                mt: 4,
                color: "#8696a0",
              }}
            >
              使用端到端加密，保护您的交流安全
            </Typography>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
