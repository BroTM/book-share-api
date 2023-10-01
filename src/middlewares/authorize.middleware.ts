
 const authorize = (roles : string[] | string = []) => {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authorize based on user role
        (req: any, res: any, next: any) => {
            if (roles.length && !roles.includes(req.decoded.auth_type)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }
            
            // authentication and authorization successful
            next();
        }
    ];
}

export default authorize;