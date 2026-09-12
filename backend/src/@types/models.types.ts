

// User model interface
export interface User {
  _id: string;
  name:string;
  username: string;
  email: string;

  phoneNumber:Number;

  location:string;
  workPlace:string;

  yearOrRole:Object;
  profession:string;
  goal:string;
  bio:string;
  achievements:object;
  preferredLanguage:string;
  

  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Journal model interface
export interface Journal {
  _id: string;
  title: string;
  content: string;
  authorId: string; // Reference to the User model
  createdAt: Date;
  updatedAt: Date;
}

// Task model interface
export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: Date;
  assignedToId: string; // Reference to the User model
  createdAt: Date;
  updatedAt: Date;
}


