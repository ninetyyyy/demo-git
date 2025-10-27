# Page snapshot

```yaml
- generic [ref=e4]:
  - heading "StudentPort.com" [level=1] [ref=e5]
  - textbox "Email" [ref=e6]: e2e.user@example.com
  - textbox "Password" [active] [ref=e7]: P@ssw0rd123
  - generic [ref=e8]:
    - link "forgot password" [ref=e9] [cursor=pointer]:
      - /url: "#"
    - link "change password" [ref=e10] [cursor=pointer]:
      - /url: "#"
  - button "Log in" [ref=e11] [cursor=pointer]
  - generic [ref=e12]: or
  - button "Login with Google" [ref=e13] [cursor=pointer]
  - generic [ref=e14]:
    - text: Don't have an account?
    - link "Sign up here" [ref=e15] [cursor=pointer]:
      - /url: "#"
```