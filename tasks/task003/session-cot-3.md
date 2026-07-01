好的，我来修复这两个问题。首先创建任务列表。


        
            
toolName: todo_write
            
status: success
          
Todos updated: 3 items
          
首先分析问题：当筛选激活时，KanbanColumn 显示的是筛选后的子集，索引与全量列表不一致。需要传递筛选后的任务列表上下文，通过任务 ID 做映射。先修改 KanbanColumn。




        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\kanban\components\KanbanColumn.jsx
          
修改思路：将 KanbanColumn 中当前显示的任务列表（筛选后的）传递给回调，drop 时通过任务 ID 做映射，避免索引错位。先修改 KanbanColumn 的 handleDragOver 和 handleDrop。





        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\kanban\components\KanbanColumn.jsx
          
changes: undefined
          
现在修改 KanbanPage，增加保存筛选任务上下文的状态，并在 drop 时正确做索引映射。







        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\kanban\KanbanPage.jsx
          
修改 KanbanPage：增加悬停列的任务列表状态，drop 时通过任务 ID 从全量列表映射回真实索引。








        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\kanban\KanbanPage.jsx
          
changes: undefined
          
现在修改 handleTaskDragEnd、handleTaskDragOver 和 handleTaskDrop：










        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\kanban\KanbanPage.jsx
          
changes: undefined
          
现在修复问题 2：清理 constants.js 中 PriorityOrder 的死代码导出。










        
            
toolName: todo_write
            
status: success
          
Todos updated: 3 items
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\kanban\constants.js
          
先全局搜索确认 PriorityOrder 是否真的没被使用，然后再删除。













        
            
toolName: search_by_regex
            
status: success
          
query: PriorityOrder
          
确认只有定义，没有引用。删除 PriorityOrder：
















        
            
toolName: edit_file_search_replace
            
status: success
          
            
filePath: c:\Users\vince\GoletaLab\SoloCoder-4\solocoder-4-react\src\pages\kanban\constants.js
          
changes: undefined
          
现在运行测试和 lint 检查：


















        
            
toolName: todo_write
            
status: success
          
Todos updated: 3 items
          

        
            
toolName: run_command
            
status: success
          
command: npx eslint src/pages/kanban --ext .js,.jsx ; npm test -- src/pages/__tests__/kanban undefined
          

        
            
toolName: check_command_status
            
status: success
          
          
分别运行 ESLint 和测试命令：



















        
            
toolName: run_command
            
status: success
          
command: npx eslint src/pages/kanban --ext .js,.jsx undefined
          
ESLint 通过！现在运行 kanban 测试：





















        
            
toolName: run_command
            
status: success
          
command: npm test -- src/pages/__tests__/kanban undefined
          
所有测试和 ESLint 均通过！
























        
            
toolName: todo_write
            
status: success
          
Todos updated: 3 items
          
两个 BUG 已全部修复完成！以下是详细说明：

---

## 🔧 修复 1：筛选激活时拖拽索引映射错误

**问题**：筛选激活后，KanbanColumn 显示的是筛选后的任务子集，`data-task-index` 反映的是子集位置，但 `handleTaskDrop` 直接用这个子集索引去操作全量列表，导致插入位置错误。

**修复内容**：

1. **[KanbanColumn.jsx](file:///c:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/kanban/components/KanbanColumn.jsx#L21-L43)** - `handleDragOver` 增加第三个参数，将当前列显示的任务列表（`tasks`）一起上报：
   ```js
   onTaskDragOver(columnId, overIndex, tasks)
   ```

2. **[KanbanPage.jsx](file:///c:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/kanban/KanbanPage.jsx#L29-L30)** - 新增状态保存悬停列的任务上下文：
   ```js
   const [dragOverColumnTasks, setDragOverColumnTasks] = useState(null)
   ```

3. **[KanbanPage.jsx](file:///c:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/kanban/KanbanPage.jsx#L82-L108)** - 新增 `mapFilteredIndexToFullIndex` 映射函数，通过**任务 ID**将筛选视图索引转换为全量列表索引：
   - `filteredIndex <= 0`：找到筛选列表第一个任务，在全量列表中的位置
   - `filteredIndex >= filteredTasks.length`：找到筛选列表最后一个任务，在其全量位置 + 1 插入
   - 中间位置：找到锚点任务（`filteredTasks[filteredIndex]`），在全量列表中对应位置插入
   - 找不到锚点任务时回退到列表末尾

4. **[KanbanPage.jsx](file:///c:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/kanban/KanbanPage.jsx#L110-L154)** - `handleTaskDrop` 使用映射函数计算正确的全量位置

**示例场景验证**：某列有 4 个任务 [A, B, C, D]，筛选后只显示 [A, C]（索引 0、1）。用户拖拽到筛选视图末尾（`dragOverTaskIndex = 2`）：
- 原逻辑：直接用 2 作为全量索引 → 插入到 C 之前（错误）
- 修复后：找到筛选列表最后一个任务是 C，其全量索引 = 2，目标位置 = 2 + 1 = 3 → 插入到 D 之前（正确）

---

## 🔧 修复 2：清理 PriorityOrder 死代码

**问题**：`constants.js` 中导出了 `PriorityOrder`，但整个 kanban 目录无任何文件导入使用。

**修复内容**：

[constants.js](file:///c:/Users/vince/GoletaLab/SoloCoder-4/solocoder-4-react/src/pages/kanban/constants.js) - 删除以下死代码：
```js
export const PriorityOrder = {
  [Priority.HIGH]: 3,
  [Priority.MEDIUM]: 2,
  [Priority.LOW]: 1,
}
```

---

## ✅ 验证结果

```
ESLint       ✓ 0 errors
Test Files   1 passed (1)
     Tests   39 passed (39)
```

所有 kanban 相关测试和代码检查全部通过。