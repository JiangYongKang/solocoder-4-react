我来逐一修复这些问题。先检查文件实际状态：


        
            
toolName: todo_write
            
status: success
          
Todos updated: 4 items
          
先检查 GroupBuy.jsx 的 import 语句：







        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\group-buy\GroupBuy.jsx
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\group-buy\components\GroupCard.jsx
          
我看到问题了，两个文件的 import 确实都遗漏了对应的函数。让我逐一修复：

### 问题1：修复 GroupBuy.jsx 的 import





        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\group-buy\GroupBuy.jsx
          
changes: undefined
          

        
            
toolName: todo_write
            
status: success
          
Todos updated: 4 items
          
### 问题2：修复 GroupCard 的 import、死参数和重复计算

首先修复 GroupCard.jsx 的 import：







        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\group-buy\components\GroupCard.jsx
          
changes: undefined
          
现在修改 getLeaderNickname 函数，删除死参数 `leaders`：









        
            
toolName: search_by_regex
            
status: success
          
query: getLeaderNickname
          

        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\group-buy\utils\groupBuyManager.js
          
changes: undefined
          
现在修改 GroupCard 组件，合并重复计算（只查找一次 leader）：







        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\group-buy\components\GroupCard.jsx
          

        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\group-buy\components\GroupCard.jsx
          
changes: undefined
          

        
            
toolName: todo_write
            
status: success
          
Todos updated: 4 items
          
### 问题3：修复 createOrder 下单成功后扣减 product.stock

先查看当前的 createOrder 函数：










        
            
toolName: search_by_regex
            
status: success
          
query: export const createOrder
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\group-buy\utils\groupBuyManager.js
          
在下单成功后扣减库存，修改 createOrder 函数：










        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\group-buy\utils\groupBuyManager.js
          
changes: undefined
          
现在检查测试文件，添加测试用例验证库存扣减，并确保现有测试兼容新逻辑：













        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\__tests__\group-buy\groupBuyManager.test.js
          
需要修改测试，确保每个测试使用独立的 product 对象副本，避免共享状态导致测试失败。同时添加连续下单库存扣减的测试用例：












        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\__tests__\group-buy\groupBuyManager.test.js
          
changes: undefined
          
现在检查 getLeaderNickname 的测试用例，确保签名变更后测试仍然通过：










        
            
toolName: search_by_regex
            
status: success
          
query: getLeaderNickname
          
没有现有的测试用例。让我添加 getLeaderNickname 的测试：












        
            
toolName: search_by_regex
            
status: success
          
query: describe\('getSuccessfulGroups'
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\__tests__\group-buy\groupBuyManager.test.js
          

        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\__tests__\group-buy\groupBuyManager.test.js
          
changes: undefined
          
现在检查测试文件的 import 是否包含 getLeaderNickname：











        
            
toolName: search_by_regex
            
status: success
          
query: ^import.*groupBuyManager
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\__tests__\group-buy\groupBuyManager.test.js
          
需要在测试文件的 import 中添加 getLeaderNickname：















        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\__tests__\group-buy\groupBuyManager.test.js
          
changes: undefined
          

        
            
toolName: todo_write
            
status: success
          
Todos updated: 4 items
          
### 问题4：运行测试

现在运行完整的测试套件：















        
            
toolName: run_command
            
status: success
          
command: cd "c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react" ; npx vitest run undefined
          
失败的测试是 hotel 模块的，与我们的 group-buy 无关。单独运行 group-buy 测试确认：

















        
            
toolName: run_command
            
status: success
          
command: cd "c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react" ; npx vitest run src/pages/__tests__/group-buy/ undefined
          
group-buy 模块的 87 个测试全部通过！现在做类型检查和构建验证：



















        
            
toolName: todo_write
            
status: success
          
Todos updated: 4 items
          

        
            
toolName: run_command
            
status: success
          
command: cd "c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react" ; npx vite build 2>&1 undefined
          
所有问题已修复完成！🎉

---

## ✅ 修复总结

### 问题1：GroupBuy.jsx 缺少 `getSuccessfulGroups` 导入
**修改文件**: [GroupBuy.jsx](file:///c:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/group-buy/GroupBuy.jsx#L16-L30)

- 在 import 语句中添加 `getSuccessfulGroups`
- 避免运行时 `ReferenceError` 导致拼团列表弹窗崩溃

---

### 问题2：GroupCard 多问题修复
**修改文件**:
- [GroupCard.jsx](file:///c:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/group-buy/components/GroupCard.jsx)
- [groupBuyManager.js](file:///c:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/group-buy/utils/groupBuyManager.js#L320-L323)

**2.1 修复缺失的 import**
- GroupCard 中移除了未使用的 `getLeaderNickname` import（改为直接使用 find 结果）

**2.2 清理 `getLeaderNickname` 死参数**
```javascript
// 修复前
export const getLeaderNickname = (group, leaders) => { ... }  // leaders 未使用

// 修复后
export const getLeaderNickname = (group) => { ... }
```

**2.3 合并重复计算**
使用 `useMemo` 缓存一次查找，避免组件内和函数内两次 `find` 操作：
```javascript
const groupLeader = useMemo(() => group.members.find(m => m.isLeader), [group.members])
const leaderNickname = groupLeader ? groupLeader.nickname : '未知团长'
```

---

### 问题3：createOrder 下单成功后扣减库存
**修改文件**: [groupBuyManager.js](file:///c:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/group-buy/utils/groupBuyManager.js#L167)

在订单创建成功后实际扣减内存中的 `product.stock`：
```javascript
product.stock -= quantity  // 新增

const order = {
  // ...
  remainingStock: product.stock  // 直接使用扣减后的值
}
```

这样多个用户连续下单时，库存会持续扣减，直到耗尽时拒绝后续订单。

---

### 问题4：测试结果
```
Test Files  2 passed (2)
Tests       87 passed (87)  ✅
```

**新增测试用例 3 个**：
- `should deduct product stock after successful order` - 验证下单后库存扣减
- `should enforce stock limit across consecutive orders` - 验证连续下单库存约束
- `getLeaderNickname` 测试组（3 个用例）- 验证函数签名变更后逻辑正确

**原有测试调整**：
- 所有 `createOrder` 测试改为使用 `createValidProduct()` 工厂函数，避免共享 product 对象导致测试间状态污染

---

### 🔍 构建验证
```
✓ built in 217ms
dist/index.html                   0.46 kB
dist/assets/index-Dm5W-_Pl.css   25.16 kB
dist/assets/index-KfcmHpR1.js   233.00 kB
```

生产构建成功，所有 group-buy 相关测试通过（87/87）。