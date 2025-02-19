export const configuration = () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  host: process.env.HOST ?? 'localhost',
  database: {
    uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/student_scores',
  },
});
