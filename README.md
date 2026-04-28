# 学生综合管理系统

一个基于 Vue3 + Node.js + SQLite 的学生综合管理系统。

## 功能特性

- 📊 **数据看板** - 展示学生总数、班级数、课程数、平均分等统计数据
- 👨‍🎓 **学生管理** - 学生信息的增删改查，支持分页和搜索
- 📝 **成绩管理** - 成绩录入、修改和查询，包含统计分析（平均分、最高分、最低分、及格率）
- 🏫 **班级管理** - 班级信息管理，支持查看班级学生列表
- 📋 **操作日志** - 记录所有操作记录

## 技术栈

- **前端**: Vue 3 + Element Plus + ECharts
- **后端**: Node.js + Express
- **数据库**: SQLite

## 快速开始

### 安装依赖

```bash
cd backend
npm install
```

### 启动服务

```bash
cd backend
npm start
```

服务将在 http://localhost:3000 启动。

### 默认登录账号

- 用户名: `admin`
- 密码: `123456`

## 项目结构

```
├── backend/              # 后端代码
│   ├── server.js         # 服务端入口
│   ├── package.json      # 依赖配置
│   └── student.db        # SQLite数据库文件
├── frontend/             # 前端代码
│   └── index.html        # 单页应用
└── README.md             # 项目说明
```

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/login` | POST | 用户登录 |
| `/api/dashboard` | GET | 获取仪表盘数据 |
| `/api/students` | GET/POST | 学生列表/新增学生 |
| `/api/students/:id` | PUT/DELETE | 修改/删除学生 |
| `/api/scores` | GET/POST | 成绩列表/新增成绩 |
| `/api/scores/:id` | PUT/DELETE | 修改/删除成绩 |
| `/api/scores/statistics` | GET | 成绩统计 |
| `/api/classes` | GET/POST | 班级列表/新增班级 |
| `/api/classes/:id` | PUT/DELETE | 修改/删除班级 |
| `/api/classes/:classId/students` | GET | 获取班级学生 |

## 数据库结构

### students 表
- id, student_id, name, gender, class_id, class_name, major, phone, enroll_date

### classes 表
- id, class_id, class_name, major, teacher, classroom, student_count

### scores 表
- id, student_id, student_name, class_id, course_name, exam_type, score, semester, grade_level

### logs 表
- id, action_type, content, operator, create_time

### users 表
- id, username, password, nickname, role