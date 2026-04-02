require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/users',        require('./routes/user.routes'));
// app.use('/api/transactions', require('./routes/transaction.routes'));
// app.use('/api/dashboard',    require('./routes/dashboard.routes'));

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Finance Dashboard API is running' });
});

app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});