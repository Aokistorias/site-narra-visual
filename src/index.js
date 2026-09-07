export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === "/api/teste") {
            return new Response("Worker funcionando!", {
                headers: {
                    "Content-Type": "text/plain; charset=UTF-8"
                }
            });
        }

        return env.ASSETS.fetch(request);
    }
};