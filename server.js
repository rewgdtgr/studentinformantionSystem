const express = require('express');
const initSqlJs = require('sql.js');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

let db;

async function initDatabase() {
    const SQL = await initSqlJs();

    const dbPath = path.join(__dirname, 'student.db');

    try {
        if (fs.existsSync(dbPath)) {
            const fileBuffer = fs.readFileSync(dbPath);
            db = new SQL.Database(fileBuffer);
        } else {
            db = new SQL.Database();
        }
    } catch (e) {
        db = new SQL.Database();
    }

    db.run(`
        CREATE TABLE IF NOT EXISTS classes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            class_id VARCHAR(20) UNIQUE,
            class_name VARCHAR(50),
            major VARCHAR(50),
            teacher VARCHAR(20),
            classroom VARCHAR(20),
            student_count INTEGER DEFAULT 0
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id VARCHAR(20) UNIQUE,
            name VARCHAR(20),
            gender VARCHAR(5),
            class_id VARCHAR(20),
            class_name VARCHAR(50),
            major VARCHAR(50),
            phone VARCHAR(15),
            enroll_date DATE,
            FOREIGN KEY (class_id) REFERENCES classes(class_id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id VARCHAR(20),
            student_name VARCHAR(20),
            class_id VARCHAR(20),
            course_name VARCHAR(50),
            exam_type VARCHAR(10),
            score INTEGER,
            semester VARCHAR(20),
            grade_level VARCHAR(10),
            create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(student_id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action_type VARCHAR(20),
            content TEXT,
            operator VARCHAR(20),
            create_time DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(20) UNIQUE,
            password VARCHAR(100),
            nickname VARCHAR(20),
            role VARCHAR(10) DEFAULT 'admin',
            create_time DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    const classCount = db.exec("SELECT COUNT(*) as count FROM classes")[0];
    if (!classCount || classCount.values[0][0] === 0) {
        db.run(`INSERT INTO classes (class_id, class_name, major, teacher, classroom, student_count) VALUES
            ('C001', '计算机应用1班', '计算机科学', '张老师', 'A101', 2)`);
        db.run(`INSERT INTO classes (class_id, class_name, major, teacher, classroom, student_count) VALUES
            ('C002', '计算机应用2班', '计算机科学', '李老师', 'A102', 2)`);
        db.run(`INSERT INTO classes (class_id, class_name, major, teacher, classroom, student_count) VALUES
            ('C003', '软件技术1班', '软件工程', '王老师', 'B201', 1)`);

        db.run(`INSERT INTO students (student_id, name, gender, class_id, class_name, major, phone, enroll_date) VALUES
            ('2024001', '张三', '男', 'C001', '计算机应用1班', '计算机科学', '13800000001', '2024-09-01')`);
        db.run(`INSERT INTO students (student_id, name, gender, class_id, class_name, major, phone, enroll_date) VALUES
            ('2024002', '李四', '女', 'C001', '计算机应用1班', '计算机科学', '13800000002', '2024-09-01')`);
        db.run(`INSERT INTO students (student_id, name, gender, class_id, class_name, major, phone, enroll_date) VALUES
            ('2024003', '王五', '男', 'C002', '计算机应用2班', '计算机科学', '13800000003', '2024-09-01')`);
        db.run(`INSERT INTO students (student_id, name, gender, class_id, class_name, major, phone, enroll_date) VALUES
            ('2024004', '赵六', '女', 'C002', '计算机应用2班', '计算机科学', '13800000004', '2024-09-01')`);
        db.run(`INSERT INTO students (student_id, name, gender, class_id, class_name, major, phone, enroll_date) VALUES
            ('2024005', '周七', '男', 'C003', '软件技术1班', '软件工程', '13800000005', '2024-09-01')`);

        db.run(`INSERT INTO scores (student_id, student_name, class_id, course_name, exam_type, score, semester, grade_level) VALUES
            ('2024001', '张三', 'C001', '高等数学', '期末', 92, '2024-2025-1', '优秀')`);
        db.run(`INSERT INTO scores (student_id, student_name, class_id, course_name, exam_type, score, semester, grade_level) VALUES
            ('2024001', '张三', 'C001', 'Python编程', '期末', 88, '2024-2025-1', '良好')`);
        db.run(`INSERT INTO scores (student_id, student_name, class_id, course_name, exam_type, score, semester, grade_level) VALUES
            ('2024002', '李四', 'C001', '高等数学', '期末', 78, '2024-2025-1', '中等')`);
        db.run(`INSERT INTO scores (student_id, student_name, class_id, course_name, exam_type, score, semester, grade_level) VALUES
            ('2024002', '李四', 'C001', 'Python编程', '期末', 85, '2024-2025-1', '良好')`);
        db.run(`INSERT INTO scores (student_id, student_name, class_id, course_name, exam_type, score, semester, grade_level) VALUES
            ('2024003', '王五', 'C002', '高等数学', '期末', 65, '2024-2025-1', '及格')`);
        db.run(`INSERT INTO scores (student_id, student_name, class_id, course_name, exam_type, score, semester, grade_level) VALUES
            ('2024003', '王五', 'C002', '数据结构', '期末', 58, '2024-2025-1', '不及格')`);
        db.run(`INSERT INTO scores (student_id, student_name, class_id, course_name, exam_type, score, semester, grade_level) VALUES
            ('2024004', '赵六', 'C002', '高等数学', '期末', 95, '2024-2025-1', '优秀')`);
        db.run(`INSERT INTO scores (student_id, student_name, class_id, course_name, exam_type, score, semester, grade_level) VALUES
            ('2024004', '赵六', 'C002', '数据结构', '期末', 90, '2024-2025-1', '优秀')`);
        db.run(`INSERT INTO scores (student_id, student_name, class_id, course_name, exam_type, score, semester, grade_level) VALUES
            ('2024005', '周七', 'C003', 'Java程序设计', '期末', 82, '2024-2025-1', '良好')`);
        db.run(`INSERT INTO scores (student_id, student_name, class_id, course_name, exam_type, score, semester, grade_level) VALUES
            ('2024005', '周七', 'C003', '数据库原理', '期末', 75, '2024-2025-1', '中等')`);

        db.run(`INSERT INTO logs (action_type, content, operator) VALUES ('新增', '新增学生张三', '系统')`);
        db.run(`INSERT INTO logs (action_type, content, operator) VALUES ('新增', '新增学生李四', '系统')`);
        db.run(`INSERT INTO logs (action_type, content, operator) VALUES ('新增', '新增学生王五', '系统')`);
        db.run(`INSERT INTO logs (action_type, content, operator) VALUES ('新增', '新增学生赵六', '系统')`);
        db.run(`INSERT INTO logs (action_type, content, operator) VALUES ('新增', '新增学生周七', '系统')`);

        db.run(`INSERT INTO users (username, password, nickname, role) VALUES ('admin', '123456', '管理员', 'admin')`);

        saveDatabase();
    }
}

function saveDatabase() {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(path.join(__dirname, 'student.db'), buffer);
}

function queryAll(sql, params = []) {
    const stmt = db.prepare(sql);
    if (params.length > 0) {
        stmt.bind(params);
    }
    const results = [];
    while (stmt.step()) {
        results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
}

function queryOne(sql, params = []) {
    const results = queryAll(sql, params);
    return results.length > 0 ? results[0] : null;
}

function run(sql, params = []) {
    db.run(sql, params);
    saveDatabase();
}

function addLog(actionType, content, operator = '管理员') {
    run('INSERT INTO logs (action_type, content, operator, create_time) VALUES (?, ?, ?, datetime("now"))', [actionType, content, operator]);
}

function calculateGradeLevel(score) {
    if (score >= 90) return '优秀';
    if (score >= 80) return '良好';
    if (score >= 70) return '中等';
    if (score >= 60) return '及格';
    return '不及格';
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/api/dashboard', (req, res) => {
    try {
        const studentCount = queryOne('SELECT COUNT(*) as count FROM students').count;
        const classCount = queryOne('SELECT COUNT(*) as count FROM classes').count;
        const courseCount = queryOne('SELECT COUNT(DISTINCT course_name) as count FROM scores').count || 0;
        const avgResult = queryOne('SELECT AVG(score) as avg FROM scores');
        const avgScore = avgResult && avgResult.avg ? Math.round(avgResult.avg * 10) / 10 : 0;

        const classDistribution = queryAll(`
            SELECT c.class_name, COUNT(s.id) as student_count
            FROM classes c
            LEFT JOIN students s ON c.class_id = s.class_id
            GROUP BY c.class_id
        `);

        const gradeDistribution = queryAll(`
            SELECT grade_level, COUNT(*) as count
            FROM scores
            GROUP BY grade_level
        `);

        const gradeMap = { '优秀': 0, '良好': 0, '中等': 0, '及格': 0, '不及格': 0 };
        gradeDistribution.forEach(item => {
            if (gradeMap.hasOwnProperty(item.grade_level)) {
                gradeMap[item.grade_level] = item.count;
            }
        });

        const recentScores = queryAll(`
            SELECT s.*, strftime('%Y-%m', create_time) as month
            FROM scores s
            ORDER BY s.id DESC
            LIMIT 10
        `);

        const monthlyTrend = {};
        recentScores.forEach(score => {
            if (monthlyTrend[score.month]) {
                monthlyTrend[score.month].total += score.score;
                monthlyTrend[score.month].count += 1;
            } else {
                monthlyTrend[score.month] = { total: score.score, count: 1 };
            }
        });

        const trendData = Object.entries(monthlyTrend).slice(0, 6).map(([month, data]) => ({
            month,
            avgScore: Math.round(data.total / data.count)
        }));

        const recentLogs = queryAll('SELECT * FROM logs ORDER BY id DESC LIMIT 5');

        res.json({
            studentCount,
            classCount,
            courseCount,
            avgScore,
            classDistribution,
            gradeDistribution: gradeMap,
            trendData,
            recentLogs
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/students', (req, res) => {
    try {
        const { page = 1, pageSize = 10, search = '' } = req.query;
        const offset = (page - 1) * pageSize;

        let query = 'SELECT * FROM students WHERE 1=1';
        let countQuery = 'SELECT COUNT(*) as total FROM students WHERE 1=1';
        const params = [];
        const countParams = [];

        if (search) {
            query += ' AND (student_id LIKE ? OR name LIKE ?)';
            countQuery += ' AND (student_id LIKE ? OR name LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
            countParams.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
        params.push(parseInt(pageSize), parseInt(offset));

        const students = queryAll(query, params);
        const total = queryOne(countQuery, countParams).total;

        res.json({ students, total, page: parseInt(page), pageSize: parseInt(pageSize) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/students', (req, res) => {
    try {
        const { student_id, name, gender, class_id, class_name, major, phone, enroll_date } = req.body;

        const existing = queryOne('SELECT id FROM students WHERE student_id = ?', [student_id]);
        if (existing) {
            return res.status(400).json({ error: '学号已存在' });
        }

        db.run(`
            INSERT INTO students (student_id, name, gender, class_id, class_name, major, phone, enroll_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [student_id, name, gender, class_id, class_name, major, phone, enroll_date]);

        db.run('UPDATE classes SET student_count = student_count + 1 WHERE class_id = ?', [class_id]);

        saveDatabase();

        addLog('新增', `新增学生${name}`, '管理员');

        res.json({ id: db.exec('SELECT last_insert_rowid()')[0].values[0][0], message: '添加成功' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/students/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { student_id, name, gender, class_id, class_name, major, phone, enroll_date } = req.body;

        const existing = queryOne('SELECT * FROM students WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({ error: '学生不存在' });
        }

        if (class_id !== existing.class_id) {
            db.run('UPDATE classes SET student_count = student_count - 1 WHERE class_id = ?', [existing.class_id]);
            db.run('UPDATE classes SET student_count = student_count + 1 WHERE class_id = ?', [class_id]);
        }

        db.run(`
            UPDATE students SET student_id=?, name=?, gender=?, class_id=?, class_name=?, major=?, phone=?, enroll_date=?
            WHERE id=?
        `, [student_id, name, gender, class_id, class_name, major, phone, enroll_date, id]);

        saveDatabase();

        addLog('修改', `修改学生${name}的信息`, '管理员');

        res.json({ message: '更新成功' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/students/:id', (req, res) => {
    try {
        const { id } = req.params;

        const student = queryOne('SELECT * FROM students WHERE id = ?', [id]);
        if (!student) {
            return res.status(404).json({ error: '学生不存在' });
        }

        db.run('DELETE FROM students WHERE id = ?', [id]);
        db.run('UPDATE classes SET student_count = student_count - 1 WHERE class_id = ?', [student.class_id]);

        saveDatabase();

        addLog('删除', `删除学生${student.name}`, '管理员');

        res.json({ message: '删除成功' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/scores', (req, res) => {
    try {
        const { page = 1, pageSize = 10, search = '', class_id = '' } = req.query;
        const offset = (page - 1) * pageSize;

        let query = 'SELECT * FROM scores WHERE 1=1';
        let countQuery = 'SELECT COUNT(*) as total FROM scores WHERE 1=1';
        const params = [];
        const countParams = [];

        if (search) {
            query += ' AND (student_id LIKE ? OR student_name LIKE ?)';
            countQuery += ' AND (student_id LIKE ? OR student_name LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
            countParams.push(`%${search}%`, `%${search}%`);
        }

        if (class_id) {
            query += ' AND class_id = ?';
            countQuery += ' AND class_id = ?';
            params.push(class_id);
            countParams.push(class_id);
        }

        query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
        params.push(parseInt(pageSize), parseInt(offset));

        const scores = queryAll(query, params);
        const total = queryOne(countQuery, countParams).total;

        res.json({ scores, total, page: parseInt(page), pageSize: parseInt(pageSize) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/scores', (req, res) => {
    try {
        const { student_id, student_name, class_id, course_name, exam_type, score, semester } = req.body;
        const grade_level = calculateGradeLevel(score);

        db.run(`
            INSERT INTO scores (student_id, student_name, class_id, course_name, exam_type, score, semester, grade_level)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [student_id, student_name, class_id, course_name, exam_type, score, semester, grade_level]);

        saveDatabase();

        addLog('新增', `新增${student_name}的成绩：${course_name} ${score}分`, '管理员');

        res.json({ id: db.exec('SELECT last_insert_rowid()')[0].values[0][0], message: '添加成功' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/scores/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { student_id, student_name, class_id, course_name, exam_type, score, semester } = req.body;
        const grade_level = calculateGradeLevel(score);

        const existing = queryOne('SELECT * FROM scores WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({ error: '成绩不存在' });
        }

        db.run(`
            UPDATE scores SET student_id=?, student_name=?, class_id=?, course_name=?, exam_type=?, score=?, semester=?, grade_level=?
            WHERE id=?
        `, [student_id, student_name, class_id, course_name, exam_type, score, semester, grade_level, id]);

        saveDatabase();

        addLog('修改', `修改${student_name}的成绩：${course_name} ${score}分`, '管理员');

        res.json({ message: '更新成功' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/scores/:id', (req, res) => {
    try {
        const { id } = req.params;

        const score = queryOne('SELECT * FROM scores WHERE id = ?', [id]);
        if (!score) {
            return res.status(404).json({ error: '成绩不存在' });
        }

        db.run('DELETE FROM scores WHERE id = ?', [id]);

        saveDatabase();

        addLog('删除', `删除${score.student_name}的成绩`, '管理员');

        res.json({ message: '删除成功' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/scores/statistics', (req, res) => {
    try {
        const { class_id = '', course_name = '' } = req.query;

        let query = 'SELECT * FROM scores WHERE 1=1';
        const params = [];

        if (class_id) {
            query += ' AND class_id = ?';
            params.push(class_id);
        }

        if (course_name) {
            query += ' AND course_name = ?';
            params.push(course_name);
        }

        const scores = queryAll(query, params);

        if (scores.length === 0) {
            return res.json({ avgScore: 0, maxScore: 0, minScore: 0, passRate: 0 });
        }

        const scoreValues = scores.map(s => s.score);
        const avgScore = scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length;
        const maxScore = Math.max(...scoreValues);
        const minScore = Math.min(...scoreValues);
        const passCount = scoreValues.filter(s => s >= 60).length;
        const passRate = Math.round((passCount / scoreValues.length) * 100);

        res.json({
            avgScore: Math.round(avgScore * 10) / 10,
            maxScore,
            minScore,
            passRate
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/classes', (req, res) => {
    try {
        const classes = queryAll('SELECT * FROM classes ORDER BY id');
        res.json(classes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/classes/:classId/students', (req, res) => {
    try {
        const { classId } = req.params;
        const students = queryAll('SELECT * FROM students WHERE class_id = ?', [classId]);
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/classes', (req, res) => {
    try {
        const { class_id, class_name, major, teacher, classroom } = req.body;

        const existing = queryOne('SELECT id FROM classes WHERE class_id = ?', [class_id]);
        if (existing) {
            return res.status(400).json({ error: '班级ID已存在' });
        }

        db.run(`
            INSERT INTO classes (class_id, class_name, major, teacher, classroom, student_count)
            VALUES (?, ?, ?, ?, ?, 0)
        `, [class_id, class_name, major, teacher, classroom]);

        saveDatabase();

        addLog('新增', `新增班级${class_name}`, '管理员');

        res.json({ id: db.exec('SELECT last_insert_rowid()')[0].values[0][0], message: '添加成功' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/classes/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { class_id, class_name, major, teacher, classroom } = req.body;

        const existing = queryOne('SELECT * FROM classes WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({ error: '班级不存在' });
        }

        db.run(`
            UPDATE classes SET class_id=?, class_name=?, major=?, teacher=?, classroom=?
            WHERE id=?
        `, [class_id, class_name, major, teacher, classroom, id]);

        saveDatabase();

        addLog('修改', `修改班级${class_name}的信息`, '管理员');

        res.json({ message: '更新成功' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/classes/:id', (req, res) => {
    try {
        const { id } = req.params;

        const classInfo = queryOne('SELECT * FROM classes WHERE id = ?', [id]);
        if (!classInfo) {
            return res.status(404).json({ error: '班级不存在' });
        }

        const studentCount = queryOne('SELECT COUNT(*) as count FROM students WHERE class_id = ?', [classInfo.class_id]).count;
        if (studentCount > 0) {
            return res.status(400).json({ error: '该班级还有学生，无法删除' });
        }

        db.run('DELETE FROM classes WHERE id = ?', [id]);

        saveDatabase();

        addLog('删除', `删除班级${classInfo.class_name}`, '管理员');

        res.json({ message: '删除成功' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/login', (req, res) => {
    try {
        const { username, password } = req.body;

        const user = queryOne('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

        if (!user) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                nickname: user.nickname,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/userinfo', (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: '未登录' });
        }

        const token = authHeader.replace('Bearer ', '');
        const user = queryOne('SELECT id, username, nickname, role FROM users WHERE id = ?', [parseInt(token)]);

        if (!user) {
            return res.status(401).json({ error: '用户不存在' });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`服务器运行在 http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});