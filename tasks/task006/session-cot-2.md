toolName: todo_write
            
status: success
          
Todos updated: 6 items
          
让我先读取相关文件，然后逐一修复：




        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\flights\utils\helpers.js
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\flights\components\FlightList.jsx
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\flights\components\SearchForm.jsx
          
现在逐一修复这4个问题。先修复 helpers.js 中的两个问题：



        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\flights\utils\helpers.js
          
changes: undefined
          

        
            
toolName: todo_write
            
status: success
          
Todos updated: 6 items
          
现在修复 FlightList 的 Infinity 问题和 SearchForm 的聚焦关键词问题：






        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\flights\components\FlightList.jsx
          
changes: undefined
          

        
            
toolName: todo_write
            
status: success
          
Todos updated: 6 items
          
现在修复 SearchForm 聚焦问题。用户聚焦时应该展示全部城市（清空关键词），因为用户的意图是浏览列表：






        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\flights\components\SearchForm.jsx
          
changes: undefined
          

        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\flights\components\SearchForm.jsx
          
changes: undefined
          

        
            
toolName: todo_write
            
status: success
          
Todos updated: 6 items
          
现在更新 helpers.test.js 中的测试用例：







        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\__tests__\flights\helpers.test.js
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\__tests__\flights\helpers.test.js
          
现在更新测试用例，添加部分已选的场景，并增强订单号唯一性测试：








        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\__tests__\flights\helpers.test.js
          
changes: undefined
          
现在增强订单号唯一性测试，并更新 OrderSummary 组件中使用 validSelectionCount：








        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\__tests__\flights\helpers.test.js
          
changes: undefined
          
现在检查并更新 OrderSummary 组件，确保税费明细的数量只使用已选条目数：









        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\flights\components\OrderSummary.jsx
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\flights\components\OrderSummary.jsx
          
发现 OrderSummary 中税费明细展示还是用了 selections.length，需要改成已选条目数：









        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\flights\components\OrderSummary.jsx
          
changes: undefined
          

        
            
toolName: todo_write
            
status: success
          
Todos updated: 6 items
          
现在运行测试验证修复是否成功：








        
            
toolName: run_command
            
status: success
          
command: npx vitest run src/pages/__tests__/flights/ undefined
          

        
            
toolName: run_command
            
status: success
          
command: npx vitest run src/pages/__tests__/flights/ undefined
          
70个测试全部通过！让我再运行完整的构建验证：










        
            
toolName: run_command
            
status: success
          
command: npx vite build undefined
          

        
            
toolName: todo_write
            
status: success
          
Todos updated: 6 items
          
所有 4 个问题已修复完成！

## ✅ 修复结果

**测试结果：** 70 个测试全部通过 ✔️  
**构建结果：** 构建成功 ✔️

---

## 🐛 修复详情

### 问题 1：`calculateOrderPrice` 税费错误计收
**文件：** [helpers.js](file:///c:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/flights/utils/helpers.js#L112-L136)

**修复方案：** 先过滤出已选的条目（同时有 flight 和 cabin），再以 `validCount` 参与税费/保险计算，与机票总价保持一致。

```js
const validSelections = selections.filter(sel => sel.flight && sel.cabin)
const validCount = validSelections.length
// taxTotal / insuranceTotal 均改用 validCount 计算
```

**同步修改：** [OrderSummary.jsx](file:///c:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/flights/components/OrderSummary.jsx#L116-L135) 中的价格明细展示也改用 `validSelectionCount`。

**新增测试用例（3 个）：**
- 往返时仅选择去程 → 只计收 1 程税费
- 返程仅选航班未选舱位 → 只计收去程费用
- 去程未完成返程完整 → 只计收返程费用

---

### 问题 2：空航班时 `Math.min(...[])` 出现 `Infinity`
**文件：** [FlightList.jsx](file:///c:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/flights/components/FlightList.jsx#L29-L31)

**修复方案：** 数组长度判断兜底：

```js
const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0
const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0
```

---

### 问题 3：`SearchForm` 聚焦时下拉框无结果
**文件：** [SearchForm.jsx](file:///c:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/flights/components/SearchForm.jsx#L136) & [L157](file:///c:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/flights/components/SearchForm.jsx#L157)

**修复方案：** 用户聚焦输入框时清空关键词，展示全部城市列表供浏览：

```js
onFocus={() => setShowCityDropdown({ field: 'departure', keyword: '' })}
```

---

### 问题 4：`generateOrderNo` 并发唯一性缺陷
**文件：** [helpers.js](file:///c:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/flights/utils/helpers.js#L138-L145)

**修复方案：** 引入模块级自增计数器 + 随机数的三层组合：
- `FL` + `13位时间戳` + `6位自增counter` + `3位随机数`
- 计数器以 100 万为周期循环，同毫秒内至少保证 100 万个不重复

```js
let _orderCounter = 0
_orderCounter = (_orderCounter + 1) % 1000000
return 'FL' + timestamp + counter + random
```

**增强测试：** 唯一性测试从 100 次升级到 **2000 次**，并新增同毫秒连续 10 次不碰撞用例。