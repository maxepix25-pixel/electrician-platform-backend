import mongoose, { Schema, Document } from 'mongoose';

export interface IMaintenance extends Document {
  projectId: mongoose.Types.ObjectId;
  type: 'preventive' | 'corrective';
  description: string;
  assignedTo: mongoose.Types.ObjectId;
  status: 'pending' | 'in-progress' | 'completed';
  scheduledDate: Date;
  completedDate?: Date;
  notes?: string;
}

const maintenanceSchema = new Schema<IMaintenance>(
  {
    projectId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Project',
      required: true 
    },
    type: {
      type: String,
      enum: ['preventive', 'corrective'],
      required: true
    },
    description: { type: String, required: true },
    assignedTo: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    },
    scheduledDate: { type: Date, required: true },
    completedDate: Date,
    notes: String
  },
  { timestamps: true }
);

export default mongoose.model<IMaintenance>('Maintenance', maintenanceSchema);