const express = require('express');
const router = express.Router();
const multer = require('multer');
const { parse } = require("csv-parse/sync");
const xlsx = require('xlsx');
const auth = require('../middleware/auth');
const Agent = require('../models/Agent');
const Lead = require('../models/Lead');

// multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    // also check extension
    if (allowed.includes(file.mimetype) || /\.(csv|xls|xlsx)$/i.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Only csv, xls, xlsx files are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// POST /api/upload
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File is required' });

    // get agents - requirement: distribute among 5 agents. Ensure at least 5 agents exist.
    const agents = await Agent.find().limit(100); // fetch all
    if (agents.length < 5) {
      return res.status(400).json({ message: 'At least 5 agents must exist to distribute lists.' });
    }
    // pick first 5 agents (could be changed to selection)
    const selectedAgents = agents.slice(0, 5);

    const buffer = req.file.buffer;
    const name = req.file.originalname.toLowerCase();

    let rows = [];
    if (name.endsWith('.csv') || req.file.mimetype === 'text/csv') {
      const text = buffer.toString('utf8');
      // parse CSV - expecting header: FirstName,Phone,Notes (case-insensitive)
      const records = parse(text, { columns: true, skip_empty_lines: true });
      rows = records;
    } else {
      // XLS or XLSX
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });
      rows = data;
    }

    // Validate each row contains FirstName and Phone
    const normalized = rows.map((r, idx) => {
      // try to map common header names
      const keys = Object.keys(r);
      const mapObj = {};
      // find likely firstname key
      const firstNameKey = keys.find(k => /first/i.test(k)) || keys[0];
      const phoneKey = keys.find(k => /phone|mobile|contact/i.test(k)) || keys[1];
      const notesKey = keys.find(k => /note/i.test(k)) || keys[2] || '';

      return {
        firstName: String(r[firstNameKey] ?? '').trim(),
        phone: String(r[phoneKey] ?? '').trim(),
        notes: String(r[notesKey] ?? '').trim(),
        rawIndex: idx + 1
      };
    });

    // validate
    const invalids = normalized.filter(r => !r.firstName || !r.phone);
    if (invalids.length) {
      return res.status(400).json({ message: `Invalid rows found. Each row must contain FirstName and Phone. Example invalid row indexes: ${invalids.slice(0,5).map(i=>i.rawIndex).join(', ')}` });
    }

    // distribution logic
    const total = normalized.length;
    const base = Math.floor(total / 5); // integer per agent
    const remainder = total % 5;

    // create assignment arrays
    const assignments = [[],[],[],[],[]];
    let cursor = 0;
    // first assign base to each
    for (let i=0;i<5;i++) {
      for (let j=0;j<base;j++) {
        assignments[i].push(normalized[cursor++]);
      }
    }
    // distribute remainder sequentially to agents 0..remainder-1
    for (let r=0;r<remainder;r++) {
      assignments[r].push(normalized[cursor++]);
    }

    // Save leads to DB with corresponding agent
    const savedLeads = [];
    for (let i=0;i<5;i++) {
      const agent = selectedAgents[i];
      const arr = assignments[i];
      for (const item of arr) {
        const lead = new Lead({
          firstName: item.firstName,
          phone: item.phone,
          notes: item.notes,
          agent: agent._id
        });
        await lead.save();
        savedLeads.push({ leadId: lead._id, agentId: agent._id });
      }
    }

    res.json({
      message: 'File processed and distributed successfully',
      total,
      distribution: selectedAgents.map((a, i) => ({ agentId: a._id, agentName: a.name, count: assignments[i].length }))
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/upload/agent/:agentId - get leads for agent
router.get('/agent/:agentId', auth, async (req, res) => {
  const agentId = req.params.agentId;
  try {
    const leads = await Lead.find({ agent: agentId }).select('-__v').lean();
    res.json({ leads });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
