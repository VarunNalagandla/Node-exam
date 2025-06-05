const express = require('express');
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const { format, isMatch, isValid } = require('date-fns');

const app = express();
app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: path.join(__dirname, 'todoApplication.db'),
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log('Server is Running on http://localhost:3000/');
    });
  } catch (e) {
    console.log(`Database Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const isValidDate = (date) => isMatch(date, 'yyyy-MM-dd') && isValid(new Date(date));
const isValidPriority = (priority) => ['HIGH', 'MEDIUM', 'LOW'].includes(priority);
const isValidStatus = (status) => ['TO DO', 'IN PROGRESS', 'DONE'].includes(status);
const isValidCategory = (category) => ['WORK', 'HOME', 'LEARNING'].includes(category);

const outputResult = (dbObject) => ({
  id: dbObject.id,
  todo: dbObject.todo,
  priority: dbObject.priority,
  category: dbObject.category,
  status: dbObject.status,
  dueDate: dbObject.due_date,
});

// GET todos with filters
app.get('/todos/', async (req, res) => {
  let { search_q = '', priority, status, category } = req.query;

  try {
    let query = 'SELECT * FROM todo WHERE 1=1';
    if (status !== undefined) {
      if (!isValidStatus(status)) return res.status(400).send('Invalid Todo Status');
      query += ` AND status = '${status}'`;
    }
    if (priority !== undefined) {
      if (!isValidPriority(priority)) return res.status(400).send('Invalid Todo Priority');
      query += ` AND priority = '${priority}'`;
    }
    if (category !== undefined) {
      if (!isValidCategory(category)) return res.status(400).send('Invalid Todo Category');
      query += ` AND category = '${category}'`;
    }
    if (search_q !== '') {
      query += ` AND todo LIKE '%${search_q}%'`;
    }

    const data = await database.all(query);
    res.send(data.map(outputResult));
  } catch (e) {
    res.status(500).send('Server Error');
  }
});

// GET specific todo
app.get('/todos/:todoId/', async (req, res) => {
  const { todoId } = req.params;
  const todo = await database.get(`SELECT * FROM todo WHERE id = ${todoId};`);
  res.send(outputResult(todo));
});

// GET todos by agenda (due date)
app.get('/agenda/', async (req, res) => {
  const { date } = req.query;
  if (!isValidDate(date)) return res.status(400).send('Invalid Due Date');

  const formattedDate = format(new Date(date), 'yyyy-MM-dd');
  const todos = await database.all(`SELECT * FROM todo WHERE due_date = '${formattedDate}';`);
  res.send(todos.map(outputResult));
});

// POST new todo
app.post('/todos/', async (req, res) => {
  const { id, todo, priority, status, category, dueDate } = req.body;

  if (!isValidStatus(status)) return res.status(400).send('Invalid Todo Status');
  if (!isValidPriority(priority)) return res.status(400).send('Invalid Todo Priority');
  if (!isValidCategory(category)) return res.status(400).send('Invalid Todo Category');
  if (!isValidDate(dueDate)) return res.status(400).send('Invalid Due Date');

  const formattedDate = format(new Date(dueDate), 'yyyy-MM-dd');
  const insertQuery = `
    INSERT INTO todo (id, todo, category, priority, status, due_date)
    VALUES (${id}, '${todo}', '${category}', '${priority}', '${status}', '${formattedDate}');
  `;
  await database.run(insertQuery);
  res.send('Todo Successfully Added');
});

// PUT update todo
app.put('/todos/:todoId/', async (req, res) => {
  const { todoId } = req.params;
  const { status, priority, todo, category, dueDate } = req.body;

  let updateQuery = 'UPDATE todo SET';
  const updates = [];

  if (status !== undefined) {
    if (!isValidStatus(status)) return res.status(400).send('Invalid Todo Status');
    updates.push(`status = '${status}'`);
  }
  if (priority !== undefined) {
    if (!isValidPriority(priority)) return res.status(400).send('Invalid Todo Priority');
    updates.push(`priority = '${priority}'`);
  }
  if (todo !== undefined) {
    updates.push(`todo = '${todo}'`);
  }
  if (category !== undefined) {
    if (!isValidCategory(category)) return res.status(400).send('Invalid Todo Category');
    updates.push(`category = '${category}'`);
  }
  if (dueDate !== undefined) {
    if (!isValidDate(dueDate)) return res.status(400).send('Invalid Due Date');
    const formattedDate = format(new Date(dueDate), 'yyyy-MM-dd');
    updates.push(`due_date = '${formattedDate}'`);
  }

  if (updates.length === 0) return res.status(400).send('No valid fields provided for update');

  updateQuery += ` ${updates.join(', ')} WHERE id = ${todoId};`;
  await database.run(updateQuery);

  if (status !== undefined) return res.send('Status Updated');
  if (priority !== undefined) return res.send('Priority Updated');
  if (todo !== undefined) return res.send('Todo Updated');
  if (category !== undefined) return res.send('Category Updated');
  if (dueDate !== undefined) return res.send('Due Date Updated');
});

// DELETE todo
app.delete('/todos/:todoId/', async (req, res) => {
  const { todoId } = req.params;
  await database.run(`DELETE FROM todo WHERE id = ${todoId};`);
  res.send('Todo Deleted');
});

module.exports = app;
