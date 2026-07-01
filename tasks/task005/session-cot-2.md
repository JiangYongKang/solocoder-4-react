我来逐一修复这些问题。首先看一下相关代码，了解当前实现。

        
            
toolName: todo_write
            
status: success
          
Todos updated: 5 items
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\hotel\utils\validators.js
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\hotel\components\GuestInfoForm.jsx
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\hotel\HotelBooking.jsx
          
现在我理解了问题。让我逐一修复：

**问题1：generateOrderNo 唯一性问题** - 使用模块级计数器 + 时间戳 + 随机数的组合方式，确保即使在同一毫秒并发调用也不会重复。

**问题2：表单强制校验** - 将 touched 状态提升到父组件，并让 GuestInfoForm 接收 forceTouched 属性。

**问题3：单元测试** - 补充高并发场景下的订单号唯一性测试。



        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\hotel\utils\validators.js
          
changes: undefined
          

        
            
toolName: todo_write
            
status: success
          
Todos updated: 5 items
          
现在修复 GuestInfoForm 组件，让它接收和消费 `forceTouched` 属性：



        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\hotel\components\GuestInfoForm.jsx
          
changes: undefined
          

        
            
toolName: todo_write
            
status: success
          
Todos updated: 5 items
          
现在修复 HotelBooking 中的强制校验逻辑，使用独立的 state 而不是在 guestInfo 对象上打标记：









        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\hotel\HotelBooking.jsx
          
changes: undefined
          

        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\hotel\HotelBooking.jsx
          
changes: undefined
          
现在修复 GuestInfoForm 的调用，传递 `forceTouched` 属性，并在用户开始输入时重置：







        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\hotel\HotelBooking.jsx
          
changes: undefined
          
还需要在返回和重新预订时重置 `guestFormTouched` 状态：







        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\hotel\HotelBooking.jsx
          
changes: undefined
          

        
            
toolName: todo_write
            
status: success
          
Todos updated: 5 items
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\__tests__\hotel\validators.test.js
          
现在更新单元测试，导入 `resetOrderNoCounter`，更新长度断言，并补充高并发唯一性测试：











        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\__tests__\hotel\validators.test.js
          
changes: undefined
          

        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\__tests__\hotel\validators.test.js
          
changes: undefined
          

        
            
toolName: todo_write
            
status: success
          
Todos updated: 5 items
          
现在运行所有 hotel 相关测试，确保全部通过：



















        
            
toolName: run_command
            
status: success
          
command: cd "c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react" ; npx vitest run src/pages/__tests__/hotel/ undefined
          
让我检查测试文件是否被正确识别，直接执行指定文件：
























        
            
toolName: view_folder
            
status: success
          
c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\__tests__
          

        
            
toolName: run_command
            
status: success
          
command: cd "c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react" ; npx vitest run --reporter=verbose "src/pages/__tests__/hotel/validators.test.js" undefined
          
**63 个测试全部通过！** 现在验证构建和 ESLint，然后运行 `pnpm run test` 确保所有测试通过。

































        
            
toolName: run_command
            
status: success
          
command: cd "c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react" ; npx vite build undefined
          

        
            
toolName: run_command
            
status: success
          
command: cd "c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react" ; npx vitest run undefined
          
**全部 566 个测试通过！** 现在检查 ESLint 诊断确认代码质量：











































        
            
toolName: GetDiagnostics
            
status: success
          
          

        
            
toolName: todo_write
            
status: success
          
Todos updated: 5 items
          
所有问题已全部修复完成！✅

---

## 修复总结

### 问题 1：订单号唯一性
**修改文件**：[validators.js](file:///C:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/hotel/utils/validators.js#L119-L141)

**问题**：`Date.now() + 4位随机数` 在同一毫秒连续生成时，随机数可能碰撞导致重复。

**修复方案**：采用**三级唯一机制**：
- **时间戳**（13位）：精确到毫秒
- **自增计数器**（4位）：同一毫秒内从 0 递增到 9999，模 10000 循环
- **随机数**（4位）：额外的安全冗余

同时新增 `resetOrderNoCounter()` 函数，用于测试时重置状态。

**订单号格式**：`HTL` + `13位时间戳` + `4位计数器` + `4位随机数` = **24位**

---

### 问题 2：表单强制校验
**修改文件**：[GuestInfoForm.jsx](file:///C:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/hotel/components/GuestInfoForm.jsx#L4-L36)

**修改文件**：[HotelBooking.jsx](file:///C:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/hotel/HotelBooking.jsx#L47-L48)

**问题**：父组件设置 `_forceTouched` 标记但子组件未消费，未填写直接点击提交只弹出 alert，表单无视觉反馈。

**修复方案**：
1. 父组件新增 `guestFormTouched` 独立 state
2. `GuestInfoForm` 新增 `forceTouched` prop，通过 `useEffect` 监听并强制设置所有字段为 touched 状态
3. 新增 `isFieldTouched` 辅助函数，合并 `touched` 状态和 `forceTouched` 来决定是否显示错误
4. 移除了原生 `alert`，改为直接回显错误边框和内联提示
5. 用户开始输入后自动重置强制校验状态

---

### 问题 3：新增单元测试
**修改文件**：[validators.test.js](file:///C:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/__tests__/hotel/validators.test.js#L443-L602)

新增 **8 个新测试**，覆盖：

| 测试 | 说明 |
|------|------|
| 订单号包含计数器部分，连续生成时递增 | 验证计数器从0开始递增 |
| 时间戳变化时计数器重置为0 | 不同毫秒计数器归零 |
| 连续1000次不重复 | 中等压力测试 |
| **同一毫秒内生成10000个订单号不重复（高并发） | 核心场景，模拟同一毫秒1万次调用 |
| 同一毫秒内计数器严格递增 | 验证0,1,2,...99序列 |
| 不同毫秒时间戳部分不同 | 跨毫秒验证 |
| 计数器达到9999后模运算归零 | 边界测试 |
| resetOrderNoCounter 可以重置状态 | 测试辅助函数 |

---

### 验证结果
- ✅ **hotel 相关测试：** **63/63 通过
- ✅ **全项目测试：** **566/566 通过**（0失败 0跳过**
- ✅ **构建成功：** 232KB JS / 25KB CSS
- ✅ **ESLint：** 0 错误

---

### Code Reference

| 核心修改文件链接：

| 🔧 🔧 🔧 🔧

- [validators.js](file:///C:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/hotel/utils/validators.js#L119-L141)
- [GuestInfoForm.jsx](file:///C:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/hotel/components/GuestInfoForm.jsx#L4-L36)
- [HotelBooking.jsx](file:///C:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/hotel/HotelBooking.jsx#L47-L48)
- [validators.test.js](file:///C:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/__tests__/hotel/validators.test.js#L443-L602)