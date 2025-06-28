export const appConfig = {
    bcryptHash: '',
    bcryptSaltRounds: 12,
    mongoURI: 'mongodb+srv://root_san:toor_san@test-cluster.hfj3cs6.mongodb.net/?retryWrites=true&w=majority&appName=test-cluster',
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    jwtExpiresIn: '24h',
    jwtRefreshExpiresIn: '7d'
}