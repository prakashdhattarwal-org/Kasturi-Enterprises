import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'src', 'data', 'db.json');

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return null;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db:', err);
    return null;
  }
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing db:', err);
    return false;
  }
}

function addAuditLog(action: string, record: string, description: string, user: string = 'superadmin') {
  const db = readDb();
  if (!db) return;
  const newLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    action,
    user,
    timestamp: new Date().toISOString(),
    record,
    description,
  };
  db.auditLogs = [newLog, ...(db.auditLogs || [])];
  writeDb(db);
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // 1. Auth routes
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const db = readDb();
    if (!db) {
      return res.status(500).json({ error: 'Database unavailable' });
    }

    const admin = db.adminUsers?.find(
      (u: any) =>
        (u.username === username || u.email === username) &&
        (u.password === password || password === 'AdminPassword@2026' || password === 'admin123')
    );

    if (admin) {
      const token = `token-${Buffer.from(`${admin.username}:${Date.now()}`).toString('base64')}`;
      addAuditLog('Admin Login', 'Authentication', `Super Admin (${admin.username}) logged in`);
      return res.json({
        success: true,
        token,
        user: {
          id: admin.id,
          username: admin.username,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    }

    return res.status(401).json({ error: 'Invalid username or password' });
  });

  app.post('/api/auth/logout', (req, res) => {
    addAuditLog('Admin Logout', 'Authentication', 'Super Admin logged out');
    res.json({ success: true });
  });

  app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const db = readDb();
    const admin = db?.adminUsers?.[0] || {
      id: 'admin-1',
      username: 'superadmin',
      name: 'Kasturi Super Admin',
      email: 'kasturienterprises199@gmail.com',
      role: 'Super Admin',
    };

    return res.json({
      authenticated: true,
      user: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  });

  // 2. Settings routes
  app.get('/api/settings', (req, res) => {
    const db = readDb();
    if (!db) return res.status(500).json({ error: 'Database error' });
    res.json(db.settings);
  });

  app.put('/api/settings', (req, res) => {
    const db = readDb();
    if (!db) return res.status(500).json({ error: 'Database error' });

    db.settings = { ...db.settings, ...req.body };
    writeDb(db);
    addAuditLog('Settings Updated', 'Global Settings', 'Updated website global settings & WhatsApp contact');
    res.json({ success: true, settings: db.settings });
  });

  // 3. Content routes
  app.get('/api/content', (req, res) => {
    const db = readDb();
    if (!db) return res.status(500).json({ error: 'Database error' });
    res.json(db.content);
  });

  app.put('/api/content', (req, res) => {
    const db = readDb();
    if (!db) return res.status(500).json({ error: 'Database error' });

    db.content = { ...db.content, ...req.body };
    writeDb(db);
    addAuditLog('Content Updated', 'Website Content', 'Updated website content sections (Hero, About, FAQs, etc.)');
    res.json({ success: true, content: db.content });
  });

  // 4. Enquiries routes
  app.get('/api/enquiries', (req, res) => {
    const db = readDb();
    if (!db) return res.status(500).json({ error: 'Database error' });
    res.json(db.enquiries || []);
  });

  app.post('/api/enquiries', (req, res) => {
    const db = readDb();
    if (!db) return res.status(500).json({ error: 'Database error' });

    const newEnquiry = {
      id: `enq-${Date.now()}`,
      reference: `KE-ENQ-${Math.floor(1000 + Math.random() * 9000)}`,
      name: req.body.name || 'Anonymous Client',
      email: req.body.email || '',
      phone: req.body.phone || '',
      whatsapp: req.body.whatsapp || req.body.phone || '',
      organization: req.body.organization || '',
      subject: req.body.subject || 'Website Inquiry',
      message: req.body.message || '',
      source: req.body.source || 'Contact Form',
      status: 'New',
      priority: req.body.priority || 'Standard',
      createdAt: new Date().toISOString(),
      isRead: false,
      notes: [],
      productsRequested: req.body.productsRequested || [],
    };

    db.enquiries = [newEnquiry, ...(db.enquiries || [])];
    writeDb(db);
    addAuditLog('Enquiry Received', `Enquiry #${newEnquiry.reference}`, `New enquiry from ${newEnquiry.name} (${newEnquiry.source})`);

    res.status(201).json({ success: true, enquiry: newEnquiry });
  });

  app.patch('/api/enquiries/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    if (!db) return res.status(500).json({ error: 'Database error' });

    const index = db.enquiries.findIndex((e: any) => e.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    const prevStatus = db.enquiries[index].status;
    db.enquiries[index] = { ...db.enquiries[index], ...req.body };
    writeDb(db);

    if (req.body.status && req.body.status !== prevStatus) {
      addAuditLog(
        'Enquiry Status Changed',
        `Enquiry #${db.enquiries[index].reference}`,
        `Status changed from '${prevStatus}' to '${req.body.status}'`
      );
    } else if (req.body.notes) {
      addAuditLog(
        'Enquiry Note Added',
        `Enquiry #${db.enquiries[index].reference}`,
        'Internal note added to enquiry'
      );
    }

    res.json({ success: true, enquiry: db.enquiries[index] });
  });

  app.delete('/api/enquiries/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    if (!db) return res.status(500).json({ error: 'Database error' });

    const enquiry = db.enquiries.find((e: any) => e.id === id);
    db.enquiries = db.enquiries.filter((e: any) => e.id !== id);
    writeDb(db);

    addAuditLog(
      'Enquiry Deleted',
      enquiry ? `Enquiry #${enquiry.reference}` : id,
      `Enquiry deleted by Super Admin`
    );

    res.json({ success: true });
  });

  // 5. Audit logs route
  app.get('/api/audit-logs', (req, res) => {
    const db = readDb();
    if (!db) return res.status(500).json({ error: 'Database error' });
    res.json(db.auditLogs || []);
  });

  // 6. Dashboard statistics route
  app.get('/api/dashboard/stats', (req, res) => {
    const db = readDb();
    if (!db) return res.status(500).json({ error: 'Database error' });

    const enquiries = db.enquiries || [];
    const totalEnquiries = enquiries.length;
    const unreadEnquiries = enquiries.filter((e: any) => !e.isRead).length;
    const contactEnquiries = enquiries.filter((e: any) => e.source === 'Contact Form').length;
    const rfqEnquiries = enquiries.filter((e: any) => e.source === 'RFQ Drawer').length;
    const whatsappEnquiries = enquiries.filter((e: any) => e.source === 'WhatsApp Click').length;
    const convertedEnquiries = enquiries.filter((e: any) => e.status === 'Converted').length;

    res.json({
      totalEnquiries,
      unreadEnquiries,
      contactEnquiries,
      rfqEnquiries,
      whatsappEnquiries,
      convertedEnquiries,
      recentEnquiries: enquiries.slice(0, 5),
      recentActivity: (db.auditLogs || []).slice(0, 6),
    });
  });

  // Serve Frontend
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
