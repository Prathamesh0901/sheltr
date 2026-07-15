'use server'

import { auth, prisma } from '@sheltr/db'
import { headers } from 'next/headers'
import crypto from 'node:crypto'

export async function generateApiKey() {
    const session = await auth.api.getSession({ headers: await headers() })
    if(!session) throw new Error('Unauthorized')

    const key = crypto.randomBytes(32).toString('hex')

    await prisma.apiKey.upsert({
        where: {
            userId: session.user.id
        },
        update: {
            key,
            lastUsed: null
        },
        create: {
            key,
            userId: session.user.id
        }
    })

    return key
}