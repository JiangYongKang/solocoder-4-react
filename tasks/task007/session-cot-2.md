我来修复这两个问题。首先分析问题并规划修复方案。


        
            
toolName: todo_write
            
status: success
          
Todos updated: 4 items
          
让我先读取当前的实现来进行修复。


        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\restaurant-queue\mockData.js
          
让我检查一下 queueManager.js 中的状态机实现：







        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\restaurant-queue\queueManager.js
          
现在我理解了问题。让我进行修复：

1. **generateQueueNumber**：改为按门店独立的递增序号方案，不依赖随机数
2. **simulateQueueNumberStatus**：确保核心函数内部对所有终止态做完善防护









        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\restaurant-queue\mockData.js
          
changes: undefined
          

        
            
toolName: todo_write
            
status: success
          
Todos updated: 4 items
          
现在修复第二个问题 - 让 `simulateQueueNumberStatus` 核心函数内部对所有终止态做完善防护，包括 `called` 状态：










        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\restaurant-queue\mockData.js
          
changes: undefined
          
现在需要更新测试用例来匹配新的号码格式，并为 `called` 状态添加测试。让我先更新测试文件：












        
            
toolName: todo_write
            
status: success
          
Todos updated: 4 items
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\__tests__\restaurant-queue\mockData.test.js
          

        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\__tests__\restaurant-queue\mockData.test.js
          
changes: undefined
          
现在添加对 `called` 状态的测试用例：

















        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\__tests__\restaurant-queue\mockData.test.js
          
changes: undefined
          
现在让我运行测试来验证修复是否正确：

















        
            
toolName: todo_write
            
status: success
          
Todos updated: 4 items
          

        
            
toolName: run_command
            
status: success
          
command: pnpm run test -- src/pages/__tests__/restaurant-queue/ --reporter=verbose undefined
          

        
            
toolName: run_command
            
status: success
          
command: npx vitest run src/pages/__tests__/restaurant-queue/ --reporter=verbose undefined
          
太好了！所有 45 个测试全部通过。让我更新任务状态并做最终总结。



        
            
toolName: todo_write
            
status: success
          
Todos updated: 4 items
          
## 修复完成总结

### ✅ 问题 1：排队号码唯一性方案修复

**原问题**：`generateQueueNumber` 依赖随机数拼接保证唯一性，极端流量下可能碰撞，且不同门店之间可能生成相同号码。

**修复方案**：改为**按门店独立的递增序号方案**，完全不依赖随机数。

**代码修改** ([mockData.js](file:///C:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/restaurant-queue/mockData.js#L54-L78))：
- 使用 `storeCounters` 对象存储每个门店的独立计数器
- 号码格式：`门店前缀(3位) + 桌型前缀(1位) + 6位递增序号`
- 例如：`001S000001`、`001S000002`、`002S000001`

**特性保证**：
- ✅ 同门店同桌型：号码单调递增（1, 2, 3...）
- ✅ 同门店不同桌型：共享同一序号，前缀区分
- ✅ 不同门店：门店前缀不同，即使序号相同号码也不同
- ✅ 全局唯一：门店前缀 + 序号组合保证全局无碰撞

---

### ✅ 问题 2：状态机终止态防护修复

**原问题**：`simulateQueueNumberStatus` 核心函数没有对所有终止态做防护，依赖调用方 `queueManager` 的检查。

**修复方案**：在核心函数内部对所有终止态做完善防护，确保状态机不会被破坏。

**代码修改** ([mockData.js](file:///C:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/restaurant-queue/mockData.js#L95-L109))：
```javascript
export const simulateQueueNumberStatus = (currentStatus, waitingCount) => {
  // 核心函数内部对所有终止态做防护
  if (currentStatus === 'cancelled' || currentStatus === 'expired' || currentStatus === 'called') {
    return currentStatus
  }
  // ... 其余状态转换逻辑
}
```

**终止态防护**：
- ✅ `cancelled`（已取消）：状态不可改变
- ✅ `expired`（已过号）：状态不可改变  
- ✅ `called`（已叫号）：状态不可改变

---

### 🧪 测试验证结果

**45 个测试全部通过** ✅

**新增测试用例** ([mockData.test.js](file:///C:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/__tests__/restaurant-queue/mockData.test.js))：

1. **号码唯一性测试**：
   - 同门店单调递增：`001S000001` → `001S000002` → `001S000003`
   - 不同门店独立计数：`001S000003` vs `002S000002`
   - 跨门店 200 个号码无重复
   - 同门店 100 个号码无重复

2. **状态机防护测试**：
   - 已取消号码不会变回等待中
   - 已过号号码不会变回已叫号
   - 已叫号号码不会变回即将叫号
   - 所有终止态在任何 waitingCount 下都保持不变

---

### 📊 测试运行结果

```
Test Files  2 passed (2)
      Tests  45 passed (45)
   Duration  2.13s
```

所有 `restaurant-queue` 相关测试全部通过，状态机逻辑和唯一性校验均正确验证。