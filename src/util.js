// verify if user has 1 of the required roles
export function hasRole(user, requiredRoles) {
    if(user) {
        return user.roles.some(r=> requiredRoles.includes(r))
    }

    return false
}

// verify if user has the admin role
export function hasAdmin(user) {
    if(user) {
        return hasRole(user, ['admin'])
    }
    return false
}

export async function validateSchema(schema,body) {
    try {
        const value = await schema.validateAsync(body)
        return value
    }
    catch (err) { }
}