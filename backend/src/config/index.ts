export const appConfig = {
    bcryptHash: '',
    bcryptSaltRounds: 12,
    mongoURI: '',
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    jwtExpiresIn: '24h',
    jwtRefreshExpiresIn: '7d'
}