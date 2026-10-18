import bcrypt from 'bcryptjs';
import { User, LibrarySettings, Category, Book, BookCopy, Loan, AuditLog } from '../models/index.js';

export async function seedInitialData() {
  const existingUsers = await User.countDocuments();
  if (existingUsers > 0) {
    console.log('Database already has users; skipping initial seed.');
    return;
  }

  console.log('Seeding initial demo data for APEXLIB...');

  // 1. Settings
  await LibrarySettings.findOneAndUpdate(
    { key: 'default' },
    {
      $set: {
        key: 'default',
        libraryName: 'APEXLIB — Next-Gen Library Management System',
        loanDays: 14,
        maxLoans: 5,
        maxRenewals: 2,
        finePerDay: 2,
        fineMax: 200,
        graceDays: 2,
        reservationExpiryDays: 3,
      },
    },
    { upsert: true, new: true }
  );

  // 2. Demo Users
  const adminPasswordHash = await bcrypt.hash('Admin@123456', 10);
  const librarianPasswordHash = await bcrypt.hash('Librarian@123456', 10);
  const studentPasswordHash = await bcrypt.hash('Member@123456', 10);

  const admin = await User.create({
    name: 'Administrator',
    email: 'admin@library.local',
    password: adminPasswordHash,
    role: 'admin',
    status: 'active',
    memberCode: 'ADM-001',
    phone: '+1-555-0101',
  });

  const librarian = await User.create({
    name: 'Sarah Librarian',
    email: 'sarah.librarian@library.local',
    password: librarianPasswordHash,
    role: 'librarian',
    status: 'active',
    memberCode: 'LIB-001',
    phone: '+1-555-0102',
  });

  const student = await User.create({
    name: 'John Doe',
    email: 'john.doe@student.local',
    password: studentPasswordHash,
    role: 'member',
    status: 'active',
    memberCode: 'STU-001',
    phone: '+1-555-0103',
  });

  console.log('Demo users created:');
  console.log('  Admin:     admin@library.local / Admin@123456');
  console.log('  Librarian: sarah.librarian@library.local / Librarian@123456');
  console.log('  Student:   john.doe@student.local / Member@123456');

  // 3. Categories
  const catCS = await Category.create({
    name: 'Computer Science',
    description: 'Algorithms, Software Architecture, Web Development, and Systems',
    active: true,
  });

  const catFiction = await Category.create({
    name: 'Literature & Fiction',
    description: 'Classic, modern, and award-winning fiction from around the globe',
    active: true,
  });

  const catScience = await Category.create({
    name: 'Science & Mathematics',
    description: 'Physics, Applied Mathematics, and Natural Sciences',
    active: true,
  });

  const catHistory = await Category.create({
    name: 'History & Philosophy',
    description: 'World history, civilizations, philosophical treatises, and society',
    active: true,
  });

  // 4. Books
  const book1 = await Book.create({
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    isbn: '9780132350884',
    authorNames: ['Robert C. Martin'],
    publisher: 'Prentice Hall',
    edition: '1st Edition',
    language: 'English',
    publicationYear: 2008,
    category: catCS._id,
    shelfLocation: 'CS-A1-04',
    description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees.',
    status: 'active',
    totalCopies: 3,
  });

  const book2 = await Book.create({
    title: 'Designing Data-Intensive Applications',
    isbn: '9781449373320',
    authorNames: ['Martin Kleppmann'],
    publisher: 'O\'Reilly Media',
    edition: '1st Edition',
    language: 'English',
    publicationYear: 2017,
    category: catCS._id,
    shelfLocation: 'CS-B2-11',
    description: 'The definitive guide to the architecture of data systems, scalability, consistency, reliability, and maintainability.',
    status: 'active',
    totalCopies: 2,
  });

  const book3 = await Book.create({
    title: 'The Pragmatic Programmer: Your Journey to Mastery',
    isbn: '9780135957059',
    authorNames: ['David Thomas', 'Andrew Hunt'],
    publisher: 'Addison-Wesley',
    edition: '20th Anniversary Edition',
    language: 'English',
    publicationYear: 2019,
    category: catCS._id,
    shelfLocation: 'CS-A1-08',
    description: 'Timeless advice on modern software development practices, career, crafting reusable abstractions, and avoiding duplication.',
    status: 'active',
    totalCopies: 2,
  });

  const book4 = await Book.create({
    title: 'To Kill a Mockingbird',
    isbn: '9780061120084',
    authorNames: ['Harper Lee'],
    publisher: 'HarperCollins',
    edition: '50th Anniversary Edition',
    language: 'English',
    publicationYear: 1960,
    category: catFiction._id,
    shelfLocation: 'LIT-F1-02',
    description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
    status: 'active',
    totalCopies: 2,
  });

  const book5 = await Book.create({
    title: 'Sapiens: A Brief History of Humankind',
    isbn: '9780062316097',
    authorNames: ['Yuval Noah Harari'],
    publisher: 'Harper',
    edition: '1st Edition',
    language: 'English',
    publicationYear: 2014,
    category: catHistory._id,
    shelfLocation: 'HIS-H3-15',
    description: 'A groundbreaking narrative of humanity’s creation and evolution from the Cognitive Revolution to modern biotechnology.',
    status: 'active',
    totalCopies: 2,
  });

  // 5. Inventory Copies
  const c1 = await BookCopy.create({ book: book1._id, accessionNumber: 'ACC-101', status: 'available', condition: 'good' });
  const c2 = await BookCopy.create({ book: book1._id, accessionNumber: 'ACC-102', status: 'available', condition: 'good' });
  const c3 = await BookCopy.create({ book: book1._id, accessionNumber: 'ACC-103', status: 'issued', condition: 'good' });

  await BookCopy.create({ book: book2._id, accessionNumber: 'ACC-201', status: 'available', condition: 'good' });
  await BookCopy.create({ book: book2._id, accessionNumber: 'ACC-202', status: 'available', condition: 'good' });

  await BookCopy.create({ book: book3._id, accessionNumber: 'ACC-301', status: 'available', condition: 'good' });
  await BookCopy.create({ book: book3._id, accessionNumber: 'ACC-302', status: 'available', condition: 'good' });

  await BookCopy.create({ book: book4._id, accessionNumber: 'ACC-401', status: 'available', condition: 'good' });
  await BookCopy.create({ book: book4._id, accessionNumber: 'ACC-402', status: 'available', condition: 'good' });

  await BookCopy.create({ book: book5._id, accessionNumber: 'ACC-501', status: 'available', condition: 'good' });
  await BookCopy.create({ book: book5._id, accessionNumber: 'ACC-502', status: 'available', condition: 'good' });

  // 6. Active Loan
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 10);
  await Loan.create({
    copy: c3._id,
    book: book1._id,
    member: student._id,
    issuedBy: librarian._id,
    dueDate,
    status: 'active',
    renewalCount: 0,
  });

  // 7. Audit Log
  await AuditLog.create({
    actor: admin._id,
    action: 'system.initial_seed',
    resourceType: 'System',
    metadata: { note: 'Initial APEXLIB system seed completed successfully' },
  });

  console.log('Initial APEXLIB library data seeded successfully!');
}
