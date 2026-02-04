# Creating Admin Users

## Overview
As of the latest update, users can no longer select the "Admin" role during registration. All new user registrations are automatically assigned the "STUDENT" role by default.

## Creating Admin Users from Backend

To create admin users, you need to directly interact with the database. Here are the recommended approaches:

### Option 1: Using Prisma Studio (Recommended for Development)

1. Start Prisma Studio:
   ```bash
   cd server
   npx prisma studio
   ```

2. Navigate to the `User` model
3. Find the user you want to promote to admin
4. Edit the `role` field and change it from `STUDENT` to `ADMIN`
5. Save the changes

### Option 2: Using Prisma Client Script

Create a script file `server/scripts/create-admin.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const username = process.argv[2];
  const email = process.argv[3];
  const password = process.argv[4];

  if (!username || !email || !password) {
    console.error('Usage: ts-node scripts/create-admin.ts <username> <email> <password>');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created successfully:', {
    id: admin.id,
    username: admin.username,
    email: admin.email,
    role: admin.role,
  });
}

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run the script:
```bash
cd server
npx ts-node scripts/create-admin.ts admin admin@example.com securepassword
```

### Option 3: Promote Existing User to Admin

Create a script file `server/scripts/promote-to-admin.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function promoteToAdmin() {
  const username = process.argv[2];

  if (!username) {
    console.error('Usage: ts-node scripts/promote-to-admin.ts <username>');
    process.exit(1);
  }

  const user = await prisma.user.update({
    where: { username },
    data: { role: 'ADMIN' },
  });

  console.log('User promoted to admin:', {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  });
}

promoteToAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run the script:
```bash
cd server
npx ts-node scripts/promote-to-admin.ts johndoe
```

## Security Note

This change improves security by ensuring that:
- Users cannot self-assign admin privileges during registration
- Admin role assignment is controlled and auditable
- Only backend administrators can create admin users
