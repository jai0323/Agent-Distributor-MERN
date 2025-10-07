const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Agent = require('../models/Agent');
const auth = require('../middleware/auth');

// GET /api/agents - list agents
router.get('/', auth, async (req, res) => {
  const agents = await Agent.find().select('-passwordHash');
  res.json(agents);
});

// POST /api/agents - add agent
router.post('/',
  auth,
  body('name').notEmpty(),
  body('email').isEmail(),
  body('mobile').notEmpty(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name, email, mobile, password } = req.body;
      if (await Agent.findOne({ email })) {
        return res.status(400).json({ message: 'Agent email already exists' });
      }
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const agent = new Agent({ name, email, mobile, passwordHash });
      await agent.save();
      res.json({ message: 'Agent created', agent: { id: agent._id, name: agent.name, email: agent.email, mobile: agent.mobile } });
    } catch(err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
