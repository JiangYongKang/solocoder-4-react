好的，我来逐一修复这三个问题。让我先创建任务列表，然后开始修复。

        
            
toolName: todo_write
            
status: success
          
Todos updated: 4 items
          
首先修复问题 1：拖拽排序 BUG。需要修改 KanbanColumn 来读取悬停位置并上报，同时修改 KanbanPage 来处理位置数据。


        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\kanban\components\KanbanColumn.jsx
          
现在修改 KanbanColumn 来计算并上报悬停的任务索引：




        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\kanban\components\KanbanColumn.jsx
          
changes: undefined
          
现在修改 KanbanPage 中的 handleTaskDragOver 来接收和存储索引，并更新 handleTaskDrop 使用正确的索引：







        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\kanban\KanbanPage.jsx
          
现在修改 KanbanPage，添加必要的状态并修复 handleTaskDragOver 和 handleTaskDrop：









        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\kanban\KanbanPage.jsx
          
changes: undefined
          
同时添加计数器用于修复弹窗状态残留问题：









        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\kanban\KanbanPage.jsx
          
changes: undefined
          
现在修复拖拽相关的回调函数：










        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\kanban\KanbanPage.jsx
          
changes: undefined
          
现在修复 handleEditTask 和 TaskModal 的 key 属性：













        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\kanban\KanbanPage.jsx
          
changes: undefined
          
现在更新 TaskModal 的 key 属性：















        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\kanban\KanbanPage.jsx
          
changes: undefined
          
现在处理问题 3：移除 sortTasksByPriority 死代码。需要从 utils.js 和测试文件中移除。
















        
            
toolName: todo_write
            
status: success
          
Todos updated: 4 items
          
现在从 utils.js 中移除 sortTasksByPriority 函数：



















        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\kanban\utils.js
          
changes: undefined
          
找到并删除 sortTasksByPriority 函数：























        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\kanban\utils.js
          
删除 sortTasksByPriority 函数：


























        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\kanban\utils.js
          
changes: undefined
          
现在从测试文件中移除 sortTasksByPriority 的测试用例：

























        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\__tests__\kanban\utils.test.js
          
继续读取测试文件以找到完整的 sortTasksByPriority 测试块：




























        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\__tests__\kanban\utils.test.js
          
现在从测试文件中移除 sortTasksByPriority 的导入和测试块：





























        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\__tests__\kanban\utils.test.js
          
现在移除 import 中的 sortTasksByPriority 并删除测试块：

































        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\__tests__\kanban\utils.test.js
          
changes: undefined
          
现在删除测试文件中的 sortTasksByPriority 测试块：



































        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\__tests__\kanban\utils.test.js
          
changes: undefined
          
现在检查 KanbanPage 的 import 并清理：





































        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\kanban\KanbanPage.jsx
          
好的，import 已经是干净的。现在运行测试确保所有 kanban 相关的测试通过：







































        
            
toolName: todo_write
            
status: success
          
Todos updated: 4 items
          

        
            
toolName: run_command
            
status: success
          
command: npm test -- src/pages/__tests__/kanban undefined
          
Kanban 相关测试通过！现在运行全部测试和 ESLint 检查确保没有回归问题：







































        
            
toolName: run_command
            
status: success
          
command: npm test ; npx eslint src/pages/kanban --ext .js,.jsx undefined
          
有一个 ESLint 错误：`dragOverColumnId` 已赋值但未使用。让我修复这个问题，移除未使用的变量：








































        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\kanban\KanbanPage.jsx
          
changes: undefined
          
同时从 handleTaskDragEnd 和 handleTaskDragOver 中移除对 dragOverColumnId 的引用：












































        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\kanban\KanbanPage.jsx
          
changes: undefined
          
现在重新运行 ESLint 检查和 kanban 测试：













































        
            
toolName: run_command
            
status: success
          
command: npx eslint src/pages/kanban --ext .js,.jsx ; npm test -- src/pages/__tests__/kanban undefined
          
所有修复完成！现在总结一下：















































        
            
toolName: todo_write
            
status: success
          
Todos updated: 4 items
          
三个 BUG 已全部修复完成！以下是详细的修复说明：

---

## 🔧 修复 1：拖拽排序 BUG

**问题**：`dragOverTaskIndex` 始终为 null，任务只能排到末尾。

**修复内容**：

1. **[KanbanColumn.jsx](file:///c:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/kanban/components/KanbanColumn.jsx#L21-L43)** - `handleDragOver` 增加悬停位置计算：
   - 使用 `e.target.closest('.kanban-task-wrapper')` 定位悬停的任务卡片
   - 读取 `data-task-index` 属性获取索引值
   - 通过 `getBoundingClientRect()` 获取卡片位置，比较鼠标 Y 坐标与卡片中线，决定插入位置（上半部分=插入当前位置，下半部分=插入下一个位置）
   - 将列 ID 和计算后的索引上报给父组件

2. **[KanbanPage.jsx](file:///c:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/kanban/KanbanPage.jsx#L75-L77)** - `handleTaskDragOver` 接收并存储 `dragOverTaskIndex`

3. **[KanbanPage.jsx](file:///c:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/kanban/KanbanPage.jsx#L79-L123)** - `handleTaskDrop` 使用正确的索引计算：
   - 同列拖拽时：自动调整目标索引（移除源元素后位置会偏移）
   - 跨列拖拽时：直接使用上报的目标索引
   - 索引边界校验防止越界

---

## 🔧 修复 2：新增任务弹窗状态残留

**问题**：同一列多次点击"新增任务"，表单内容不会清空。

**修复内容**：

1. **[KanbanPage.jsx](file:///c:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/kanban/KanbanPage.jsx#L36)** - 新增 `modalOpenCounter` 状态变量

2. **[KanbanPage.jsx](file:///c:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/kanban/KanbanPage.jsx#L125-L139)** - `handleAddTask` 和 `handleEditTask` 每次打开弹窗时递增计数器

3. **[KanbanPage.jsx](file:///c:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/kanban/KanbanPage.jsx#L236-L246)** - `TaskModal` 的 `key` 属性加入计数器：
   ```
   key={`${modalMode}-${editingTask?.id ?? 'new'}-${defaultColumnId}-${modalOpenCounter}`}
   ```
   确保每次打开弹窗都强制重新挂载组件，表单状态完全重置。

---

## 🔧 修复 3：sortTasksByPriority 死代码清理

**问题**：`sortTasksByPriority` 函数被导出并有测试用例，但在实际代码中未被使用。

**修复内容**：

1. **[utils.js](file:///c:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/kanban/utils.js)** - 移除 `sortTasksByPriority` 函数和 `PriorityOrder` 的导入

2. **[utils.test.js](file:///c:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/__tests__/kanban/utils.test.js)** - 移除 `sortTasksByPriority` 的导入和对应的 3 个测试用例

---

## ✅ 验证结果

```
Test Files  1 passed (1)
     Tests  39 passed (39)
    ESLint  ✓ 0 errors
```

所有 kanban 相关测试全部通过，代码质量检查无错误。