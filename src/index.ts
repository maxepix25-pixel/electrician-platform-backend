import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongooseConfig from './config/database';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import scheduleRoutes from './routes/schedule.routes';
import communicationRoutes from './routes/communication.routes';
import blueprintRoutes from './routes/blueprint.routes';
import maintenanceRoutes from './routes/maintenance.routes';

dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database Connection
mongooseConfig();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/blueprints', blueprintRoutes);
app.use('/api/maintenance', maintenanceRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'Server is running' });
});

// Socket.IO for real-time communication
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('join-project', (projectId: string) => {
    socket.join(`project-${projectId}`);
    io.to(`project-${projectId}`).emit('user-joined', { 
      userId: socket.id, 
      projectId 
    });
  });

  socket.on('send-message', (data) => {
    io.to(`project-${data.projectId}`).emit('new-message', data);
  });

  socket.on('update-progress', (data) => {
    io.to(`project-${data.projectId}`).emit('progress-updated', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

export { io };