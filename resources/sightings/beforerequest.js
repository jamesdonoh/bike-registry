if (ctx.query.key !== process.env.API_KEY) {
    cancel("Not authorized", 401);
}