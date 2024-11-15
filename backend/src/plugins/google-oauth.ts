import oauthPlugin, { FastifyOAuth2Options } from '@fastify/oauth2';
import fp from 'fastify-plugin';
import 'dotenv/config';

export default fp(async (fastify) => {
    console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);

    const googleOAuth20ptions: FastifyOAuth2Options = {
        name: 'googleOAuth2',
        scope: ['profile', 'email'],
        credentials: {
            client: {
                id: process.env.GOOGLE_CLIENT_ID || '',
                secret: process.env.GOOGLE_CLIENT_SECRET || '',
            },
        },
        startRedirectPath: '/auth/login/google',
        callbackUri: `https://localhost/backend/auth/login/google/callback`,
        callbackUriParams: {
            access_type: 'offline',
        },
        pkce: 'S256',
        discovery: {
            issuer: 'https://accounts.google.com'
        },
    };

    fastify.register(oauthPlugin.fastifyOauth2, googleOAuth20ptions);
});
